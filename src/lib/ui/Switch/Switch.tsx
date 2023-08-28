import { useState } from 'react'

interface SwitchProps {
  defaultChecked?: boolean
  label?: boolean
  onChange?: (checked: boolean) => void
}

function Switch({
  defaultChecked = false,
  label = false,
  onChange,
}: SwitchProps): JSX.Element {
  const [isChecked, setIsChecked] = useState<boolean>(defaultChecked)

  const handleToggle = (): void => {
    setIsChecked(!isChecked)
    if (onChange != null) {
      onChange(!isChecked)
    }
  }

  return (
    <div className='seam-switch-container'>
      {label && (
        <label className='seam-switch-label'>{isChecked ? 'On' : 'Off'}</label>
      )}
      <div
        className={`seam-switch ${isChecked ? 'checked' : ''}`}
        onClick={handleToggle}
      >
        <div className='slider' />
      </div>
    </div>
  )
}

export default Switch
