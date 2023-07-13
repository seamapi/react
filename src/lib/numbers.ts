export function getRandomInt(
  options: { max?: number; min?: number } = {}
): number {
  const { min = Number.MIN_SAFE_INTEGER, max = Number.MAX_SAFE_INTEGER } =
    options
  return Math.floor(Math.random() * (max - min + 1) + min)
}
