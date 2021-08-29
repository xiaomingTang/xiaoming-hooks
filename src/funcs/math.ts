/**
 * 返回一个位于两数之间的整数
 *
 * 如果 min 是整数, 将会包括 min
 *
 * 如果 max 是整数, 将会包括 max
 *
 * 如果两数中间不包含整数(如 0.3 和 0.6), 则会返回 Math.floor(max)
 *
 * @example
 *
 * ```javascript
 * // 都是整数
 * randomInt(0, 1); // returns between [0, 1]
 * randomInt(0, 2); // returns between [0, 2]
 * // 一个是整数, 另一个是小数
 * randomInt(0, 0.5); // returns between [0, 0]
 * randomInt(0.5, 1); // returns between [1, 1]
 * // 都是小数
 * randomInt(0.5, 1.5); // returns between [1, 1]
 * randomInt(0.3, 0.5); // returns between [0, 0]
 * // 负数
 * randomInt(-0.3, -0.5); // returns between [-1, -1]
 * randomInt(-0.3, 0.5); // returns between [0, 0]
 * ```
 */
export function randomInt(a: number, b = 0): number {
  const min = Math.min(a, b)
  const max = Math.max(a, b)
  const floorMax = Math.floor(max)
  const ceilMin = Math.ceil(min)
  const isIntBetween = floorMax - ceilMin >= 0
  if (isIntBetween) {
    return Math.floor((floorMax - ceilMin + 1) * Math.random() + ceilMin)
  }
  return floorMax
}

/**
 * 从给定参数中随机挑选一个值, 并返回该值
 */
export function randomPick<T>(...args: T[]): T {
  return args[randomInt(args.length - 1)]
}

export function clamp(val: number, min: number, max: number): number {
  if (val < min) { return min }
  if (val > max) { return max }
  return val
}
