import type { DivProps } from 'lib/ui/types.js'

export default function TableRow(props: DivProps) {
  return <div className='seam--table-row'>{props.children}</div>
}
