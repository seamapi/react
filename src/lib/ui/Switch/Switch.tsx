interface SwitchProps {
  checked: boolean
  onChange: (checked: boolean) => void
  label?: boolean
}

const Switch = ({
  checked,
  onChange,
  label = false,
}: SwitchProps): JSX.Element => (
  <div className='seam-switch-container'>
    {label && (
      <label className='seam-switch-label'>{checked ? 'On' : 'Off'}</label>
    )}
    <div
      className={`seam-switch ${checked ? 'checked' : ''}`}
      onClick={() => onChange(!checked)}
    >
      <div className='slider' />
    </div>
  </div>
)

export default Switch
