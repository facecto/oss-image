module.exports = {
    lintOnSave: false,
    devServer: {
        proxy: {
            '/': {
                ws: false,
                target: 'http://localhost:8686',
                changeOrigin: true,
                pathRewrite: {
                    '^/api': '/'
                }
            }
        }
    }
}
