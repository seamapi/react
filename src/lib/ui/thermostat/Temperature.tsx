interface TemperatureProps {
  fahrenheit: number
  celsius: number
  unit: 'fahrenheit' | 'celsius'
  disableUnit?: boolean
}

export function Temperature({
  fahrenheit,
  celsius,
  unit,
  disableUnit,
}: TemperatureProps): JSX.Element {
  const temperature = unit === 'fahrenheit' ? fahrenheit : celsius
  const degree = unit === 'fahrenheit' ? t.degreeFahrenheit : t.degreeCelsius
  return (
    <span>
      {Math.trunc(temperature)}°{disableUnit != null && degree}
    </span>
  )
}

const t = {
  degreeFahrenheit: 'F',
  degreeCelsius: 'C',
}
