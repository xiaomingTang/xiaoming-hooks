import { useState } from "react"
import { randomInt } from "@Src/funcs/math"

/**
 * @returns colorArray: hsl 格式的颜色字符串
 *
 * colorArray[0]: 随机柔和背景色
 *
 * colorArray[1]: 该背景色下最佳的前景色(常用于作为文本颜色)
 */
export function randomSoftColors(): [string, string] {
  // h s l 表示随机背景色
  // inversed* 表示前景色(该背景下最适宜的文本色值)
  const h = randomInt(0, 360)
  const s = randomInt(20, 40)
  const l = randomInt(35, 65)
  // hue 值简单地偏移 180° 算了
  const inversedH = (h + 180) % 360
  // 饱和度不变
  const inversedS = s
  const inversedL = l > 50 ? 8 : 92
  return [`hsl(${h}deg,${s}%,${l}%)`, `hsl(${inversedH}deg,${inversedS}%,${inversedL}%)`]
}

/**
 * @returns colorArray: hsl 格式的颜色字符串
 *
 * colorArray[0]: 随机柔和背景色
 *
 * colorArray[1]: 该背景色下最佳的前景色(常用于作为文本颜色)
 */
export function useRandomSoftColors(): [string, string] {
  const [color] = useState(randomSoftColors)
  return color
}
