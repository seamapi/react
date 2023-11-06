import classNames from 'classnames'

export interface SwitchProps {
  checked: boolean
  onChange: (checked: boolean) => void
  enableLabel?: boolean
}

export function Switch({
  checked,
  onChange,
  enableLabel = false,
}: SwitchProps): JSX.Element {
  return (
    <div className='seam-switch-container'>
      {enableLabel && (
        <label className='seam-switch-label'>{checked ? t.on : t.off}</label>
      )}
      <div
        className={classNames('seam-switch', {
          'seam-switch-checked': checked,
        })}
        onClick={() => {
          onChange(!checked)
        }}
      >
        <div className='seam-switch-slider' />
      </div>
    </div>
  )
}

const t = {
  on: 'On',
  off: 'Off',
}
