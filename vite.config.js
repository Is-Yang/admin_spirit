const path = require("path");

const target = 'https://xcx.yulue.net' // 后端 测试接口的地址.

module.exports = {
  alias: {
    '/@/': path.resolve(__dirname, 'src')
  },
  /**
   * 在生产中服务时的基本公共路径。
   * @default '/'
   */
  base: "./",
  /**
   * 与“根”相关的目录，构建输出将放在其中。如果目录存在，它将在构建之前被删除。
   * @default 'dist'
   */
  outDir: "dist",
  port: 3000,
  // 是否自动在浏览器打开
  open: false,
  // 是否开启 https
  https: false,
  // 服务端渲染
  ssr: false,
  // 引入第三方的配置
  optimizeDeps: {
    include: ["axios"],
  },
  proxy: {
    '/api/v1': {
      target: target,
      changeOrigin: true
    }
  },
};