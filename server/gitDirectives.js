const cmd = require('node-cmd') //https://www.npmjs.com/package/node-cmd

/**
 * 初始化git
 * @param {[String]} path 路徑
 */
function gitInit(path){
    const init = cmd.runSync(`cd ${__dirname}/file/${path} & git init`)
    return init
}

/**
 * commit檔案
 * @param {[String]} path 路徑
 * @param {[String]} fileName 檔案名稱
 * @param {[String]} message 提交訊息
 */
function gitCommit(path= '',fileName = '',message = ''){
    const folderPath = `cd ${__dirname}/file/${path}` // 資料夾路徑
    cmd.runSync(`${folderPath} & git add ${fileName || '.'}`)
    cmd.runSync(
        `${folderPath} & git commit -m "fileName: ${fileName}\n message: ${message}"`
    )
    const log = cmd.runSync(`${folderPath} & git log`)
    console.log(log.data)
    return log.data
}

/**
 * 切換分支
 * @param {[String]} userID 使用者id
 * @param {[String]} branchName  分支名稱
 * @param {[Boolean]} create 是否要建立新分支(預設false)
 * @return {[Boolean]} true or false 執行結果
 */
function gitCheckout(userID = '',branchName = '', create = false){
    if(!userID || !branchName) return false
    // 建立新分之並切換的指令
    const directivesCreate = `cd ${__dirname}/file/${userID}/ & git checkout -b ${branchName}`
    // 切換分支的指令
    const directivesSwitch = `cd ${__dirname}/file/${userID}/ & git checkout ${branchName}`
    // 根據create判斷要用哪個指令
    const directives = create ? directivesCreate : directivesSwitch
    const checkout = cmd.runSync(directives)
    return checkout
}

/**
 * 取得該分支的最後一個commit的hash值
 * @param {[String]} userID 使用者id
 * @param {[String]} branchName 分支名稱
 * @returns {[String]} hash值
 */
function gitGetHashBranchLast(userID = '', branchName = 'master'){
    // 最後一筆commit的hash
    const lastHash = cmd.runSync(
        `cd ${__dirname}/file/${userID}/ & git rev-parse ${branchName}`
    )
    return lastHash
}

/**
 * 取得目前commit點位的hash值
 * @param {[path]} path 路徑
 * @returns {[String]} hash值
 */
function gitGetHashHead(path = ''){
    const currentCommitHash = cmd.runSync(
        `cd ${__dirname}/file/${path} & git rev-parse HEAD`
    )
    return currentCommitHash
}

module.exports = {gitInit,gitCommit,gitCheckout,gitGetHashBranchLast,gitGetHashHead}
// export {gitCommit,gitCheckout}
