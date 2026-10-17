export type EcosystemTheme = 'light' | 'dark' | 'auto'

/**
 * The class name for an Ecosystem component theme.
 * `auto` follows the visitor's `prefers-color-scheme`.
 */
export const getEcosystemThemeClassName = (
  theme: string | undefined
): string => {
  if (theme === 'dark' || theme === 'auto') {
    return `seam-ecosystem-theme-${theme}`
  }
  return 'seam-ecosystem-theme-light'
}
