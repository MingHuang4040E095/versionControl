const express = require('express')
const router = express.Router()
const bcrypt = require("bcryptjs");


// // create application/json parser
// const jsonParser = bodyParser.json()
// // create application/x-www-form-urlencoded parser
// const urlencodedParser = bodyParser.urlencoded({ extended: false })
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

router.post('/add',function(req,res){
    
    //雜湊
    bcrypt.hash(req.body.password, 11, (err, hash) => {
        if(err){ 
            res.json({
                status: false
            })
        }else{
            UserModel({
                account: req.body.account,
                password: hash,
            }).save((err, result) => {
                status = err ? false : true
                res.json({
                    status: status,
                    data:result
                })
            });
        }
    });
})



module.exports = router