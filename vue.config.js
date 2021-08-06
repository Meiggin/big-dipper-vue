
module.exports = {
  productionSourceMap: false,
  publicPath: '/',
  devServer: {
    port: 8089, // 端口号
    host: '0.0.0.0',
    https: false, // https:{type:Boolean}
    open: true, //配置自动启动浏览器
  }
}
