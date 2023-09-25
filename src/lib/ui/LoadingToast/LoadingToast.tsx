import { Spinner } from 'lib/ui/Spinner/Spinner.js'

export function LoadingToast() {
  return (
    <div className='seam-loading-toast'>
      <Spinner size='small' />
      <p className='seam-loading-toast-text'>Loading devices</p>
    </div>
  )
}
