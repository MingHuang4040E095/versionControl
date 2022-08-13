const express = require('express')
const router = express.Router()
const moment = require('moment') // 時間相關套件
const userRouter = require('./user.js') //設定api路由 圖片相關的api統一使用 /user
const fs = require('fs') // 檔案相關套件
const {gitInit,gitCommit,gitCheckout,gitGetHashHead} = require('../gitDirectives.js')
//-------------------- 資料庫 ----------------------
const mongoose = require('mongoose')
const Schema = mongoose.Schema

const FileModelSchema = new Schema({
    // 使用者id
    userId: {
        type: String, 
        required: true
    }, 
    // 該使用者的檔案
    files: [
        { 
            fileName:{
                type:String,
                required: true,
            },
            dateCreated: { 
                type: Date, 
                required: true,
                default:Date.now 
            },
            hash: {
                type:String,
                required: true,
            },
            size: { type: Number, required: true },//檔案大小
            type: { type: String, required: true }, //檔案類型
        }
    ]
    // name: { type: String, required: true }, //檔名
    // // fileName: { type: String, required: true }, //加時戳檔名
    // folderName: { type: String, required: true }, // 資料夾名稱
    // // binary: { type: Buffer }, //圖片檔
    // size: { type: Number, required: true }, //檔案大小
    // type: { type: String, required: true }, //檔案類型
    // dateCreated: { type: Date, required: true,default:Date.now }, //上傳時間
    // gitHash: { type: String, required: true }, //git hash值
    // version: {type:Number,required: true} // 版本
})
// 這邊的files是資料表名稱
const FileModel = mongoose.model('files', FileModelSchema)

//------------------------- 查詢圖片 ------------------------------------
router.get('/list/page=:page&limit=:limit', function (req, res) {
    // let {page,limit} = req.params
    let page = Number(req.params.page) //當前頁數
    let limit = Number(req.params.limit) //一頁要顯示幾筆
    let skip = (Number(page) - 1) * Number(limit) //要跳過的數量
    FileModel.aggregate([
        { 
            $group: { 
                _id:'$name',
                name: { $last: "$name" },
                size: { $last: "$size" },
                type:{ $last: "$type" },
                dateUpload:{ $first: "$dateUpload" },
                dateUpdated:{$last: "$dateUpload"},
                version:{$sum:1},
                id:{ $last: "$_id" }
            } 
        },
        { $skip: skip },
        { $limit: limit },
        { $sort : { 'dateUpload' : 1} }
    ]).exec(function(err,result){
        res.json({
            status: err ? false : true,
            data: err ? [] : result,
        })
    })
})

//-------------------------------------------------------------
/**
 * 建立資料夾
 * @param {[String]} folderName 資料夾名稱
 */
function folderCreate(folderName){
    fs.mkdir(`${__dirname}/../file/${folderName}`,function(err){
        if(err) console.log(err)
        return err ? false : true
    })
}
//------------------ multer 上傳檔案 ----------------------
const multer = require('multer')
const fileStorage = multer.diskStorage({
    // // 設定檔案存取位置
    destination: function (req, file, cb) {
        console.log('destination')
        console.log(file)

        const fileName = file.originalname.toLowerCase() // 檔名
        cb(null, `./file/${req.body.userID}/${fileName}/`)
    },
    // 設定檔案命名方式
    filename: function (req, file, cb) {
        // Date.now() + '-' +
        const fileName = file.originalname.toLowerCase() // 檔名
        cb(null, fileName)
    },
}) //如果有設定 storage file的Buffer就會消失

const fileFilter = async (req, file, cb) => {
    console.log('========= fileFilter =========')
    const userID = req.body.userID // 使用者id
    const fileName = file.originalname.toLowerCase() // 檔名
    // 只接受三種圖片格式
    if (!fileName.match(/\.(jpg|JPG|jpeg|JPEG|png|PNG)$/)) {
        cb(new Error('請上傳圖片'))
    }
    // 判斷是否有相同檔案
    let files = []
    try {
        files = await fs.readdirSync(`./file/${userID}/`)
    } catch(err){
        console.log(err)
    }
    // const files = await fs.readdirSync(`./file/${userID}/`) || []
    const isExist = files.includes(fileName) // 是否存在
    file.isExist = isExist // 在file裡面添加isExist屬性
    console.log(isExist)

    // 如果不存在，就幫他建個資料夾&git
    if(!isExist){
        // 建立資料夾
        folderCreate(`${userID}/${fileName}`)
        // 初始化git
        gitInit(`${userID}/${fileName}`)
    }

    cb(null, true)
    console.log('========= fileFilterEnd =========')
}

const upload = multer({
    limits: {
        // 限制上傳檔案的大小為 5MB(5000000)
        fileSize: 5000000, //5MB
    },
    storage:fileStorage,
    fileFilter:fileFilter
}).single('file') //接收單一檔案
// .array('file',12) //最多接收12個名為file的檔案
// .fields([{ name: 'avatar', maxCount: 1 }, { name: 'gallery', maxCount: 8 }]) //接收名為 avatar 和 gallery 欄位的檔案，分別接受最多 1 個和 8 個檔案

/**
 * 查詢是否有此使用者的資料
 * @param {[Object]} params 查詢條件參數
 * @returns {[Object]} 使用者資訊
 */
 async function handleUserFiles(params = {}){
    // 使用者資訊
    const userFiles = {
        status:false,
        data: {
            _id: '',
            userId: '',
            files: []
        },
    }
    // // 要忽略的屬性
    // const ignore = {
    //     password:0 // 不要顯示password這個欄位
    // }
    const resultFindOne = await FileModel.findOne(params).exec()
    console.log(resultFindOne)
    // 將使用者訊回傳
    if(resultFindOne){
        userFiles.status = !!resultFindOne
        userFiles.data = resultFindOne
    }
    return userFiles
}


