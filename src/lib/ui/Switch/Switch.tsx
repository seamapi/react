export interface SwitchProps {
  checked: boolean
  onChange: (checked: boolean) => void
  label?: boolean
}

function Switch({
  checked,
  onChange,
  label = false,
}: SwitchProps): JSX.Element {
  return (
    <div className='seam-switch-container'>
      {label && (
        <label className='seam-switch-label'>{checked ? 'On' : 'Off'}</label>
      )}
      <div
        className={`seam-switch ${checked ? 'checked' : ''}`}
        onClick={() => {
          onChange(!checked)
        }}
      >
        <div className='slider' />
      </div>
    </div>
  )
}

export default Switch
