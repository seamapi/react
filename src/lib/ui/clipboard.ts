export const copyToClipboard = async (value: string): Promise<void> => {
  await globalThis.navigator?.clipboard?.writeText(value)
}
