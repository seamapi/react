import type { DivProps } from 'lib/ui/types.js'

export function EmptyPlaceholder(props: DivProps): JSX.Element {
  return (
    <div className='seam-table-empty-placeholder' {...props}>
      {props.children}
    </div>
  )
}
