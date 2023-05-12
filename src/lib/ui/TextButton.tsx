import type { ButtonProps } from 'lib/ui/types.js'

interface TextButtonProps extends ButtonProps {
  color?: 'primary' | 'inherit'
  disabled?: boolean
}

export function TextButton({
  color = 'primary',
  ...buttonProps
}: TextButtonProps): JSX.Element {
  return (
    <button className={`seam-text-btn seam-color-${color}`} {...buttonProps} />
  )
}
