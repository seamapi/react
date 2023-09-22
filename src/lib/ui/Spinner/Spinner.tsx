import classNames from 'classnames'

interface SpinnerProps {
  size?: 'small' | 'medium' | 'large'
}

export function Spinner({ size }: SpinnerProps) {
  return <div className={classNames('seam-spinner', size)} />
}
