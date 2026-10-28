export function InfoMark(): JSX.Element {
  return (
    <svg
      aria-hidden
      width='14'
      height='14'
      viewBox='0 0 20 20'
      fill='none'
      stroke='currentColor'
      strokeWidth='1.5'
    >
      <circle cx='10' cy='10' r='7.25' />
      <path d='M10 9v5M10 6v.1' strokeLinecap='round' />
    </svg>
  )
}

export function CheckMark(): JSX.Element {
  return (
    <svg
      aria-hidden
      width='14'
      height='14'
      viewBox='0 0 20 20'
      fill='none'
      stroke='currentColor'
      strokeWidth='1.7'
    >
      <path d='m4 10 4 4 8-8' strokeLinecap='round' strokeLinejoin='round' />
    </svg>
  )
}
