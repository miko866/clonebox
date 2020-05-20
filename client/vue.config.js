/*
 *  Vue Config
 */

module.exports = {
  "transpileDependencies": [
    "vuetify"
  ],
  devServer: {
    host: '0.0.0.0',
    port: 5700,
    https: false,
    disableHostCheck: true,
  },
  runtimeCompiler: true,
  chainWebpack: (config) => {
    config.module
      .rule('eslint')
      .use('eslint-loader')
      .options({
        fix: true,
      });
  },
}
