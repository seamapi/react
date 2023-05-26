import { useEffect } from 'react'

// TODO figure out the version automatically
const seamCssUrl = 'https://www.unpkg.com/@seamapi/react@1.1.0/index.min.css'

export const useSeamStyles = ({ enabled }: { enabled: boolean }) => {
  useEffect(() => {
    if (typeof window === 'undefined') return
    if (!enabled) return
    const linkElement = document.querySelector(`link[href="${seamCssUrl}"]`)

    if (linkElement === null) {
      const link = document.createElement('link')
      link.rel = 'stylesheet'
      link.type = 'text/css'
      link.href = seamCssUrl

      document.head.appendChild(link)
    }
  }, [enabled])
}
