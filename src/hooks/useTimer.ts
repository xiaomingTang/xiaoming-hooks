import {
  useEffect, useState, useMemo, useCallback, useRef,
} from "react"
import { throttle } from "lodash-es"

interface TimerOptions {
  /**
   * 计时终点(ms)
   */
  target?: number;
  type?: "COUNT_TO" | "COUNT_FROM";
  /**
   * @default 300
   */
  throttleMs?: number;
}

function formatTimerOptions(options?: TimerOptions): Required<TimerOptions> {
  return {
    target: Date.now(),
    type: "COUNT_TO",
    throttleMs: 300,
    ...(options ?? {}),
  }
}

export function useTimer(options: TimerOptions = {}) {
  const [rawOptions, rawResetTimer] = useState(options)
  const {
    target, type, throttleMs,
  } = useMemo(() => formatTimerOptions(rawOptions), [rawOptions])
  const [now, setNow] = useState(Date.now())
  const rafIdRef = useRef(-1)

  const resetTimer: React.Dispatch<React.SetStateAction<TimerOptions>> = useCallback((cb) => {
    setNow(Date.now())
    rawResetTimer(cb)
  }, [])

  useEffect(() => {
    const updater = throttle(() => {
      const newTime = Date.now()
      if (
        (type === "COUNT_FROM" && newTime > target)
        || (type === "COUNT_TO" && newTime < target)
      ) {
        setNow(newTime)
        rafIdRef.current = window.requestAnimationFrame(updater)
      } else {
        setNow(target)
      }
    }, throttleMs, {
      leading: false,
      trailing: true,
    })

    rafIdRef.current = window.requestAnimationFrame(updater)

    return () => {
      updater.cancel()
      window.cancelAnimationFrame(rafIdRef.current)
    }
  }, [target, throttleMs, type])

  return {
    duration: type === "COUNT_FROM" ? Math.max(0, now - target) : Math.max(target - now, 0),
    resetTimer,
  }
}
