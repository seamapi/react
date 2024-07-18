export const shake = <T>(obj: T): Partial<T> => {
  if (obj == null) return obj
  if (typeof obj !== 'object') return obj
  return Object.entries(obj).reduce((acc, [k, v]) => {
    if (v === undefined) return acc
    return { ...acc, [k]: v }
  }, {})
}
