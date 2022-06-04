const express = require('express')
const router = express.Router()
const bcrypt = require("bcryptjs");
const fs = require('fs') // 檔案相關套件

//-------------------- 資料庫 ----------------------
const mongoose = require('mongoose')
const Schema = mongoose.Schema
const UserModelSchema = new Schema({
    account:{type:String,required:true}, // 使用者帳號
    password:{type:String,required:true}, // 密碼
    dateCreated: { type: Date, required: true,default:Date.now }, //建立時間
})
// 這邊的user是資料表名稱
const UserModel = mongoose.model('user', UserModelSchema)
//----------------------------------------------------
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

// 新增使用者
router.post('/add',async function(req,res){
    // -- 1.先搜尋有沒有相同帳號
    console.log('add user step1: check')
    const params = {
        account: req.body.account
    }
    const resultCheck = await handleUserDetail(params)
    // 如果帳號已經存在
    if(resultCheck.status){
        return res.json({
            status:false,
            data:null,
            message:'帳號已經存在'
        })
    }
    console.log(resultCheck)

    // -- 2.密碼雜湊
    console.log('add user step2: hash password')
    const hashPassword = await bcrypt.hash(req.body.password, 11);
    console.log(hashPassword)

    // -- 3.新增使用者
    console.log('add user step3: add user')
    const resultAdd = await UserModel({
        account: req.body.account,
        password: hashPassword,
    }).save()
    console.log(resultAdd)

    // -- 4.建立資料夾
    console.log('add user step3: create folder')
    if(resultAdd) folderCreate(resultAdd._id) // 建立資料夾

    res.json({
        status:!!resultAdd,
        data:resultAdd
    })
})

// 查詢使用者
router.get('/list',function(req,res){
    console.log(`${__dirname}/../file`)
    UserModel.find({},{
        password:0 // 不要顯示password這個欄位
    }).exec(function(err,result){
        res.json({
            status: err ? false : true,
            data: err ? [] : result,
        })
    })
})


// 處理使用者詳細資料
async function handleUserDetail(params = {}){
    // 使用者資訊
    const userInfo = {
        status:false,
        data: {
            account: "",
            dateCreated: "",
            __v: 0,
            _id: "",
        }
    }
    // 要忽略的屬性
    const ignore = {
        password:0 // 不要顯示password這個欄位
    }
    // 用exec沒辦法同步，改用then
    await UserModel.findOne(params,ignore).then((result)=>{
        userInfo.status = !!result // 設定狀態
        if(!result) return 
        userInfo.data = result // 將查詢結果放到data中
    })
    // 將使用者訊回傳
    return userInfo
}

// 查詢使用者詳細資料
router.get('/detail/userID=:userID',async (req,res)=>{
    const params = {
        _id:req.params.userID
    }
    const result = await handleUserDetail(params)
    return res.json(result)
})

module.exports = {
    router,
    handleUserDetail
}