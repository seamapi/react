import type { DivProps } from 'lib/ui/types.js'

export function TableRow(
  props: DivProps & { onClick?: () => void }
): JSX.Element {
  return (
    <div className='seam-table-row' {...props}>
      {props.children}
    </div>
  )
}
