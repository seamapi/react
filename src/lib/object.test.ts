import { describe, expect, it } from 'vitest'

import { shake } from './object.js'

describe('share', () => {
  it('returns null', () => {
    expect(shake(null)).toBeNull()
  })

  it('returns undefined', () => {
    // eslint-disable-next-line @typescript-eslint/no-confusing-void-expression
    expect(shake(undefined)).toBeUndefined()
  })

  it('returns non-object', () => {
    expect(shake(2)).toBe(2)
    expect(shake('foo')).toBe('foo')
    expect(shake(true)).toBe(true)
    expect(shake(false)).toBe(false)
  })

  it('returns function', () => {
    const fn = (): void => {}
    expect(shake(fn)).toBe(fn)
  })

  it('removes undefined values', () => {
    expect(
      shake({
        a: 'a',
        b: null,
        c: undefined,
        d: false,
        e: '',
        f: 0,
        z: undefined,
      })
    ).toMatchObject({
      a: 'a',
      b: null,
      d: false,
      e: '',
      f: 0,
    })
  })
})
