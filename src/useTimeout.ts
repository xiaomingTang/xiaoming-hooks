import {
  useMemo, useState, useEffect, useRef,
} from "react"

export function useTimeout<Args extends unknown[]>(handler: (...args: Args) => void, timeout?: number, ...args: Args) {
  const flagRef = useRef(-1)

  useEffect(() => {
    flagRef.current = window.setTimeout(handler, timeout, ...args)

    return () => {
      window.clearTimeout(flagRef.current)
    }
  }, [args, handler, timeout])

  return flagRef
}

export function useInterval<Args extends unknown[]>(handler: (...args: Args) => void, timeout?: number, ...args: Args) {
  const flagRef = useRef(-1)

  useEffect(() => {
    flagRef.current = window.setInterval(handler, timeout, ...args)

    return () => {
      window.clearInterval(flagRef.current)
    }
  }, [args, handler, timeout])

  return flagRef
}

export function useRequestAnimationFrame(callback: FrameRequestCallback) {
  const flagRef = useRef(-1)

  useEffect(() => {
    const cb = (now: number) => {
      callback(now)
      flagRef.current = window.requestAnimationFrame(cb)
    }

    flagRef.current = window.requestAnimationFrame(cb)

    return () => {
      window.cancelAnimationFrame(flagRef.current)
    }
  }, [callback])

  return flagRef
}

export function useNow(throttleTimeMs?: number) {
  const [now, setNow] = useState(Date.now())

  useInterval(() => {
    setNow(Date.now())
  }, throttleTimeMs)

  return now
}

export function useCalc<T>(func: (curTime: number) => T, throttleTimeMs = 200): T {
  const now = useNow(throttleTimeMs)

  const result = useMemo(() => func(now), [func, now])

  return result
}
