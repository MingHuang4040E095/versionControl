module.exports = {
    transpileDependencies: ['vuetify'],
    lintOnSave: false, // 關閉eslint
    devServer: {
        proxy: 'http://192.168.1.105:3000/',
    },
}
