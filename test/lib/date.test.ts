import { DateTime } from 'luxon'
import { describe, expect, it } from 'vitest'

import {
  compareByTimeZoneOffsetAsc,
  createIsoDate,
  formaDateTimeWithoutZone,
  formatDateTimeReadable,
  formatTimeZone,
  getTimeZoneOffset,
} from 'lib/dates.js'

describe('getTimeZoneOffset', () => {
  it('should return city and region ', () => {
    expect(formatTimeZone('America/Los_Angeles')).toBe(
      'Los Angeles (America)'
    )
    expect(formatTimeZone('Etc/GMT-3')).toBe('GMT-3 (Etc)')
  })

  it('should return the time zone if no region', () => {
    expect(formatTimeZone('Egypt')).toBe('Egypt')
  })
})

describe('compareByTimeZoneOffsetAsc', () => {
  it('should compare two time zones by minutes', () => {
    const tokyo = 9 * 60 // +9 = 540 minutes
    const losAngeles = -7 * 60 // -7 = -420 minutes
    expect(
      compareByTimeZoneOffsetAsc('Asia/Tokyo', 'America/Los_Angeles')
    ).toBe(tokyo - losAngeles)
  })
})

describe('getTimeZoneOffset', () => {
  it('should return offset mintues', () => {
    expect(getTimeZoneOffset('America/Los_Angeles')).toBe('-07:00')
  })
})

describe('formatDateTimeReadable', () => {
  it('should return a readable date and time', () => {
    expect(formatDateTimeReadable('2023-04-17T13:15:00')).toBe(
      'Apr 17, 2023 at 1:15 PM'
    )
  })
})

describe('formatDateTimeReadable', () => {
  it('should format without time zone', () => {
    const now = DateTime.now().toISO() ?? ''
    expect(now).not.toBe('')
    expect(formaDateTimeWithoutZone(now)).not.toContain('Z')
    expect(formaDateTimeWithoutZone(now)).not.toContain('.')
  })

  it('should format without time zone', () => {
    expect(DateTime.fromISO('2023-09-27T22:44:52Z')).not.toBe(
      '2023-09-27T22:44:52'
    )
    expect(DateTime.fromISO('2023-09-27T22:44:52+0300')).not.toBe(
      '2023-09-27T22:44:52'
    )
  })
})

describe('createIsoDate', () => {
  it('should create an ISO8601 date', () => {
    const now = DateTime.now().toISO() ?? ''
    expect(now).not.toBe('')
    expect(createIsoDate(now, 'America/Los_Angeles')).toContain('.000-07:00')
  })
})
