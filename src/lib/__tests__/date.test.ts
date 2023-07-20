import {
  compareByTimezoneOffsetAsc,
  createIsoDate,
  formatDateTimeReadable,
  get24HoursLater,
  getNow,
  getTimezoneLabel,
  getTimezoneOffset,
} from 'lib/dates.js'

it('should return a timezone label', () => {
  expect(true).toBe(true)

  expect(getTimezoneLabel('America/Los_angeles')).toBe('Los angeles (America)')
})

it('should compare 2 timezones by minutes', () => {
  const tokyo = 9 * 60 // +9 = 540 minutes

  const losAngeles = -7 * 60 // -7 = -420 minutes

  expect(compareByTimezoneOffsetAsc('Asia/Tokyo', 'America/Los_angeles')).toBe(
    tokyo - losAngeles
  )
})

it('should return offset mintues', () => {
  expect(getTimezoneOffset('America/Los_angeles')).toBe('-07:00')
})

it('should return a readable date, and time', () => {
  expect(formatDateTimeReadable('2023-04-17T13:15:00')).toBe(
    'Apr 17, 2023 at 1:15 PM'
  )
})

it('should only show current date and time', () => {
  // Assert doesn't contain any timezone, or milliseconds

  expect(getNow()).not.toContain('Z')
  expect(getNow()).not.toContain('.')

  expect(get24HoursLater()).not.toContain('Z')
  expect(get24HoursLater()).not.toContain('.')
})

it('should create an ISO8601 date', () => {
  expect(createIsoDate(getNow(), 'America/Los_angeles')).toContain('.000-07:00')
})
