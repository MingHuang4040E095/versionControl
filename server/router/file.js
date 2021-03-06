const express = require('express')
const router = express.Router()
const moment = require('moment') // 時間相關套件
const userRouter = require('./user.js') //設定api路由 圖片相關的api統一使用 /user
// const fs = require('fs') // 檔案相關套件
const {gitCommit,gitCheckout} = require('../gitDirectives.js')
//-------------------- 資料庫 ----------------------
const mongoose = require('mongoose')
const Schema = mongoose.Schema

const SomeModelSchema = new Schema({
    name: { type: String, required: true }, //檔名
    // fileName: { type: String, required: true }, //加時戳檔名
    folderName: { type: String, required: true }, // 資料夾名稱
    // binary: { type: Buffer }, //圖片檔
    size: { type: Number, required: true }, //檔案大小
    type: { type: String, required: true }, //檔案類型
    dateUpload: { type: Date, required: true }, //上傳時間
    dateUpdated: { type: Date }, //更新時間
    gitHash: { type: String, required: true }, //git hash值
})
// 這邊的files是資料表名稱
const SomeModel = mongoose.model('files', SomeModelSchema)

//------------------ multer 上傳檔案 ----------------------
//npm i multer node-cmd
// const cmd = require('node-cmd') //https://www.npmjs.com/package/node-cmd
const multer = require('multer')
// let storage = multer.diskStorage({
//     // // 設定檔案存取位置
//     destination: function (req, file, cb) {
//         cb(null, './uploadImage/')
//     },
//     // 設定檔案命名方式
//     filename: function (req, file, cb) {
//         // Date.now() + '-' +
//         cb(null, file.originalname)
//     },
// })

let upload = multer({
    // dest: 'uploadImage/',
    limits: {
        // 限制上傳檔案的大小為 5MB(5000000)
        fileSize: 5000000, //5MB
    },
    fileFilter(req, file, cb) {
        // console.log(file)
        // 只接受三種圖片格式
        let fileName = file.originalname.toLowerCase()
        if (!fileName.match(/\.(jpg|JPG|jpeg|JPEG|png|PNG)$/)) {
            cb(new Error('請上傳圖片'))
        }
        cb(null, true)
    },
    storage: multer.diskStorage({
        // // 設定檔案存取位置
        destination: function (req, file, cb) {
            cb(null, './uploadImage/')
        },
        // 設定檔案命名方式
        filename: function (req, file, cb) {
            // Date.now() + '-' +
            cb(null, file.originalname)
        },
    }), //如果有設定 storage file的Buffer就會消失
}).single('file') //接收單一檔案
// .array('file',12) //最多接收12個名為file的檔案
// .fields([{ name: 'avatar', maxCount: 1 }, { name: 'gallery', maxCount: 8 }]) //接收名為 avatar 和 gallery 欄位的檔案，分別接受最多 1 個和 8 個檔案

// function gitCommit(type, result) {
//     let message = `${type} ${result._id}-${result.name}`
//     let resultCommit = gitCommit(message)
//     console.log(resultCommit)
//     // const gitAdd = cmd.runSync('cd ${__dirname}/../uploadImage/ & git add .')
//     // const gitCommit = cmd.runSync(
//     //     `cd ${__dirname}/../uploadImage/ & git commit -m "${type} ${result._id}-${result.name}"`
//     // )
//     // const gitLog = cmd.runSync(`cd ${__dirname}/../uploadImage/ & git log`)
//     // console.log(gitLog.data)
//     // console.log(gitAdd.data)
//     // console.log(gitCommit.data)
// }

//------------------------- 查詢圖片 ------------------------------------
router.get('/list/page=:page&limit=:limit', function (req, res) {
    // let {page,limit} = req.params
    let page = Number(req.params.page) //當前頁數
    let limit = Number(req.params.limit) //一頁要顯示幾筆
    let skip = (Number(page) - 1) * Number(limit) //要跳過的數量
    SomeModel.aggregate([
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

// 查詢使用者的資料夾
function getFolderName(req, res,next){
    console.log('getFolderName')
    console.log(userRouter)
    const userInfo = userRouter.handleUserDetail(req.params)
    console.log(userInfo)
    // userRouter.handleUserDetail(req.params).then(result=>{
    //     console.log(result)
    // })
    next()
}

//----------------------- 上傳圖片 ------------------------------------
router.post('/upload',getFolderName, upload, function (req, res) {
    // console.log(req.file)
    //先去找是否有相同檔名
    // SomeModel.findOne({ name: req.file.originalname }).exec(function (err, result) {

    // })
    console.log('upload')
    SomeModel({
        name: req.file.originalname, //檔名
        // fileName: req.file.filename, //加時戳檔名
        // binary: req.file.buffer, //圖片
        size: req.file.size, //檔案大小
        type: req.file.mimetype, //檔案類型
        dateUpload: moment(new Date()).format('YYYY-MM-DD hh:mm:ss'), //上傳日期
    }).save(function (err, result) {
        // console.log(err)
        if (!err) {
            // gitCommit('upload', result)
            let message = `upload ${result._id}-${result.name}`
            let gitlog = gitCommit(message)
        }
        res.json({
            status: err ? false : true,
        })
    })
})

//------------------ 刪除檔案 ----------------------------
const fs = require('fs')
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
//     return SomeModel.find({ name: name }).exec(function(err,result){
//         return err ? [] : result
//     })
// }

//刪除圖片
router.delete('/delete', function (req, res) {
    let _id = req.query._id
    let name = req.query.name
    // SomeModel.findOne({ _id: req.query._id }).exec(function (err, result) {
    //     console.log(result)
    //     fileID = result._id
    //     fileName = result.fileName

    //     if (fileID && fileName) {
    //         //如果fileID && fileName都有拿到
    //         SomeModel.deleteOne({ _id: fileID }, function (err) {
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

    SomeModel.deleteOne({ _id: _id }, function (err) {
        let deleteStatus = false

        // if (!err) {
        //     deleteStatus = deleteFile('./uploadImage/', fileName)
        //     let message = `delete ${fileID}-${fileName}`
        //     gitCommit(message)
        // }
        
        SomeModel.find({ name: name }).exec(function(err,result){
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
    SomeModel.findOne({ _id: _id }).exec(function (err, result) {
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
    SomeModel.aggregate([
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
