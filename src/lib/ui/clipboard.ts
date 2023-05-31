export async function copyToClipboard(value: string): Promise<void> {
  await globalThis?.navigator?.clipboard?.writeText(value)
}
