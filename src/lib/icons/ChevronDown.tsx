import type { SVGProps } from 'react'
export const ChevronDownIcon = (
  props: SVGProps<SVGSVGElement>
): JSX.Element => (
  <svg
    xmlns='http://www.w3.org/2000/svg'
    width={20}
    height={20}
    fill='none'
    {...props}
  >
    <g mask='url(#chevron-down_svg__mask0_1045_100036)'>
      <path
        fill='#6E7179'
        d='m10 12.813-5-5 1.167-1.167L10 10.479l3.833-3.833L15 7.813l-5 5Z'
      />
    </g>
  </svg>
)
