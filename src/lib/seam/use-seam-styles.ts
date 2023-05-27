import { useEffect } from 'react'

// TODO figure out the version automatically
const cssUrl = 'https://www.unpkg.com/@seamapi/react@1.1.0/index.min.css'

export const useSeamStyles = ({ disabled = false }: { disabled?: boolean }) => {
  useEffect(() => {
    if (disabled) return
    if (globalThis.document == null) return
    const linkEl = globalThis.document.querySelector(`link[href="${cssUrl}"]`)

    if (linkEl === null) {
      const link = globalThis.document.createElement('link')
      link.rel = 'stylesheet'
      link.type = 'text/css'
      link.href = cssUrl

      globalThis.document.head.appendChild(link)
    }
  }, [disabled])
}
