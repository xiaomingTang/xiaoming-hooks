import { hot } from "react-hot-loader/root"
import React, { useEffect } from "react"

import "@Examples/global"

import {
  useDeviceOrientation, useSize, useTimer,
} from "@Src/index"

import Styles from "./App.module.less"

function App() {
  const size = useSize()
  const { duration, resetTimer } = useTimer()
  const orientation = useDeviceOrientation()

  useEffect(() => {
    resetTimer({
      target: new Date().getTime() + 5000,
    })
  }, [size, resetTimer])

  return <div className={Styles.success}>
    <div> width: {size.width}, height: {size.height} </div>
    <div> duration: {duration} </div>
    <pre>
      {JSON.stringify(orientation, null, 2)}
    </pre>
  </div>
}

export default hot(App)
