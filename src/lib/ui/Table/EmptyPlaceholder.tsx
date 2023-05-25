import type { DivProps } from 'lib/ui/types.js'

export function EmptyPlaceholder({ children, ...props }: DivProps): JSX.Element {
  return (
    <div className='seam-table-empty-placeholder' {...props}>
      {children}
    </div>
  )
}
