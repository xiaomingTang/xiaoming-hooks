import { useEffect, useState } from "react"
import { throttle } from "lodash-es"
import { voidFunc } from "@Src/funcs/utils"
import { observeDOM } from "@Src/funcs/observeDom"

interface ScrollInfo {
  distanceWithTop: number;
  distanceWithBottom: number;
  element: HTMLElement;
}

const defaultScrollInfo: ScrollInfo = {
  distanceWithTop: 0,
  distanceWithBottom: 0,
  element: document.body,
}

export function getScrollInfo(element: HTMLElement): ScrollInfo {
  return {
    distanceWithTop: element.scrollTop,
    distanceWithBottom: element.scrollHeight - element.scrollTop - element.clientHeight,
    element,
  }
}

export function useScrollInfo(throttleTime = 500) {
  const [element, setElement] = useState<HTMLDivElement | null>(null)
  const [scrollInfo, setScrollInfo] = useState<ScrollInfo>(defaultScrollInfo)

  useEffect(() => {
    if (element) {
      const onScroll = throttle(() => {
        setScrollInfo(getScrollInfo(element))
      }, throttleTime, {
        leading: true,
        trailing: true,
      })
      onScroll()
      element.addEventListener("scroll", onScroll)
      const disconnect = observeDOM(element, onScroll)
      return () => {
        element.removeEventListener("scroll", onScroll)
        disconnect()
      }
    }
    return voidFunc
  }, [element, throttleTime])

  return [scrollInfo, setElement] as const
}
