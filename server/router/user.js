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
router.post('/add',function(req,res){
    console.log(req.body)
    //雜湊
    bcrypt.hash(req.body.password, 11, (err, hash) => {
        if(err){ 
            console.log(err)
            res.json({
                status: false
            })
        }else{
            UserModel({
                account: req.body.account,
                password: hash,
            }).save((err, result) => {
                console.log(result)
                let status = err ? false : true

                if(status) folderCreate(result._id) // 建立資料夾
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
    console.log(`${__dirname}/../file`)
    UserModel.find({},{
        password:0 // 不要顯示password這個欄位
    }).exec(function(err,result){
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
    console.log(req.params)
    UserModel.findOne({
        _id:req.params.userID
    },{
        password:0 // 不要顯示password這個欄位
    }).exec(function(err,result){
        console.log(result)
        res.json({
            status:err?false:true,
            data: result
        })
    })
})





module.exports = router