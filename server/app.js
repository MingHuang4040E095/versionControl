const express = require('express')
const app = express()
var history = require('connect-history-api-fallback')
app.use(history())

//------------------ mongoDB ----------------------
const mongoose = require('mongoose')
const moment = require('moment')
const mongoDB = 'mongodb://localhost:27017'
mongoose.connect(mongoDB, { useNewUrlParser: true, useUnifiedTopology: true })
// Get Mongoose to use the global promise library
mongoose.Promise = global.Promise
//Get the default connection
var db = mongoose.connection
//Bind connection to error event (to get notification of connection errors)
db.on('error', console.error.bind(console, 'MongoDB connection error:'))
//Define a schema

var Schema = mongoose.Schema

var SomeModelSchema = new Schema({
    name: { type: String, required: true }, //檔名
    fileName: { type: String, required: true }, //加時戳檔名
    binary: { type: Buffer }, //圖片檔
    size: { type: Number, required: true }, //檔案大小
    type: { type: String, required: true }, //檔案類型
    dateUpload: { type: Date, required: true }, //上傳時間
    dateUpdated: { type: Date }, //更新時間
})
// 這邊的files是資料表名稱
var SomeModel = mongoose.model('files', SomeModelSchema)

//----------------- 雜湊函數 ------------------------
const bcrypt = require('bcryptjs')
const salt = bcrypt.genSaltSync(10)

function hashHandle(text) {
    let hash = bcrypt.hashSync(text, salt)
    return hash
}
//------------------ multer 上傳檔案 ----------------------
//npm i multer
const multer = require('multer')
let storage = multer.diskStorage({
    // // 設定檔案存取位置
    // destination: './uploadImage/',
    // 設定檔案命名方式
    // filename: function (req, file, cb) {
    //     // let hashName = hashHandle(file.originalname)
    //     console.log(file.originalname)
    //     cb(null, file.originalname)
    // },

    destination: function (req, file, cb) {
        console.log(req)
        cb(null, './uploadImage/')
    },
    filename: function (req, file, cb) {
        console.log(file)
        console.log(new Date())
        let hashName = hashHandle(file.originalname)
        console.log(hashName)
        cb(null, Date.now() + '-' + file.originalname)
    },
})

let upload = multer({
    // dest: 'uploadImage/',
    limits: {
        // 限制上傳檔案的大小為 5MB(5000000)
        fileSize: 5000000, //5MB
    },
    fileFilter(req, file, cb) {
        // 只接受三種圖片格式
        let fileName = file.originalname.toLowerCase()
        if (!fileName.match(/\.(jpg|JPG|jpeg|JPEG|png|PNG)$/)) {
            cb(new Error('請上傳圖片'))
        }
        cb(null, true)
    },
    storage,
}).single('file') //接收單一檔案
// .array('file',12) //最多接收12個名為file的檔案
// .fields([{ name: 'avatar', maxCount: 1 }, { name: 'gallery', maxCount: 8 }]) //接收名為 avatar 和 gallery 欄位的檔案，分別接受最多 1 個和 8 個檔案

app.listen(3000, () => {
    console.log('啟動')
    console.log(moment(new Date()).format('YYYY-MM-DD hh:mm:ss'))
})

// app.use(express.static(path.resolve('./') + '/dist/'))
// app.get('/', function (req, res) {
//     res.sendFile(path.resolve('./') + '/dist/index.html')
// })

//查詢圖片
app.get('/imagesList/page=:page&limit=:limit', function (req, res) {
    // let {page,limit} = req.params
    let page = Number(req.params.page) //當前頁數
    let limit = Number(req.params.limit) //一頁要顯示幾筆
    let skip = (Number(page) - 1) * Number(limit) //要跳過的數量
    SomeModel.find({})
        .skip(skip)
        .limit(limit)
        .exec(function (err, result) {
            res.json({
                status: err ? false : true,
                data: err ? [] : result,
            })
        })
})

//上傳圖片
app.post('/imageUpload', upload, function (req, res) {
    console.log(res)
    SomeModel({
        name: req.file.originalname, //檔名
        fileName: req.file.filename, //加時戳檔名
        binary: req.file.buffer, //圖片
        size: req.file.size, //檔案大小
        type: req.file.mimetype, //檔案類型
        dateUpload: moment(new Date()).format('YYYY-MM-DD hh:mm:ss'), //上傳日期
    }).save(function (err, result) {
        console.log(err)
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
        console.log(files)
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

//刪除圖片
app.delete('/imageDelete', function (req, res) {
    // query: { _id: '6096a5f15c003b43e0f4234b' },

    let fileID = ''
    let fileName = ''
    SomeModel.findOne({ _id: req.query._id }).exec(function (err, result) {
        console.log(result)
        fileID = result._id
        fileName = result.fileName
        if (fileID && fileName) {
            //如果fileID && fileName都有拿到
            SomeModel.deleteOne({ _id: fileID }, function (err, result) {
                let deleteStatus = false
                if (!err) {
                    deleteStatus = deleteFile('./uploadImage/', fileName)
                }
                res.json({
                    status: deleteStatus ? true : false,
                })
            })
        } else {
            //刪除失敗
            res.json({
                status: false,
            })
        }
    })
})

//下載檔案
app.get('/imageDownload/_id=:_id', function (req, res) {
    let _id = req.params._id
    SomeModel.findOne({ _id: _id }).exec(function (err, result) {
        let fileName = result.fileName
        if (fileName) {
            const file = `${__dirname}/uploadImage/${fileName}`
            res.download(file)
        }
        console.log(result)
    })
})
