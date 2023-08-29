import { type ChangeEventHandler, useEffect, useRef } from 'react'

import { TemperatureAddIcon } from 'lib/icons/TemperatureAdd.js'
import { TemperatureSubtractIcon } from 'lib/icons/TemperatureSubtract.js'

const DEFAULT_MIN = 50
const DEFAULT_MAX = 90

interface TemperatureControlProps {
  variant: 'heat' | 'cool'
  value: number
  onChange: (temperature: number) => void
  min?: number
  max?: number
  unit?: 'fahrenheit' | 'celsius'
}

export function TemperatureControl({
  variant,
  value,
  onChange,
  min = DEFAULT_MIN,
  max = DEFAULT_MAX,
  unit = 'fahrenheit',
}: TemperatureControlProps): JSX.Element {
  const increment = (): void => {
    onChange(Math.min(value + 1, max))
  }

  const decrement = (): void => {
    onChange(Math.max(value - 1, min))
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
        value={value}
        onChange={(temperature) => {
          onChange(temperature)
        }}
        unit={unit}
      />
      <button className='seam-temperature-stepper-button' onClick={increment}>
        <TemperatureAddIcon />
      </button>
    </div>
  )
}

interface RangeSliderProps {
  variant: 'heat' | 'cool'
  value: number
  onChange: (temperature: number) => void
  min: number
  max: number
  unit: 'fahrenheit' | 'celsius'
}

function RangeSlider({
  variant,
  value,
  onChange,
  min,
  max,
  unit,
}: RangeSliderProps): JSX.Element {
  const wrapRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (wrapRef.current == null || inputRef.current == null) return

    const wrap = wrapRef.current
    const input = inputRef.current

    wrap.style.setProperty('--temperature-current', input.value)
    wrap.style.setProperty(
      '--temperature-min',
      input.min === '' ? String(DEFAULT_MIN) : input.min
    )
    wrap.style.setProperty(
      '--temperature-max',
      input.max === '' ? String(DEFAULT_MAX) : input.max
    )
  }, [value])

  const handleRangeChange: ChangeEventHandler<HTMLInputElement> = (
    event
  ): void => {
    const wrap = wrapRef.current

    if (wrap != null) {
      const temperature = event.target.value
      wrap.style.setProperty('--temperature-current', temperature)
      onChange(Number(temperature))
    }
  }

  return (
    <div ref={wrapRef} className='seam-temperature-range-wrap'>
      <input
        ref={inputRef}
        type='range'
        min={min}
        max={max}
        value={value}
        onChange={handleRangeChange}
        className='seam-temperature-range'
        data-variant={variant}
      />

      <div className='seam-floating-temperature'>
        <span className='seam-floating-temperature-value'>{value}</span>
        <span className='seam-floating-temperature-unit'>
          º{unit[0]?.toUpperCase()}
        </span>
      </div>
    </div>
  )
}
