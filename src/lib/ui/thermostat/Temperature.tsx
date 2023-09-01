interface TemperatureProps {
  fahrenheit: number
  celsius: number
  unit?: 'fahrenheit' | 'celsius'
}

export function Temperature({
  fahrenheit,
  celsius,
  unit = 'fahrenheit',
}: TemperatureProps): JSX.Element {
  const temperature = unit === 'fahrenheit' ? fahrenheit : celsius
  const degree = unit === 'fahrenheit' ? t.degreeFahrenheit : t.degreeCelsius

  return (
    <span>
      {formatTemperatureValue(temperature, unit)}
      {degree}
    </span>
  )
}

const formatTemperatureValue = (
  value: number,
  unit: 'fahrenheit' | 'celsius'
): string => {
  if (unit === 'fahrenheit') return Math.trunc(value).toString()
  if (Number.isInteger(value)) return value.toFixed()
  return value.toFixed(1)
}

const t = {
  degreeFahrenheit: '°F',
  degreeCelsius: '°C',
}
