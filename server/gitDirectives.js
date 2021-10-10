const cmd = require('node-cmd') //https://www.npmjs.com/package/node-cmd
/**
 * commit檔案
 * @param {*提交訊息} message 
 */
function gitCommit(message){
    cmd.runSync(`cd ${__dirname}/../uploadImage/ & git add .`)
    const commit = cmd.runSync(
        `cd ${__dirname}/../uploadImage/ & git commit -m "${message}"`
    )
    return commit
    // cmd.runSync(`cd ${__dirname}/../uploadImage/ & git log`)
}


/**
 * 切換commit節點
 * @param {*哈希值} hash 
 * @return {*執行結果} true or false 
 */
function gitCheckout(hash){
    if(!hash) return false
    const checkout = cmd.runSync(
        `cd ${__dirname}/../uploadImage/ & git checkout ${hash}`
    )
    return checkout
}

module.exports = {gitCommit,gitCheckout}
// export {gitCommit,gitCheckout}
