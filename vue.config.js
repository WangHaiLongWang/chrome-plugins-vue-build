const { defineConfig } = require("@vue/cli-service");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const path = require("path");
const resolve = (path) => path.resolve(__dirname ,path)

// 定义好输出的名称
const packageName = "chrome-extension-examples"

// 将静态文件以及manifest.json 文件copy到打包文件中，需要使用到copy-webpack-plugin
const copyFile = [
  { // pubilc
    from :  path.resolve("public"),
    to: path.resolve(packageName)
  },
  { // manifest 
    from : path.resolve(__dirname, "manifest.json"),
    to: path.resolve(packageName, "manifest.json")
  }
]

const plugins = [
  new CopyWebpackPlugin({
    patterns: copyFile
  })
] 

module.exports = defineConfig({
  transpileDependencies: true,
  pages: { // 在 multi-page 模式下构建应用。每个“page”应该有一个对应的 JavaScript 入口文件。其值应该是一个对象，对象的 key 是入口的名字，value 是： 一个指定了 entry, template, filename, title 和 chunks 的对象 (除了 entry 之外都是可选的)；或一个指定其 entry 的字符串。
    // 配置popup
    popup: {
      entry: "src/popup/popup.js",
      template: "src/popup/popup.html",
      filename: "popup.html"
    }
  },
  productionSourceMap: false, // 如果你不需要生产环境的 source map，可以将其设置为 false 以加速生产环境构建
  outputDir: path.join(__dirname, packageName), // 当运行 vue-cli-service build 时生成的生产环境构建文件的目录。注意目标目录的内容在构建之前会被清除 (构建时传入 --no-clean 可关闭该行为)。 default: dist
  configureWebpack: { // 如果这个值是一个对象，则会通过 webpack-merge 合并到最终的配置中。 如果这个值是一个函数，则会接收被解析的配置作为参数。该函数既可以修改配置并不返回任何东西，也可以返回一个被克隆或合并过的配置版本。
    watch: true, //启用 Watch 模式。这意味着在初始构建之后，webpack 将继续监听任何已解析文件的更改
    entry: { // 打包入口 需要配置 content background popup
      content:  "/src/content-script/content-script.js",
      background:  "/src/background/background.js",
      popup: "/src/popup/popup.js",
    },
    output: {
      filename: "js/[name].js"
    },
    plugins: plugins,
    optimization: {
      splitChunks: false //不允许切分，打包时文件太大的情况会被webpack切分成几个文件
    }
  },
  css: {
    extract: { //是否将组件中的 CSS 提取至一个独立的 CSS 文件中 (而不是动态注入到 JavaScript 中的 inline 代码)。
      filename: "css/[name].css"
    }
  },
  lintOnSave: false
})
