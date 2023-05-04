import type { DivProps } from 'lib/ui/types.js'

export function TableRow(props: DivProps): JSX.Element {
  return <div className='seam-table-row'>{props.children}</div>
}
