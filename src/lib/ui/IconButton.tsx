import type { ButtonProps } from 'lib/ui/types.js'

export default function IconButton(props: ButtonProps) {
  return (
    <button
      {...props}
      style={{
        background: '#FFFFFF',
        padding: '6px',
        border: '1px solid rgba(0, 122, 252, 0.5)',
        borderRadius: '6px',
        lineHeight: 0,
      }}
    />
  )
}
