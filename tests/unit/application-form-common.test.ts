import { describe, expect, it } from 'vitest'
import {
  formatApplicationDisplayValue,
  mergeApplicationScalarFields,
  normalizeChoice,
} from '../../shared/application-form-common'

describe('mergeApplicationScalarFields', () => {
  it('merges booleans and strings and skips listed keys', () => {
    const baseline = { type: 'volunteer', fullName: '', certifiesAccuracy: false, website: '' }
    const data = { ...baseline }
    mergeApplicationScalarFields(data, baseline, {
      type: 'foster',
      fullName: '  Alex Applicant  ',
      certifiesAccuracy: true,
      website: 'spam',
    }, ['type'])

    expect(data.type).toBe('volunteer')
    expect(data.fullName).toBe('Alex Applicant')
    expect(data.certifiesAccuracy).toBe(true)
    expect(data.website).toBe('spam')
  })

  it('ignores non-string scalar updates', () => {
    const baseline = { fullName: '' }
    const data = { ...baseline }
    mergeApplicationScalarFields(data, baseline, { fullName: 42 as unknown as string }, [])
    expect(data.fullName).toBe('')
  })
})

describe('formatApplicationDisplayValue', () => {
  it('formats multiselect, boolean, empty, and choice values', () => {
    expect(formatApplicationDisplayValue(
      { type: 'multiselect' },
      [normalizeChoice('Adoption events'), normalizeChoice('Fostering')],
    )).toBe('Adoption Events, Fostering')
    expect(formatApplicationDisplayValue({ type: 'multiselect' }, [])).toBe('Not provided')
    expect(formatApplicationDisplayValue({ type: 'checkbox' }, true)).toBe('Yes')
    expect(formatApplicationDisplayValue({ type: 'checkbox' }, false)).toBe('No')
    expect(formatApplicationDisplayValue({ type: 'text' }, '')).toBe('Not provided')
    expect(formatApplicationDisplayValue({ type: 'radio' }, normalizeChoice('yes'))).toBe('Yes')
  })
})
