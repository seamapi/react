import { DateTime } from 'luxon'
import { describe, expect, it } from 'vitest'

import {
  compareByCreatedAtDesc,
  compareByTimeZoneOffsetAsc,
  formatTimeZone,
  getSupportedTimeZones,
  getSystemTimeZone,
  parseDateTimePickerValue,
  serializeDateTimePickerValue,
} from 'lib/dates.js'

describe('compareByCreatedAtDesc', () => {
  it('compares two valid dates', () => {
    expect(
      compareByCreatedAtDesc(
        { created_at: '2023-09-27T22:44:52Z' },
        { created_at: '2022-09-27T22:44:52Z' }
      )
    ).toBe(31536000000)

    expect(
      compareByCreatedAtDesc(
        { created_at: '2022-09-27T22:44:52Z' },
        { created_at: '2023-09-27T22:44:52Z' }
      )
    ).toBe(-31536000000)
  })
})

describe('getSupportedTimeZones', () => {
  it('contains time zones', () => {
    expect(getSupportedTimeZones()).toContain('Africa/Maputo')
    expect(getSupportedTimeZones()).toContain('Asia/Tokyo')
  })
})

describe('getSystemTimeZone', () => {
  it('is a supported time zone', () => {
    const systemTimeZone = getSystemTimeZone()
    expect(getSupportedTimeZones()).toContain(systemTimeZone)
  })
})

describe('formatTimeZone', () => {
  it('returns zone name and offset', () => {
    expect(formatTimeZone('Africa/Maputo')).toBe('Africa/Maputo (UTC+2)')
    expect(formatTimeZone('UTC')).toBe('UTC (UTC+0)')
  })

  it('handles the case with no region', () => {
    expect(formatTimeZone('Egypt')).toBe('Egypt (UTC+3)')
  })
})

describe('serializeDateTimePickerValue', () => {
  it('formats without time zone', () => {
    expect(
      serializeDateTimePickerValue(
        DateTime.fromISO('2023-09-27T22:44:52Z'),
        'UTC'
      )
    ).toBe('2023-09-27T22:44:52')
    expect(
      serializeDateTimePickerValue(
        DateTime.fromISO('2023-09-27T22:44:52+0300'),
        'Asia/Tokyo'
      )
    ).toBe('2023-09-28T04:44:52')
  })
})

describe('parseDateTimePickerValue', () => {
  it('keeps time with the new zone', () => {
    expect(parseDateTimePickerValue('2023-09-27T22:44:52', 'UTC').toISO()).toBe(
      '2023-09-27T22:44:52.000Z'
    )
    expect(
      parseDateTimePickerValue('2023-09-28T04:44:52', 'Asia/Tokyo').toISO()
    ).toBe('2023-09-28T04:44:52.000+09:00')
  })
})
