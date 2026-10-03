import { describe, expect, it } from 'vitest'
import { parseApplicationDownloadsEnabled } from '../../shared/feature-flags'

describe('parseApplicationDownloadsEnabled', () => {
  it.each([
    [true, true],
    ['true', true],
    [false, false],
    ['false', false],
    ['', false],
    [undefined, false],
    [1, false],
  ] as const)('returns %s for %j', (input, expected) => {
    expect(parseApplicationDownloadsEnabled(input)).toBe(expected)
  })
})
