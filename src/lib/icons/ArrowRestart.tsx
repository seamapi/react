import type { SVGProps } from 'react'
export const ArrowRestartIcon = (
  props: SVGProps<SVGSVGElement>
): JSX.Element => (
  <svg
    xmlns='http://www.w3.org/2000/svg'
    width={24}
    height={24}
    fill='none'
    {...props}
  >
    <mask
      id='arrow-restart_svg__a'
      width={24}
      height={24}
      x={0}
      y={0}
      maskUnits='userSpaceOnUse'
      style={{
        maskType: 'alpha',
      }}
    >
      <path fill='#D9D9D9' d='M0 0h24v24H0z' />
    </mask>
    <g mask='url(#arrow-restart_svg__a)'>
      <path
        fill='#232B3A'
        d='M12 20c2.233 0 4.125-.775 5.675-2.325C19.225 16.125 20 14.233 20 12c0-2.233-.775-4.125-2.325-5.675C16.125 4.775 14.233 4 12 4c-1.15 0-2.25.238-3.3.713A7.617 7.617 0 0 0 6 6.75V4H4v7h7V9H6.8a5.838 5.838 0 0 1 2.187-2.2A5.93 5.93 0 0 1 12 6c1.667 0 3.083.583 4.25 1.75C17.417 8.917 18 10.333 18 12c0 1.667-.583 3.083-1.75 4.25C15.083 17.417 13.667 18 12 18a5.863 5.863 0 0 1-3.475-1.1A5.809 5.809 0 0 1 6.35 14h-2.1c.467 1.767 1.417 3.208 2.85 4.325S10.167 20 12 20Z'
      />
    </g>
  </svg>
)
