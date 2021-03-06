import path from "path"
import webpack from "webpack"
import HtmlWebpackPlugin from "html-webpack-plugin"

import { HotModuleReplacementPlugin } from "webpack"
import { merge } from "webpack-merge"

import Paths from "./paths"
import { appName } from "./constants"
import commonWebpackConfig from "./webpack.common.config"
import { getEnvConfig } from "./utils"

const definePluginOption: Record<string, string> = Object.entries(getEnvConfig()).reduce((prev, [key, val]) => {
  prev[`process.env.${key}`] = JSON.stringify(val)
  return prev
}, {})

const devWebpackConfig = merge(commonWebpackConfig, {
  mode: "development",
  devtool: "inline-cheap-module-source-map",
  entry: {
    // HtmlWebpackPlugin.Options.chunks 需要跟着 entry 一起改动, 指出该 HtmlWebpackPlugin 需要的 chunks.
    examples: ["react-hot-loader/patch", path.resolve(Paths.Examples, "index.tsx")],
  },
  output: {
    path: Paths.DistExample,
    filename: "static/scripts/[name].[hash:6].js",
    chunkFilename: "static/scripts/chunk-[name].js",
  },
  devServer: {
    contentBase: Paths.DistExample,
    // https: true,
    host: "0.0.0.0",
    port: 8001,
    useLocalIp: true,
    hot: true,
    open: true,
    openPage: "./examples.html",
    // 开发时代理, 可解决开发时跨域问题
    proxy: [
      {
        context: [
          "/your-custom-api",
        ],
        target: "https://your-website.com",
        secure: false,
        changeOrigin: true,
      },
    ],
  },
  plugins: [
    ...commonWebpackConfig.plugins,
    new HotModuleReplacementPlugin(),
    // 该版本类型暂未适配 webpack@5
    new HtmlWebpackPlugin({
      template: path.join(Paths.Public, "examples.html"),
      filename: "examples.html",
      title: appName,
      inject: "body",
      chunks: ["examples"],
      // hash: true, // 不 hash
    }) as unknown as webpack.Plugin,
    new webpack.DefinePlugin(definePluginOption),
  ]
})

export default devWebpackConfig
