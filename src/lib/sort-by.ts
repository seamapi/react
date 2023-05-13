import { DateTime } from 'luxon'

export const byCreatedAt = (
  a: { created_at: string },
  b: { created_at: string }
): number => {
  const t1 = DateTime.fromISO(a.created_at)
  const t2 = DateTime.fromISO(b.created_at)
  if (t1.isValid && t2.isValid) {
    return t1.toMillis() - t2.toMillis()
  }
  return 0
}
