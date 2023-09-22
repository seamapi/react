import classNames from 'classnames'

interface SpinnerProps {
  size?: 'small' | 'medium' | 'large'
}

export function Spinner({ size }: SpinnerProps): JSX.Element {
  return <div className={classNames('seam-spinner', `size-${size}`)} />
}
