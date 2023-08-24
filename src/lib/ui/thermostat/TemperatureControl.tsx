import { useEffect, useRef, type ChangeEventHandler } from 'react'

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
    if (rangeRef.current) {
      const range = rangeRef.current

      range.style.setProperty('--value', range.value)
      range.style.setProperty('--min', range.min === '' ? '0' : range.min)
      range.style.setProperty('--max', range.max === '' ? '100' : range.max)
    }
  }, [rangeRef.current])

  const handleRangeChange: ChangeEventHandler<HTMLInputElement> = (event) => {
    const range = event.target
    range.style.setProperty('--value', range.value)
    console.log(range.value)
  }

  return (
    <div className='seam-temperature-stepper'>
      <button className='seam-temperature-stepper-button'></button>
      <input
        type='range'
        min={0}
        max={100}
        onInput={handleRangeChange}
        className='seam-temperature-range-input slider-progress'
      />
      <button className='seam-temperature-stepper-button'></button>
    </div>
  )
}
