import type { SVGProps } from 'react'
export const BatteryLevelLowIcon = (
  props: SVGProps<SVGSVGElement>
): JSX.Element => (
  <svg
    xmlns='http://www.w3.org/2000/svg'
    width={24}
    height={25}
    fill='none'
    {...props}
  >
    <rect
      width={4.829}
      height={6}
      x={14.172}
      y={9.5}
      fill='#E36857'
      rx={0.75}
    />
    <path
      fill='#9DA1A9'
      fillRule='evenodd'
      d='M19.52 6.269H5.5c-1.684 0-2.734 1.19-2.734 2.66v.804c-.765.23-1.352 1.02-1.352 1.962v1.558c0 .941.587 1.733 1.352 1.962v.764c0 1.473 1.044 2.748 2.734 2.748h14c1.646 0 2.736-.897 2.736-2.768V9c0-1.87-1.07-2.73-2.716-2.73Zm-14.793 2c.186-.207.484-.363.919-.363h13.627c.777 0 1.3.489 1.3 1.373v6.446c0 .884-.523 1.374-1.3 1.374H5.646c-.435 0-.733-.157-.92-.363-.183-.204-.322-.529-.322-1.01v-1.939H3.232c-.208 0-.251-.15-.251-.28v-2.02c0-.168.083-.267.25-.267h1.173V9.28c0-.482.139-.807.323-1.01Z'
      clipRule='evenodd'
    />
  </svg>
)