router.post('/upload',upload,async function (req, res) {
    console.log('========= upload =========')
    console.log(req.body)
    console.log(req.file)

    const userID = req.body.userID // 使用者id
    const fileName = req.file.originalname // 檔案名稱
    const isExist = req.file.isExist // 是否已經有相同的檔案
    const message = isExist ? `異動:${fileName}` : `新增: ${fileName}`

    // 1.提交檔案，並取得hash
    const commitResult = gitCommit(`${userID}/${fileName}/`, fileName, message)
    console.log(commitResult)

    const hashResult = gitGetHashHead(`${userID}/${fileName}/`)
    const hash = hashResult.data.trim()
    console.log(hash)

    const params = {
        userId: userID
    }
    const userFilesResult = await handleUserFiles(params) // 查詢該使用者的files
    // 判斷是否有重複的資料(hash值跟檔案名稱都一樣)
    const isRepeat = userFilesResult.data.files.find(file=>{
        return file.hash === hash && file.fileName === fileName
    })
    let data = {
        status: false,
        data: {
            _id: null,
            userId:userID,
            files: []
        },
        message: '上傳失敗!'
    }
    if(isRepeat){
        console.log('資料重複!!')
        data.message = '資料重複'
        res.json(data)
        return
    }
    if(userFilesResult.status === true){
        // 如果有找到，而且不重複，就去push
        await FileModel.updateOne(
            { _id:userFilesResult.data._id },
            { $addToSet: { 
                files: {
                    fileName: fileName,
                    hash: hash,
                    size: req.file.size,//檔案大小
                    type: req.file.mimetype, //檔案類型
                }
            }},
            function(err,result){
                if(err) return console.log(err)
                data.status = true
                data.data = result
                data.message = '上傳成功'
                console.log(result)
            }
        )
    }else{
        // 如果沒有找到，而且不重複，就去新增
        await FileModel({
            userId: userID,
            files: [{
                fileName: fileName,
                hash: hash,
                size: req.file.size,//檔案大小
                type: req.file.mimetype, //檔案類型
            }]
        }).save(function(err,result){
            if(err) return console.log(err)
            data.status = true
            data.data = result
            data.message = '上傳成功'
            console.log(result)
        })
    }

    res.json(data)

    console.log('========= uploadEnd =========')
})

//------------------ 刪除檔案 ----------------------------
const path = require('path')
function deleteFile(url, name) {
    let files = []
    let status = false //狀態
    if (fs.existsSync(url)) {
        //有找到路徑
        files = fs.readdirSync(url) //取得底下文件
        files.forEach((file) => {
            let curPath = path.join(url, file)
            if (file.indexOf(name) > -1) {
                //是指定文件，則刪除
                fs.unlinkSync(curPath)
                status = true
            }
        })
    } else {
        console.log('路徑不存在!!')
    }
    return status
}


// // 搜尋目標檔案
// function searchTargetFile(name){
//     return FileModel.find({ name: name }).exec(function(err,result){
//         return err ? [] : result
//     })
// }

//刪除圖片
router.delete('/delete', function (req, res) {
    let _id = req.query._id
    let name = req.query.name
    // FileModel.findOne({ _id: req.query._id }).exec(function (err, result) {
    //     console.log(result)
    //     fileID = result._id
    //     fileName = result.fileName

    //     if (fileID && fileName) {
    //         //如果fileID && fileName都有拿到
    //         FileModel.deleteOne({ _id: fileID }, function (err) {
    //             let deleteStatus = false
    //             if (!err) {
    //                 deleteStatus = deleteFile('./uploadImage/', fileName)
    //                 let message = `delete ${fileID}-${fileName}`
    //                 gitCommit(message)
    //             }
    //             res.json({
    //                 status: deleteStatus ? true : false,
    //             })
    //         })
    //     } else {
    //         //刪除失敗
    //         res.json({
    //             status: false,
    //         })
    //     }
    // })

    FileModel.deleteOne({ _id: _id }, function (err) {
        let deleteStatus = false

        // if (!err) {
        //     deleteStatus = deleteFile('./uploadImage/', fileName)
        //     let message = `delete ${fileID}-${fileName}`
        //     gitCommit(message)
        // }
        
        FileModel.find({ name: name }).exec(function(err,result){
            console.log(result)

            if(result.length){
                //如果還有紀錄
                
            }else{
                //如果已經沒有紀錄，就刪除檔案
                deleteStatus = deleteFile('./uploadImage/', result.fileName)
                // let message = `delete ${fileID}-${fileName}`
                // gitCommit(message)
            }
        })

        res.json({
            status: deleteStatus ? true : false,
        })
    })

   
})

//下載檔案
router.get('/download/_id=:_id', function (req, res) {
    let _id = req.params._id
    FileModel.findOne({ _id: _id }).exec(function (err, result) {
        let fileName = result.fileName
        if (fileName) {
            const file = `${__dirname}/../uploadImage/${fileName}`
            res.download(file)
        }
        console.log(result)
    })
})

//搜尋檔案版本清單
router.get('/vsersionList/name=:name',function(req,res){
    let name = req.params.name //取得檔案名稱
    //搜尋所有檔案名稱一樣名稱的資料
    FileModel.aggregate([
        { 
            $match : {name : name}
        },
        { 
            $group: { 
                _id:'$_id',
                name: { $last: "$name" },
                size: { $last: "$size" },
                dateUpload:{ $first: "$dateUpload" },
            } 
        },
        { $sort : { 'dateUpload' : -1} }
    ]).exec(function(err,result){
        console.log(result)
        console.log(err)
        res.json({
            status: err ? false : true,
            data: err ? [] : result,
        })
    })
})

module.exports = router
