import type { RefObject } from 'react'

export function PhonePreview({
  src,
  title,
  frameRef,
}: {
  src: string
  title: string
  frameRef: RefObject<HTMLIFrameElement>
}): JSX.Element {
  return (
    <aside className='seam-proto-phone-preview' aria-label='Mobile comparison'>
      <div className='seam-proto-preview-label'>
        <strong>Mobile</strong>
        <span>iPhone preview</span>
      </div>
      <div className='seam-proto-phone'>
        <div className='seam-proto-phone-screen'>
          <div className='seam-proto-phone-status' aria-hidden='true'>
            <span>9:41</span>
            <span className='seam-proto-phone-island' />
            <svg width='54' height='12' viewBox='0 0 54 12' fill='currentColor'>
              <path d='M0 8h3v4H0zm5-3h3v7H5zm5-3h3v10h-3zm5-2h3v12h-3z' />
              <path d='M23 4a8 8 0 0 1 12 0l-1.5 1.5a6 6 0 0 0-9 0zm3 3a4 4 0 0 1 6 0l-3 3z' />
              <rect
                x='39'
                y='1'
                width='12'
                height='10'
                rx='2'
                fill='none'
                stroke='currentColor'
              />
              <rect x='41' y='3' width='8' height='6' rx='1' />
              <path d='M52 4h2v4h-2z' />
            </svg>
          </div>
          <iframe
            ref={frameRef}
            className='seam-proto-phone-content'
            src={src}
            title={title}
          />
          <span className='seam-proto-phone-home' aria-hidden='true' />
        </div>
      </div>
      <p className='seam-proto-phone-hint'>
        Scroll inside the phone and open any device row.
      </p>
    </aside>
  )
}
