type Procedure = (...args: any[]) => void

export function debounce<F extends Procedure>(
  func: F,
  waitMilliseconds: number
): {
  (this: ThisParameterType<F>, ...args: Parameters<F>): void
  cancel: () => void
} {
  let timeoutId: ReturnType<typeof setTimeout> | undefined

  const debouncedFunction = function (
    this: ThisParameterType<F>,
    ...args: Parameters<F>
  ) {
    if (timeoutId !== undefined) {
      clearTimeout(timeoutId)
    }
    timeoutId = setTimeout(() => { func.apply(this, args); }, waitMilliseconds)
  }

  debouncedFunction.cancel = () => {
    if (timeoutId !== undefined) {
      clearTimeout(timeoutId)
    }
  }

  return debouncedFunction
}
