export function getRandomInt(
  options: { max?: number; min?: number } = {}
): number {
  const { min, max } = options
  if (min != null && max != null) {
    return Math.floor(Math.random() * (max - min + 1) + min)
  }

  if (max != null) {
    return Math.floor(Math.random() * max)
  }

  return Math.floor(Math.random())
}
