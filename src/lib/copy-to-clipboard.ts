export async function copyToClipboard(value: string) {
  await globalThis?.navigator?.clipboard?.writeText(value)
}
