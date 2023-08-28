import { useState } from 'react';
import type React from 'react'

interface SwitchProps {
  defaultChecked?: boolean
  label?: boolean
  onChange?: (checked: boolean) => void
}

const Switch: React.FC<SwitchProps> = ({
  defaultChecked = false,
  label = false,
  onChange,
}) => {
  const [isChecked, setIsChecked] = useState(defaultChecked)

  const handleToggle = () => {
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
