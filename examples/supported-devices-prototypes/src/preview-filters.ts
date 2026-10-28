export interface PreviewFilters {
  search: string
  capabilities: string[]
}

export const previewReadyMessage = 'seam-devicedb-preview-ready'
const filtersMessage = 'seam-devicedb-preview-filters'

export function postPreviewFilters(
  target: Window | null | undefined,
  filters: PreviewFilters
): void {
  target?.postMessage(
    { type: filtersMessage, ...filters },
    window.location.origin
  )
}

export function readPreviewFilters(value: unknown): PreviewFilters | null {
  if (typeof value !== 'object' || value == null) return null
  const data = value as Record<string, unknown>
  if (
    data['type'] !== filtersMessage ||
    typeof data['search'] !== 'string' ||
    !Array.isArray(data['capabilities']) ||
    !data['capabilities'].every((item: unknown) => typeof item === 'string')
  )
    return null
  return {
    search: data['search'],
    capabilities: data['capabilities'].filter(
      (item: unknown): item is string => typeof item === 'string'
    ),
  }
}
