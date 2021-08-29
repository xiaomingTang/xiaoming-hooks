export function sleep<T>(ms: number, data?: T): Promise<T | null> {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(data ?? null)
    }, ms)
  })
}

export function voidFunc() {
  // pass
}
