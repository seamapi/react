import { type ChangeEventHandler, useEffect, useRef } from 'react'

import { TemperatureAddIcon } from 'lib/icons/TemperatureAdd.js'
import { TemperatureSubtractIcon } from 'lib/icons/TemperatureSubtract.js'

interface TemperatureControlProps {
  variant: 'heat' | 'cool'
  temperature: number
  onChange: (temperature: number) => void
  min?: number
  max?: number
}

export function TemperatureControl({
  variant,
  temperature,
  onChange,
  min,
  max,
}: TemperatureControlProps) {
  const increment = () => {
    onChange(temperature + 1)
  }

  const decrement = () => {
    onChange(temperature - 1)
  }

  return (
    <div className='seam-temperature-control'>
      <button className='seam-temperature-stepper-button' onClick={decrement}>
        <TemperatureSubtractIcon />
      </button>
      <RangeSlider
        variant={variant}
        min={min}
        max={max}
        temperature={temperature}
        onChange={(temperature) => {
          onChange(temperature)
        }}
      />
      <button className='seam-temperature-stepper-button' onClick={increment}>
        <TemperatureAddIcon />
      </button>
    </div>
  )
}

interface RangeSliderProps {
  variant: 'heat' | 'cool'
  temperature: number
  onChange: (temperature: number) => void
  min?: number
  max?: number
}

function RangeSlider({
  variant,
  temperature,
  onChange,
  min = 50,
  max = 90,
}: RangeSliderProps) {
  const wrapRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (wrapRef.current != null && inputRef.current != null) {
      const wrap = wrapRef.current
      const input = inputRef.current

      wrap.style.setProperty('--temperature-current', input.value)
      wrap.style.setProperty(
        '--temperature-min',
        input.min === '' ? '0' : input.min
      )
      wrap.style.setProperty(
        '--temperature-max',
        input.max === '' ? '100' : input.max
      )
    }
  }, [temperature])

  const handleRangeChange: ChangeEventHandler<HTMLInputElement> = (event) => {
    const wrap = wrapRef.current
    if (wrap == null) return

    const temperature = event.target.value
    wrap.style.setProperty('--temperature-current', temperature)
    onChange(Number(temperature))
  }

  return (
    <div ref={wrapRef} className='seam-temperature-range-wrap'>
      <input
        ref={inputRef}
        type='range'
        min={min}
        max={max}
        value={temperature}
        onChange={handleRangeChange}
        className='seam-temperature-range'
        data-variant={variant}
      />

      <div className='seam-floating-temperature'>
        <span className='seam-floating-temperature-value'>{temperature}</span>
        <span className='seam-floating-temperature-unit'>ºF</span>
      </div>
    </div>
  )
}
