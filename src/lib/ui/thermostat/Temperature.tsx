interface TemperatureProps {
  fahrenheit: number
  celsius: number
  unit: 'fahrenheit' | 'celsius'
  hideUnit?: boolean
}

export function Temperature({
  fahrenheit,
  celsius,
  unit,
  hideUnit,
}: TemperatureProps): JSX.Element {
  const temperature = unit === 'fahrenheit' ? fahrenheit : celsius
  const degree = unit === 'fahrenheit' ? t.degreeFahrenheit : t.degreeCelsius
  return (
    <span>
      {Math.trunc(temperature)}°{!hideUnit && degree}
    </span>
  )
}

const t = {
  degreeFahrenheit: 'F',
  degreeCelsius: 'C',
}
