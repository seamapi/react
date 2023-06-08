import { useEffect } from 'react'

import version from 'lib/version.js'

const origin = 'https://react.seam.co'

export const useSeamStyles = ({
  disabled = false,
  unminified = false,
}: {
  unminified?: boolean
  disabled?: boolean
}): void => {
  const ext = `${unminified ? '' : 'min.'}css`
  const cssUrl = `${origin}/v/${version ?? ''}/dist/index.${ext}`

  useEffect(() => {
    if (version === null) return
    if (disabled) return
    if (globalThis.document == null) return

    const linkEl = globalThis.document.querySelector(`link[href="${cssUrl}"]`)
    if (linkEl != null) return

    const link = globalThis.document.createElement('link')
    link.rel = 'stylesheet'
    link.type = 'text/css'
    link.href = cssUrl
    globalThis.document.head.appendChild(link)
  }, [disabled, cssUrl])
}
