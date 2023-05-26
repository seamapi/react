import { useEffect } from 'react'

const fontUrl =
  'https://fonts.googleapis.com/css2?family=Source+Sans+Pro:wght@400;600;700&display=swap'

export const useSeamFont = ({ enabled }: { enabled: boolean }) => {
  useEffect(() => {
    if (typeof window === 'undefined') return
    if (!enabled) return
    const linkElement = document.querySelector(`link[href="${fontUrl}"]`)

    if (linkElement === null) {
      const link = document.createElement('link')
      link.rel = 'stylesheet'
      link.type = 'text/css'
      link.href = fontUrl

      document.head.appendChild(link)
    }
  }, [enabled])
}
