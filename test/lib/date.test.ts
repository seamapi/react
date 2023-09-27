import { describe, expect, it } from 'vitest'

import {
  compareByTimeZoneOffsetAsc,
  createIsoDate,
  formatDateTimeReadable,
  get24HoursLater,
  getNow,
  getTimeZoneLabel,
  getTimeZoneOffset,
} from 'lib/dates.js'

describe('getTimeZoneOffset', () => {
  it('should return city and region ', () => {
    expect(getTimeZoneLabel('America/Los_Angeles')).toBe(
      'Los Angeles (America)'
    )
    expect(getTimeZoneLabel('Etc/GMT-3')).toBe('GMT-3 (Etc)')
  })

  it('should return the time zone if no region', () => {
    expect(getTimeZoneLabel('Egypt')).toBe('Egypt')
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

describe('getNow', () => {
  it('should only show current date and time', () => {
    expect(getNow()).not.toContain('Z')
    expect(getNow()).not.toContain('.')
  })
})

describe('get24HoursLater', () => {
  it('should only show current date and time', () => {
    expect(get24HoursLater()).not.toContain('Z')
    expect(get24HoursLater()).not.toContain('.')
  })
})

describe('createIsoDate', () => {
  it('should create an ISO8601 date', () => {
    expect(createIsoDate(getNow(), 'America/Los_Angeles')).toContain(
      '.000-07:00'
    )
  })
})
