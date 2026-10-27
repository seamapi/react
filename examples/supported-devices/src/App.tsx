import { useEffect, useState } from 'react'

import { SupportedDevices } from 'lib/seam/components/SupportedDevices/SupportedDevices.js'
import { EcosystemProvider } from 'lib/seam/ecosystem/EcosystemProvider.js'

import { getEmbedConfig, getParentOrigin } from './config.js'

const config = getEmbedConfig(globalThis.location.search)
const parentOrigin = getParentOrigin(globalThis.document.referrer)

export function App(): JSX.Element {
  const [theme, setTheme] = useState(config.theme)

  useEffect(() => {
    if (parentOrigin == null || globalThis.parent === globalThis.window) return
    let previousHeight = 0
    const measure = (): void => {
      const height = Math.ceil(
        globalThis.document.body.getBoundingClientRect().height
      )
      if (height <= 0 || height === previousHeight) return
      previousHeight = height
      globalThis.parent.postMessage(
        { type: 'seam-supported-devices:resize', height },
        parentOrigin
      )
    }
    const onMessage = (event: MessageEvent): void => {
      if (event.source !== globalThis.parent || event.origin !== parentOrigin)
        return
      const data = event.data as { type?: string; theme?: string } | null
      if (
        data?.type === 'seam-supported-devices:theme' &&
        (data.theme === 'dark' || data.theme === 'light')
      )
        setTheme(data.theme)
      if (data?.type === 'seam-supported-devices:measure') {
        previousHeight = 0
        measure()
      }
    }
    const observer = new ResizeObserver(measure)
    observer.observe(globalThis.document.body)
    globalThis.addEventListener('message', onMessage)
    measure()
    return () => {
      observer.disconnect()
      globalThis.removeEventListener('message', onMessage)
    }
  }, [])

  const catalogUrl =
    config.manufacturer == null
      ? 'https://www.seam.co/supported-devices-and-systems'
      : `https://www.seam.co/manufacturers/${encodeURIComponent(config.manufacturer)}`

  return (
    <EcosystemProvider
      ecosystemEndpoint='/ecosystem/v1/'
      disableCssInjection
      disableFontInjection
    >
      <SupportedDevices {...config} theme={theme} />
      <p className='seam-device-embed-footer'>
        <a href={catalogUrl} target='_blank' rel='noopener noreferrer'>
          View the device catalog on seam.co
        </a>
      </p>
    </EcosystemProvider>
  )
}
