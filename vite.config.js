/** @type {import('vite').UserConfig} */
export default {
  base: './',
  build: {
    target: 'modules',
    outDir: 'dist', //指定输出路径
    assetsDir: 'assets', // 指定生成静态资源的存放路径
    minify: 'terser', // 混淆器，terser构建后文件体积更小
    assetsInlineLimit: 4096,
  },
  publicDir:'assets',
  server: {
    open: true
  }
}
