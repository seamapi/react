import { AddIcon } from 'lib/icons/Add.js'
import { TemperatureAddIcon } from 'lib/icons/TemperatureAdd.js'
import { TemperatureSubtractIcon } from 'lib/icons/TemperatureSubtract.js'
import { type ChangeEventHandler, useEffect, useRef, useState } from 'react'

interface TemperatureControlProps {
  variant: 'heat' | 'cool'
}

export function TemperatureControl({ variant }: TemperatureControlProps) {
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
  const [temperature, setTemperature] = useState(75)

  const increment = () => {
    setTemperature((temperature) => temperature + 1)
  }

  const decrement = () => {
    setTemperature((temperature) => temperature - 1)
  }

  return (
    <div className='seam-temperature-stepper'>
      <button className='seam-temperature-stepper-button' onClick={decrement}>
        <TemperatureSubtractIcon />
      </button>
      <RangeSlider
        variant='heat'
        temperature={temperature}
        onChange={(temperature) => setTemperature(temperature)}
      />
      <button className='seam-temperature-stepper-button' onClick={increment}>
        <TemperatureAddIcon />
      </button>
    </div>
  )
}

interface RangeSliderProps {
  variant: 'heat' | 'cool'
  min?: number
  max?: number
  temperature: number
  onChange: (temperature: number) => void
}

function RangeSlider({
  variant,
  min = 60,
  max = 90,
  temperature,
  onChange,
}: RangeSliderProps) {
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
  }, [rangeRef.current, temperature])

  const handleRangeChange: ChangeEventHandler<HTMLInputElement> = (event) => {
    const range = event.target
    range.style.setProperty('--temperature-current', range.value)
    onChange(Number(range.value))
  }

  return (
    <input
      ref={rangeRef}
      type='range'
      min={min}
      max={max}
      value={temperature}
      onChange={handleRangeChange}
      className='seam-temperature-range-input'
      data-variant={variant}
    />
  )
}
