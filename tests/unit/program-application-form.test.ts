import { describe, expect, it } from 'vitest'
import type { FosterApplicationData, FosterField } from '../../shared/foster-form'
import {
  createFosterApplication,
  getFosterSteps,
  isFieldRequired as isFosterFieldRequired,
  isFieldVisible as isFosterFieldVisible,
  validateFosterApplication,
  validateFosterStep,
} from '../../shared/foster-form'
import type { VolunteerApplicationData, VolunteerField } from '../../shared/volunteer-form'
import {
  createVolunteerApplication,
  getVolunteerSteps,
  validateVolunteerApplication,
  validateVolunteerStep,
} from '../../shared/volunteer-form'
import { normalizeChoice } from '../../shared/application-form-common'
import { renderFosterEmail, renderVolunteerEmail } from '../../server/utils/renderProgramEmail'

function fillFosterField(data: FosterApplicationData, field: FosterField) {
  if (!isFosterFieldVisible(field, data) || !isFosterFieldRequired(field, data)) return
  if (field.type === 'checkbox') data[field.name] = true as never
  else if (field.type === 'multiselect') data.fosterInterests = field.options!.map(normalizeChoice).slice(0, 2)
  else if (field.type === 'radio' || field.type === 'select') data[field.name] = normalizeChoice(field.options![0]!) as never
  else if (field.type === 'email') data[field.name] = 'applicant@example.com' as never
  else if (field.type === 'tel') data[field.name] = '651-555-0100' as never
  else if (field.type === 'date') data[field.name] = '1990-01-01' as never
  else data[field.name] = 'Complete answer' as never
}

function validFosterApplication(): FosterApplicationData {
  const data = createFosterApplication()
  getFosterSteps().flatMap(step => step.fields).forEach(field => fillFosterField(data, field))
  data.householdMembers = [{ fullName: 'Alex Applicant', birthDate: '1990-01-01' }]
  data.householdChildren = [{ name: 'Sam', age: '8' }]
  data.hasChildren = 'yes'
  data.hasOwnPets = 'no'
  data.residentPets = []
  return data
}

function fillVolunteerField(data: VolunteerApplicationData, field: VolunteerField) {
  if (field.type === 'checkbox') data[field.name] = true as never
  else if (field.type === 'multiselect') data.volunteerInterests = [normalizeChoice('Adoption event support')]
  else if (field.type === 'radio') data[field.name] = normalizeChoice(field.options![0]!) as never
  else if (field.type === 'email') data[field.name] = 'applicant@example.com' as never
  else if (field.type === 'tel') data[field.name] = '651-555-0100' as never
  else if (field.type === 'date') data[field.name] = '1990-01-01' as never
  else data[field.name] = 'Complete answer' as never
}

function validVolunteerApplication(): VolunteerApplicationData {
  const data = createVolunteerApplication()
  getVolunteerSteps().flatMap(step => step.fields).forEach(field => fillVolunteerField(data, field))
  data.isEighteenOrOlder = 'yes'
  return data
}

describe('foster application schema', () => {
  it('uses a four-step workflow without landlord or reference fields', () => {
    const labels = getFosterSteps().flatMap(step => step.fields.map(field => field.label.toLowerCase()))
    expect(getFosterSteps()).toHaveLength(4)
    expect(labels.some(label => label.includes('landlord'))).toBe(false)
    expect(labels.some(label => label.includes('reference'))).toBe(false)
  })

  it('accepts a complete foster application', () => {
    const result = validateFosterApplication(validFosterApplication())
    expect(result.errors).toEqual({})
    expect(result.data?.type).toBe('foster')
  })

  it('does not require veterinarian details without resident pets', () => {
    const data = validFosterApplication()
    data.hasOwnPets = 'no'
    data.veterinarianName = ''
    data.veterinarianPhone = ''

    expect(validateFosterApplication(data).errors).toEqual({})
  })

  it('requires veterinarian details when the applicant owns pets', () => {
    const data = validFosterApplication()
    data.hasOwnPets = 'yes'
    data.residentPets = [{ age: '3', size: 'Medium', speciesBreed: 'Dog / Mix' }]
    data.veterinarianName = ''
    data.veterinarianPhone = ''

    const errors = validateFosterApplication(data).errors
    expect(errors.veterinarianName).toBeDefined()
    expect(errors.veterinarianPhone).toBeDefined()
  })

  it('renders foster email html with applicant details', () => {
    const data = validFosterApplication()
    data.applicationDate = new Date().toISOString()
    const html = renderFosterEmail(data)
    expect(html).toContain('New foster home application')
    expect(html).toContain(data.fullName)
    expect(html).toContain('Contact information')
  })
})

describe('volunteer application schema', () => {
  it('uses a four-step workflow', () => {
    expect(getVolunteerSteps()).toHaveLength(4)
  })

  it('accepts a complete volunteer application', () => {
    const result = validateVolunteerApplication(validVolunteerApplication())
    expect(result.errors).toEqual({})
  })

  it('requires transport distance when transport is selected', () => {
    const data = createVolunteerApplication()
    data.volunteerInterests = [normalizeChoice('Animal transport')]
    data.isEighteenOrOlder = 'yes'

    const errors = validateVolunteerStep(data, 1)
    expect(errors.transportDistance).toBeDefined()
  })

  it('rejects applicants under 18', () => {
    const data = validVolunteerApplication()
    data.isEighteenOrOlder = 'no'
    const errors = validateVolunteerApplication(data).errors
    expect(errors.isEighteenOrOlder).toContain('18')
  })

  it('renders volunteer email html with applicant details', () => {
    const data = validVolunteerApplication()
    data.applicationDate = new Date().toISOString()
    const html = renderVolunteerEmail(data)
    expect(html).toContain('New volunteer application')
    expect(html).toContain(data.fullName)
  })
})
