const cmd = require('node-cmd') //https://www.npmjs.com/package/node-cmd
/**
 * commit檔案
 * @param {*提交訊息} message 
 */
function gitCommit(message){
    cmd.runSync(`cd ${__dirname}/uploadImage/ & git add .`)
    cmd.runSync(
        `cd ${__dirname}/uploadImage/ & git commit -m "${message}"`
    )
    // const log = cmd.runSync(`cd ${__dirname}/uploadImage/ & git log`)
    // console.log(log.data)
    return log.data
}


/**
 * 切換commit節點
 * @param {*哈希值} hash 
 * @return {*執行結果} true or false 
 */
function gitCheckout(hash){
    if(!hash) return false
    const checkout = cmd.runSync(
        `cd ${__dirname}/uploadImage/ & git checkout ${hash}`
    )
    return checkout
}

/**
 * 取得該分支的最後一個commit的hash值
 * @param {*分支名稱} branchName 
 * @returns {hash值}
 */
function gitGetHashBranchLast(branchName = 'master'){
    // 最後一筆commit的hash
    const lastHash = cmd.runSync(
        `cd ${__dirname}/uploadImage/ & git rev-parse ${branchName}`
    )
    return lastHash
}

/**
 * 取得目前commit點位的hash值
 * @returns {hash值}
 */
function gitGetHashHead(){
    const currentCommitHash = cmd.runSync(
        `cd ${__dirname}/uploadImage/ & git rev-parse HEAD`
    )
    return currentCommitHash
}

module.exports = {gitCommit,gitCheckout,gitGetHashBranchLast,gitGetHashHead}
// export {gitCommit,gitCheckout}
