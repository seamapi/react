import classNames from 'classnames'
import { useEffect, useState } from 'react'

import { CheckBlackIcon } from 'lib/icons/CheckBlack.js'
import { Spinner } from 'lib/ui/Spinner/Spinner.js'

interface LoadingToastProps {
  isLoading: boolean
  isDoneLoading?: boolean
  top?: number
  left?: number
}

export function LoadingToast({
  isLoading,
  isDoneLoading = false,
  top,
  left,
}: LoadingToastProps): JSX.Element {
  const [shouldRender, setShouldRender] = useState(true)

  useEffect(() => {
    setShouldRender(isLoading)
  }, [isLoading])

  useEffect(() => {
    let timeout: ReturnType<typeof globalThis.setTimeout>

    if (isDoneLoading) {
      timeout = setTimeout(() => {
        setShouldRender(false)
      }, 1000)
    }

    return () => {
      clearTimeout(timeout)
    }
  }, [isDoneLoading])

  return (
    <div
      className={classNames(
        'seam-loading-toast',
        !shouldRender && 'seam-loading-toast-hide'
      )}
      style={{ top, left }}
    >
      <div className='seam-loading-toast-icon-wrap'>
        {isDoneLoading ? <CheckBlackIcon /> : <Spinner size='small' />}
      </div>
      <p className='seam-loading-toast-text'>Loading devices</p>
    </div>
  )
}
