import { useEffect } from 'react'

const fontUrl =
  'https://fonts.googleapis.com/css2?family=Source+Sans+Pro:wght@400;600;700&display=swap'

export const useSeamFont = ({
  disabled = false,
}: {
  disabled?: boolean
}): void => {
  useEffect(() => {
    if (disabled) return
    if (globalThis.document == null) return

    const linkEl = globalThis.document.querySelector(`link[href="${fontUrl}"]`)
    if (linkEl != null) return

    const link = globalThis.document.createElement('link')
    link.rel = 'stylesheet'
    link.type = 'text/css'
    link.href = fontUrl
    globalThis.document.head.appendChild(link)
  }, [disabled])
}
