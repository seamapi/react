export const shake = <T>(obj: T): Shook<T> => {
  if (obj == null) return obj
  if (typeof obj !== 'object') return obj

  // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
  const initialValue = {} as Shook<T>
  return Object.entries(obj).reduce<Shook<T>>((acc, [k, v]) => {
    if (v === undefined) return acc
    return { ...acc, [k]: v }
  }, initialValue)
}

type Shook<T> = { [K in keyof T as T[K] extends undefined ? never : K]: T[K] }
