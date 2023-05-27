import { useEffect } from 'react'

const origin = 'https://react.seam.co'

const version = '1.1.0'

export const useSeamStyles = ({
  disabled = false,
}: {
  disabled?: boolean
}) => {
  const cssUrl = `${origin}/v/${version}/index.css`

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
