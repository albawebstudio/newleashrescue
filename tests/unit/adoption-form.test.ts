import { describe, expect, it } from 'vitest'
import type { AdoptionApplicationData, AdoptionField, AdoptionType } from '../../shared/adoption-form'
import { createAdoptionApplication, getAdoptionDisclaimer, getAdoptionSteps, isFieldRequired, isFieldVisible, normalizeChoice, validateAdoptionApplication, validateAdoptionStep } from '../../shared/adoption-form'
import { renderAdoptionEmail } from '../../server/utils/renderAdoptionEmail'

function validApplication(type: AdoptionType): AdoptionApplicationData {
  const data = createAdoptionApplication(type)
  const fill = (field: AdoptionField) => {
    if (!isFieldRequired(field, data) || !isFieldVisible(field, data)) return
    if (field.type === 'checkbox') data[field.name] = true as never
    else if (field.type === 'radio' || field.type === 'select') data[field.name] = normalizeChoice(field.options![0]!) as never
    else if (field.type === 'email') data[field.name] = 'applicant@example.com' as never
    else if (field.type === 'tel') data[field.name] = '651-555-0100' as never
    else if (field.type === 'date') data[field.name] = '1990-01-01' as never
    else if (field.type === 'number') data[field.name] = '4' as never
    else data[field.name] = 'Complete answer' as never
  }

  getAdoptionSteps(type).flatMap(step => step.fields).forEach(fill)
  getAdoptionSteps(type).flatMap(step => step.fields).forEach(fill)
  data.residentPets = [{ age: '4', speciesBreed: 'Dog / Labrador', gender: 'female' }]
  return data
}

describe('adoption application schema', () => {
  it('uses one five-step workflow with type-specific questions', () => {
    const dogFields = getAdoptionSteps('dog').flatMap(step => step.fields.map(field => field.name))
    const catFields = getAdoptionSteps('cat').flatMap(step => step.fields.map(field => field.name))

    expect(getAdoptionSteps('dog')).toHaveLength(5)
    expect(getAdoptionSteps('cat')).toHaveLength(5)
    expect(dogFields).toContain('trainingMethods')
    expect(dogFields).not.toContain('applicationDate')
    expect(dogFields).not.toContain('catAllowedOutside')
    expect(catFields).toContain('catAllowedOutside')
    expect(catFields).not.toContain('trainingMethods')
    expect(getAdoptionSteps('dog').flatMap(step => step.fields).find(field => field.name === 'residenceLength')?.label).toContain('years preferred')
    expect(getAdoptionDisclaimer('dog')?.items).toHaveLength(6)
    expect(getAdoptionDisclaimer('dog')?.intro).toContain('rescue pup')
    expect(getAdoptionDisclaimer('cat')?.items).toHaveLength(2)
    expect(getAdoptionDisclaimer('cat')?.intro).toContain('3 business days')
    expect(getAdoptionDisclaimer('cat')?.closing).toBeUndefined()
  })

  it.each(['dog', 'cat'] as const)('accepts a complete %s application', (type) => {
    const result = validateAdoptionApplication(validApplication(type))
    expect(result.errors).toEqual({})
    expect(result.data?.type).toBe(type)
  })

  it('requires conditional details and resident pet records', () => {
    const data = validApplication('dog')
    data.surrenderedPet = 'yes'
    data.surrenderReason = ''
    data.homeType = 'spaceship'
    data.hasResidentPets = 'yes'
    data.residentPets = []

    const result = validateAdoptionApplication(data)
    expect(result.errors.surrenderReason).toBeDefined()
    expect(result.errors.homeType).toBe('Select a valid option.')
    expect(result.errors.residentPets).toBeDefined()
  })

  it('trims and bounds submitted scalar values', () => {
    const data = validApplication('cat')
    data.fullName = `  ${'A'.repeat(6000)}  `

    const result = validateAdoptionApplication(data)
    expect(result.data?.fullName).toHaveLength(5000)
    expect(result.data?.fullName.startsWith('A')).toBe(true)
    expect(result.data?.applicationDate).toBe('')
  })

  it('reports step errors in field order so the form can scroll to the topmost one', () => {
    const data = createAdoptionApplication('dog')
    const stepFields = getAdoptionSteps('dog')[0]!.fields
    data.city = 'Lindstrom'

    const errorKeys = Object.keys(validateAdoptionStep(data, 0))
    const expectedOrder = stepFields.filter(field => field.required && field.name !== 'city').map(field => field.name)
    expect(errorKeys).toEqual(expectedOrder)
    expect(errorKeys[0]).toBe('fullName')
  })

  it('orders repeater errors after the fields of the same step', () => {
    const data = validApplication('dog')
    data.veterinarianName = ''
    data.hasResidentPets = 'yes'
    data.residentPets = [{ age: '', speciesBreed: '', gender: '' }]

    const errorKeys = Object.keys(validateAdoptionStep(data, 2))
    expect(errorKeys).toEqual(['veterinarianName', 'residentPets.0'])
  })

  it('requires veterinarian details only after previous pet ownership is yes', () => {
    const withoutPets = validApplication('dog')
    withoutPets.previouslyOwnedPets = 'no'
    withoutPets.previousPetTypes = ''
    withoutPets.veterinarianName = ''
    withoutPets.veterinarianPhone = ''

    expect(validateAdoptionApplication(withoutPets).errors).toEqual({})

    const withPets = validApplication('dog')
    withPets.previouslyOwnedPets = 'yes'
    withPets.veterinarianName = ''
    withPets.veterinarianPhone = ''

    const errors = validateAdoptionApplication(withPets).errors
    expect(errors.veterinarianName).toBe('This field is required.')
    expect(errors.veterinarianPhone).toBe('This field is required.')
  })

  it('rejects resident pet gender values other than male or female', () => {
    const data = validApplication('dog')
    data.hasResidentPets = 'yes'
    data.residentPets = [{ age: '4', speciesBreed: 'Labrador', gender: 'unknown' }]

    const result = validateAdoptionApplication(data)
    expect(result.errors['residentPets.0']).toBe('Select male or female.')
  })
})

describe('adoption application email', () => {
  it.each([
    ['dog', '#fb5607'],
    ['cat', '#8338ec'],
  ] as const)('uses the %s header color %s', (type, background) => {
    const html = renderAdoptionEmail(validApplication(type))
    expect(html).toContain(`background:${background}`)
    expect(html).not.toContain(`background:${type === 'dog' ? '#8338ec' : '#fb5607'}`)
  })
})
