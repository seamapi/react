type Procedure = (...args: any[]) => void

export function debounce<F extends Procedure>(
  func: F,
  waitMilliseconds: number
): {
  (this: ThisParameterType<F>, ...args: Parameters<F>): void
  cancel: () => void
} {
  let timeoutId: ReturnType<typeof globalThis.setTimeout> | null = null

  const debouncedFunction = function (
    this: ThisParameterType<F>,
    ...args: Parameters<F>
  ): void {
    if (timeoutId !== null) {
      globalThis.clearTimeout(timeoutId)
    }
    timeoutId = globalThis.setTimeout(() => {
      timeoutId = null
      func.apply(this, args)
    }, waitMilliseconds)
  }

  debouncedFunction.cancel = (): void => {
    if (timeoutId !== null) {
      globalThis.clearTimeout(timeoutId)
      timeoutId = null
    }
  }

  return debouncedFunction
}
