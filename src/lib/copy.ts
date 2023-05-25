export async function copy(value: string) {
  await globalThis?.navigator?.clipboard?.writeText(value)
}
