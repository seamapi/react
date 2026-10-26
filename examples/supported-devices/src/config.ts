import type { SupportedDevicesProps } from 'lib/seam/components/SupportedDevices/SupportedDevices.js'

export const getEmbedConfig = (search: string): SupportedDevicesProps => {
  const params = new URLSearchParams(search)
  const theme = params.get('theme')
  return {
    manufacturer: optionalParam(params, 'manufacturer'),
    provider: optionalParam(params, 'provider'),
    deviceType: optionalParam(params, 'device_type'),
    capability: optionalParam(params, 'capability'),
    theme: theme === 'dark' || theme === 'light' ? theme : 'auto',
    hideTitle: true,
  }
}

/** An exact origin, never a wildcard; referrerPolicy="origin" on the host iframe. */
export const getParentOrigin = (referrer: string): string | null => {
  try {
    const url = new URL(referrer)
    return url.protocol === 'https:' || url.protocol === 'http:'
      ? url.origin
      : null
  } catch {
    return null
  }
}

const optionalParam = (
  params: URLSearchParams,
  name: string
): string | undefined => {
  const value = params.get(name)?.trim()
  return value == null || value.length === 0 ? undefined : value
}
