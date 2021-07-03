const express = require('express')
const app = express()
var history = require('connect-history-api-fallback')
app.use(history()) //讓前端網址不要有/#/

//------------------ mongoDB ----------------------
const mongoose = require('mongoose') //資料庫
const mongoDB = 'mongodb://localhost:27017' //資料庫ip
mongoose.connect(mongoDB, { useNewUrlParser: true, useUnifiedTopology: true })
// Get Mongoose to use the global promise library
mongoose.Promise = global.Promise
//Get the default connection
var db = mongoose.connection
//Bind connection to error event (to get notification of connection errors)
db.on('error', console.error.bind(console, 'MongoDB connection error:'))

const imageRouter = require('./router/image.js') //設定api路由 圖片相關的api統一使用 /image
app.use('/image', imageRouter)

app.listen(3000, () => {
    console.log('啟動')
})
