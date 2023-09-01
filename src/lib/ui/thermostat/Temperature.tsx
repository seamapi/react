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
      {Math.trunc(temperature)}
      {degree}
    </span>
  )
}

const t = {
  degreeFahrenheit: '°F',
  degreeCelsius: '°C',
}
