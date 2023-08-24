import { type ChangeEventHandler, useEffect, useRef } from 'react'

interface TemperatureControlProps {}

export function TemperatureControl() {
  return (
    <div className='seam-temperature-control'>
      <Stepper variant='cool' />
    </div>
  )
}

interface StepperProps {
  variant: 'heat' | 'cool'
}

function Stepper({}: StepperProps) {
  const rangeRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (rangeRef.current != null) {
      const range = rangeRef.current

      range.style.setProperty('--temperature-current', range.value)
      range.style.setProperty(
        '--temperature-min',
        range.min === '' ? '0' : range.min
      )
      range.style.setProperty(
        '--temperature-max',
        range.max === '' ? '100' : range.max
      )
    }
  }, [rangeRef.current])

  const handleRangeChange: ChangeEventHandler<HTMLInputElement> = (event) => {
    const range = event.target
    range.style.setProperty('--temperature-current', range.value)
    console.log(range.value)
  }

  return (
    <div className='seam-temperature-stepper'>
      <button className='seam-temperature-stepper-button' />
      <input
        type='range'
        min={0}
        max={100}
        onChange={handleRangeChange}
        className='seam-temperature-range-input'
      />
      <button className='seam-temperature-stepper-button' />
    </div>
  )
}
