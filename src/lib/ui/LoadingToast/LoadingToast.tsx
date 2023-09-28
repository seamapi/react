import classNames from 'classnames'
import { useEffect, useState } from 'react'

import { CheckBlackIcon } from 'lib/icons/CheckBlack.js'
import { Spinner } from 'lib/ui/Spinner/Spinner.js'

interface LoadingToastProps {
  isLoading: boolean
  label: string
  top?: number
  left?: number
}

export function LoadingToast({
  isLoading = true,
  label,
  top,
  left,
}: LoadingToastProps): JSX.Element {
  const [hidden, setHidden] = useState(false)

  useEffect(() => {
    if (!isLoading) {
      const timeout = globalThis.setTimeout(() => {
        setHidden(true)
      }, 1000)

      return () => {
        globalThis.clearTimeout(timeout)
      }
    }

    setHidden(false)
    return () => {}
  }, [isLoading])

  return (
    <div
      className={classNames('seam-loading-toast', {
        'seam-loading-toast-hide': hidden,
      })}
      style={{ top, left }}
    >
      <div className='seam-loading-toast-icon-wrap'>
        {isLoading ? <Spinner size='small' /> : <CheckBlackIcon />}
      </div>
      <p className='seam-loading-toast-text'>{label}</p>
    </div>
  )
}
