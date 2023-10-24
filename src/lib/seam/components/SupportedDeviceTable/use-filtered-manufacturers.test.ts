import { describe, expect, it } from 'vitest'

import { createLiqeQuery } from './use-filtered-manufacturers.js'

describe('createLiqeQuery', () => {
  it('returns no query with empty params', () => {
    expect(
      createLiqeQuery({
        manufacturers: null,
        excludedManufacturers: [],
      })
    ).toBe(undefined)
  })

  it('returns no query with " in params', () => {
    expect(
      createLiqeQuery({
        manufacturers: ['august', 'foo"bar'],
        excludedManufacturers: [],
      })
    ).toBe(undefined)

    expect(
      createLiqeQuery({
        manufacturers: null,
        excludedManufacturers: ['august', 'foo"bar'],
      })
    ).toBe(undefined)

    expect(
      createLiqeQuery({
        manufacturers: ['august', 'foo"bar'],
        excludedManufacturers: ['august', 'foo"bar'],
      })
    ).toBe(undefined)
  })

  it('filters manufacturers', () => {
    expect(
      createLiqeQuery({
        manufacturers: [],
        excludedManufacturers: [],
      })
    ).toBe('manufacturer_id:none')

    expect(
      createLiqeQuery({
        manufacturers: ['august'],
        excludedManufacturers: [],
      })
    ).toBe('(display_name:"august")')

    expect(
      createLiqeQuery({
        manufacturers: ['august', '4suites', 'smart things'],
        excludedManufacturers: [],
      })
    ).toBe(
      '(display_name:"august" OR display_name:"4suites" OR display_name:"smart things")'
    )
  })

  it('excludes manufacturers', () => {
    expect(
      createLiqeQuery({
        manufacturers: null,
        excludedManufacturers: ['august'],
      })
    ).toBe('NOT (display_name:"august")')

    expect(
      createLiqeQuery({
        manufacturers: null,
        excludedManufacturers: ['august', '4suites', 'smart things'],
      })
    ).toBe(
      'NOT (display_name:"august" OR display_name:"4suites" OR display_name:"smart things")'
    )
  })

  it('filters and excludes manufacturers', () => {
    expect(
      createLiqeQuery({
        manufacturers: ['august'],
        excludedManufacturers: ['4suites'],
      })
    ).toBe('(display_name:"august") AND NOT (display_name:"4suites")')

    expect(
      createLiqeQuery({
        manufacturers: ['august', '4suites', 'smart things'],
        excludedManufacturers: ['nuki', 'lockly'],
      })
    ).toBe(
      '(display_name:"august" OR display_name:"4suites" OR display_name:"smart things") AND NOT (display_name:"nuki" OR display_name:"lockly")'
    )
  })

  it('filters and excludes with uuid', () => {
    expect(
      createLiqeQuery({
        manufacturers: ['august=aa79cf7a7ff9'],
        excludedManufacturers: ['4suites=318b1551bfb4'],
      })
    ).toBe(
      '(manufacturer_id:"aa79cf7a7ff9") AND NOT (manufacturer_id:"318b1551bfb4")'
    )
  })
})
