const express = require('express')
const router = express.Router()
const bcrypt = require("bcryptjs");
//-------------------- 資料庫 ----------------------
const mongoose = require('mongoose')
const Schema = mongoose.Schema
const UserModelSchema = new Schema({
    account:{type:String,required:true}, // 使用者帳號
    password:{type:String,required:true}, // 密碼
    dateCreated: { type: Date, required: true }, //建立時間
})
// 這邊的user是資料表名稱
const UserModel = mongoose.model('user', UserModelSchema)
//----------------------------------------------------

// 新增使用者
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

// 查詢使用者
router.get('/list',function(req,res){
    UserModel.aggregate([
        { 
            $group: { 
                _id:'$_id',
                account: { $last: "$account" },
            } 
        },
    ]).exec(function(err,result){
        res.json({
            status: err ? false : true,
            data: err ? [] : result,
        })
    })
    // UserModel.find().exec(function(err,result){
    //     res.json({
    //         status:err?false:true,
    //         data: err? [] : result
    //     })
    // })
})

// 查詢使用者詳細資料
router.get('/detail/userID=:userID',function(req,res){
    UserModel.aggregate([
        { 
            $group: { 
                _id:'$_id',
                account: { $last: "$account" },
            } 
        },
    ]).exec(function(err,result){
        console.log(result)
        res.json({
            status:err?false:true,
            data: result
        })
    })
})





module.exports = router