import { type ChangeEventHandler, useEffect, useRef } from 'react'

import { TemperatureAddIcon } from 'lib/icons/TemperatureAdd.js'
import { TemperatureSubtractIcon } from 'lib/icons/TemperatureSubtract.js'

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
  min = 50,
  max = 90,
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
    if (wrapRef.current == null) return
    const wrap = wrapRef.current

    wrap.style.setProperty('--temperature-current', value.toString())
    wrap.style.setProperty('--temperature-min', min.toString())
    wrap.style.setProperty('--temperature-max', max.toString())
  }, [value, min, max])

  const handleRangeChange: ChangeEventHandler<HTMLInputElement> = (
    event
  ): void => {
    onChange(Number(event.target.value))
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
          {unit === 'fahrenheit' ? t.degreeFahrenheit : t.degreeCelsius}
        </span>
      </div>
    </div>
  )
}

const t = {
  degreeFahrenheit: 'ºF',
  degreeCelsius: 'ºC',
}
