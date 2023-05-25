import type { SVGProps } from 'react'
export const CheckIcon = (props: SVGProps<SVGSVGElement>): JSX.Element => (
  <svg
    xmlns='http://www.w3.org/2000/svg'
    width={25}
    height={24}
    fill='none'
    {...props}
  >
    <path
      fill='#27AE60'
      d='m9.5 15.73-3.936-4.038-1.895 1.872L9.5 19.476l12.765-12.92-1.82-1.87L9.5 15.73Z'
    />
  </svg>
)
