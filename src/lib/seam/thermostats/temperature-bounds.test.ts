import { expect, it } from 'vitest'

import {
  type ControlBounds,
  getCoolBounds,
  getHeatBounds,
  getTemperatureBounds,
} from './temperature-bounds.js'

const rootControlBounds: ControlBounds = {
  mode: 'heat_cool',
  minHeat: 50,
  maxHeat: 80,
  minCool: 60,
  maxCool: 90,
  delta: 5,
}

it('should return a MinMax object for heat', () => {
  const minMax = getHeatBounds(rootControlBounds)

  expect(minMax).toStrictEqual({
    min: 50,
    max: 75,
  })
})

it('should return a MinMax object for cool', () => {
  const minMax = getCoolBounds(rootControlBounds)

  expect(minMax).toStrictEqual({
    min: 65,
    max: 90,
  })
})

it('should return a TemperatureBounds object', () => {
  const temperatureBounds = getTemperatureBounds(rootControlBounds)

  expect(temperatureBounds).toStrictEqual({
    heat: {
      min: 50,
      max: 75,
    },
    cool: { min: 65, max: 90 },
  })
})

it('should return the default minMax for heat', () => {
  const minMax = getHeatBounds({
    ...rootControlBounds,
    mode: 'heat',
  })

  expect(minMax).toStrictEqual({
    min: 50,
    max: 80,
  })
})

it('should return the default minMax for cool', () => {
  const minMax = getCoolBounds({
    ...rootControlBounds,
    mode: 'cool',
  })

  expect(minMax).toStrictEqual({
    min: 60,
    max: 90,
  })
})

it('should allow 0 delta, making minMax equal', () => {
  const temperatureBounds = getTemperatureBounds({
    ...rootControlBounds,
    delta: 0,
  })

  expect(temperatureBounds).toStrictEqual({
    heat: {
      min: 50,
      max: 80,
    },
    cool: { min: 60, max: 90 },
  })
})
