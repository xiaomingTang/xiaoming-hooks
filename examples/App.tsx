import { hot } from "react-hot-loader/root"
import React from "react"

import "@Examples/global"

import { useSize } from "@Src/index"

import Styles from "./App.module.less"

function App() {
  const size = useSize()
  return <div className={Styles.success}>
    width: {size.width}, height: {size.height}
  </div>
}

export default hot(App)
