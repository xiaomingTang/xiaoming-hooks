import { useEffect, useRef, useState } from "react"
import { throttle } from "throttle-debounce"

interface DeviceOrientation {
  /**
   * 用来说明设备是提供的旋转数据是否是绝对定位的布尔值
   */
  absolute: boolean;
  /**
   * 一个表示设备绕z轴旋转的角度（范围在0-360之间）的数字
   */
  alpha: number;
  /**
   * 一个表示设备绕x轴旋转（范围在－180到180之间）的数字，从前到后的方向为正方向
   */
  beta: number;
  /**
   * 一个表示设备绕y轴旋转（范围在－90到90之间）的数字，从左向右为正方向
   */
  gamma: number;
}

const defaultOrientation: DeviceOrientation = {
  absolute: false,
  alpha: 0,
  beta: 0,
  gamma: 0,
}

interface WebkitDeviceOrientationEvent extends DeviceOrientationEvent {
  webkitCompassAccuracy: number;
  webkitCompassHeading: number;
}

/**
 * @param throttleTimeMs @default 200
 */
export function useDeviceOrientation(throttleTimeMs = 200): DeviceOrientation {
  const [orientation, setOrientation] = useState<DeviceOrientation>(defaultOrientation)
  const initialOffsetRef = useRef<number | null>(null)

  useEffect(() => {
    const onOrientationChange = throttle(throttleTimeMs, (e: DeviceOrientationEvent) => {
      // e.absolute 可能为 null 或者其他值(或许什么时候修改了接口呢...), 所以如此判断
      const absolute = e.absolute === true
      let alpha = e.alpha || 0
      const beta = e.beta || 0
      const gamma = e.gamma || 0

      const {
        webkitCompassAccuracy = -1,
        webkitCompassHeading = 0,
      } = (e as WebkitDeviceOrientationEvent)

      if (initialOffsetRef.current === null) {
        if (
          !absolute
          && webkitCompassAccuracy > 0
          && webkitCompassAccuracy < 50
        ) {
          initialOffsetRef.current = webkitCompassHeading
        } else {
          initialOffsetRef.current = alpha
        }
      }

      alpha -= (initialOffsetRef.current || 0)

      if (alpha < 0) {
        alpha += 360
      }

      setOrientation({
        absolute,
        alpha,
        beta,
        gamma,
      })
    })

    window.addEventListener("deviceorientation", onOrientationChange)

    return () => {
      window.removeEventListener("deviceorientation", onOrientationChange)
    }
  }, [throttleTimeMs])

  return orientation
}
