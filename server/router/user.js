const express = require('express')
const router = express.Router()
//-------------------- 資料庫 ----------------------
const mongoose = require('mongoose')
const Schema = mongoose.Schema
const UserModelSchema = new Schema({
    account:{type:String,required:true}, // 使用者帳號
    password:{type:String,required:true}, // 密碼
})
//----------------------------------------------------
// 這邊的files是資料表名稱
const UserModel = mongoose.model('user', UserModelSchema)

router.post('/add',(req,res)=>{
    console.log(req)
    // UserModel({
    //     account:req.
    //     password:
    // }).save((err,result)=>{

    // })

    res.json({
        status: true
    })
})



module.exports = router