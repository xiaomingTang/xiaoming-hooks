import { useState, useEffect } from "react"
import { throttle } from "lodash-es"

export interface Size {
  width: number;
  height: number;
}

function getDocClientSize(): Size {
  return {
    width: document.documentElement.clientWidth,
    height: document.documentElement.clientHeight,
  }
}

function getBodyScrollSize(): Size {
  return {
    width: document.body.scrollWidth,
    height: document.body.scrollHeight,
  }
}

function getWindowInnerSize(): Size {
  return {
    width: window.innerWidth,
    height: window.innerHeight,
  }
}

type SizeType = "DOC_CLIENT_SIZE" | "BODY_SCROLL_SIZE" | "WINDOW_INNER_SIZE"

const getSizeMap: {
  [key in SizeType]: () => Size;
} = {
  DOC_CLIENT_SIZE: getDocClientSize,
  BODY_SCROLL_SIZE: getBodyScrollSize,
  WINDOW_INNER_SIZE: getWindowInnerSize,
}

/**
 * @param type @default "DOC_CLIENT_SIZE"
 * @param throttleMs @default 300
 */
export function useSize(type: SizeType = "DOC_CLIENT_SIZE", throttleMs = 300): Size {
  const [state, setState] = useState<Size>({
    width: 1,
    height: 1,
  })

  useEffect(() => {
    const resizeHandler = throttle(() => {
      const getSizeFunc = getSizeMap[type]
      if (getSizeFunc) {
        setState(getSizeFunc)
      } else {
        console.error(`useSize parameter error: type expected SizeType, got ${type}`)
      }
    }, throttleMs)

    resizeHandler()

    window.addEventListener("resize", resizeHandler)
    // 微信内置浏览器环境下, 屏幕旋转不会触发 resize 事件, 所以额外新增一个 orientationchange 监听
    window.addEventListener("orientationchange", resizeHandler)

    return () => {
      window.removeEventListener("resize", resizeHandler)
      window.removeEventListener("orientationchange", resizeHandler)
    }
  }, [type, throttleMs])

  return state
}
