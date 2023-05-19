export async function copy(value: string) {
  await window.navigator.clipboard.writeText(value)
}
