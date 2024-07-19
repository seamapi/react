type Shook<T> = {[K in keyof T as T[K] extends undefined ? never : K]: T[K]}
export const shake = <T>(obj: T): Shook<T> => {
  if (obj == null) return obj
  if (typeof obj !== 'object') return obj
  return Object.entries(obj).reduce((acc, [k, v]) => {
    if (v === undefined) return acc
    return { ...acc, [k]: v }
  }, {})
}
