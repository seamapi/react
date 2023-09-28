import classNames from 'classnames'
import { useEffect, useState } from 'react'

import { CheckBlackIcon } from 'lib/icons/CheckBlack.js'
import { Spinner } from 'lib/ui/Spinner/Spinner.js'

interface LoadingToastProps {
  isLoading: boolean
  label: string
  top?: string | number
  left?: string | number
}

export function LoadingToast({
  isLoading = true,
  label,
  top,
  left,
}: LoadingToastProps): JSX.Element {
  const [hidden, setHidden] = useState(false)
  const [showToast, setShowToast] = useState(isLoading)

  useEffect(() => {
    if (!isLoading) {
      let removeTimeout: ReturnType<typeof globalThis.setTimeout>

      const hideTimeout = globalThis.setTimeout(() => {
        setHidden(true)

        removeTimeout = globalThis.setTimeout(() => {
          setShowToast(false)
        }, 500)
      }, 1000)

      return () => {
        globalThis.clearTimeout(hideTimeout)
        globalThis.clearTimeout(removeTimeout)
      }
    }

    setHidden(false)
    setShowToast(true)

    return () => {
      // noop
    }
  }, [isLoading])

  if (!showToast) return <></>

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
