import type { ApplicationDisclaimer, ApplicationStepBase, YesNo } from './application-form-common'
import {
  formatChoiceLabel,
  isApplicationFieldRequired,
  isApplicationFieldVisible,
  normalizeChoice,
  validateApplicationScalarField,
} from './application-form-common'

export type VolunteerScalarField = Exclude<
  keyof VolunteerApplicationData,
  'type' | 'applicationDate' | 'website' | 'startedAt'
>

export interface VolunteerApplicationData {
  type: 'volunteer'
  applicationDate: string
  fullName: string
  address: string
  city: string
  state: string
  zip: string
  phone: string
  email: string
  dateOfBirth: string
  heardAbout: string
  isEighteenOrOlder: YesNo
  volunteerInterests: string[]
  weeklyAvailability: string
  transportDistance: string
  volunteerStory: string
  agreesAnimalProperty: boolean
  agreesFollowInstructions: boolean
  certifiesAccuracy: boolean
  website: string
  startedAt: string
}

export interface VolunteerField {
  name: VolunteerScalarField
  label: string
  type: import('./application-form-common').ApplicationInputType
  required?: boolean
  options?: string[]
  placeholder?: string
  help?: string
  showWhen?: { field: VolunteerScalarField, value: string | boolean }
  requiredWhen?: { field: VolunteerScalarField, value: string | boolean }
}

export type VolunteerStep = ApplicationStepBase<VolunteerField>

const yesNo = ['Yes', 'No']
const volunteerInterestOptions = [
  'Adoption events',
  'Animal transport',
  'Dog training',
  'Fostering',
  'Photography',
  'Grooming',
  'Web design',
  'Social media content',
]

const transportInterest = normalizeChoice('Animal transport')

const steps: VolunteerStep[] = [
  {
    id: 'contact',
    title: 'Contact information',
    description: 'Tell us how to reach you about volunteering.',
    fields: [
      { name: 'fullName', label: 'Full legal name', type: 'text', required: true, placeholder: 'First and last name' },
      { name: 'address', label: 'Street address', type: 'text', required: true },
      { name: 'city', label: 'City', type: 'text', required: true },
      { name: 'state', label: 'State', type: 'text', required: true, placeholder: 'MN' },
      { name: 'zip', label: 'ZIP code', type: 'text', required: true },
      { name: 'phone', label: 'Phone number', type: 'tel', required: true },
      { name: 'email', label: 'Email address', type: 'email', required: true },
      { name: 'dateOfBirth', label: 'Date of birth', type: 'date', required: true },
    ],
  },
  {
    id: 'availability',
    title: 'Availability & interests',
    description: 'Let us know when you can help and what roles interest you.',
    fields: [
      { name: 'heardAbout', label: 'How did you hear about New Leash Rescue?', type: 'text', required: true },
      { name: 'isEighteenOrOlder', label: 'Are you 18 years or older?', type: 'radio', options: yesNo, required: true },
      { name: 'volunteerInterests', label: 'What type of volunteer work would you like to do?', type: 'multiselect', options: volunteerInterestOptions, required: true },
      { name: 'weeklyAvailability', label: 'What is your availability during the week?', type: 'textarea', required: true, placeholder: 'Days and times that usually work for you' },
      {
        name: 'transportDistance',
        label: 'If interested in transport, how far are you willing to drive?',
        type: 'text',
        placeholder: 'e.g. 30 miles from West St. Paul',
      },
    ],
  },
  {
    id: 'experience',
    title: 'Experience & agreement',
    description: 'Share your background and confirm program expectations.',
    fields: [
      {
        name: 'volunteerStory',
        label: 'Why would you like to volunteer, and what experience do you have with animals?',
        type: 'textarea',
        required: true,
      },
      {
        name: 'agreesAnimalProperty',
        label: 'I understand animals are the property of New Leash Rescue and may not be removed from PetSmart adoption centers or events without director approval.',
        type: 'checkbox',
        required: true,
      },
      {
        name: 'agreesFollowInstructions',
        label: 'I agree to follow instructions from PetSmart staff and New Leash Rescue leadership.',
        type: 'checkbox',
        required: true,
      },
    ],
  },
  {
    id: 'review',
    title: 'Review & submit',
    description: 'Review your answers before sending your volunteer application.',
    fields: [
      { name: 'certifiesAccuracy', label: 'I certify that the information in this application is complete and accurate.', type: 'checkbox', required: true },
    ],
  },
]

export const getVolunteerSteps = (): VolunteerStep[] => steps

export const volunteerDisclaimer: ApplicationDisclaimer = {
  intro: 'Thank you for offering your time to New Leash Rescue. Our team is entirely volunteer-run, and every role helps more animals find safety and loving homes.',
  items: [
    { title: 'What happens next', body: 'We review volunteer applications as quickly as we can and follow up using the contact information you provide.' },
    { title: 'Questions welcome', body: 'If anything is unclear while you apply, reach out anytime and we will be happy to help.' },
  ],
}

export const isFieldVisible = (field: VolunteerField, data: VolunteerApplicationData): boolean => {
  if (field.name === 'transportDistance') {
    return data.volunteerInterests.includes(transportInterest)
  }
  return isApplicationFieldVisible(field, data)
}

export const isFieldRequired = (field: VolunteerField, data: VolunteerApplicationData): boolean => {
  if (field.name === 'transportDistance') return data.volunteerInterests.includes(transportInterest)
  return isApplicationFieldRequired(field, data)
}

export const createVolunteerApplication = (): VolunteerApplicationData => ({
  type: 'volunteer',
  applicationDate: '',
  fullName: '',
  address: '',
  city: '',
  state: '',
  zip: '',
  phone: '',
  email: '',
  dateOfBirth: '',
  heardAbout: '',
  isEighteenOrOlder: '',
  volunteerInterests: [],
  weeklyAvailability: '',
  transportDistance: '',
  volunteerStory: '',
  agreesAnimalProperty: false,
  agreesFollowInstructions: false,
  certifiesAccuracy: false,
  website: '',
  startedAt: new Date().toISOString(),
})

export function validateVolunteerStep(data: VolunteerApplicationData, stepIndex: number): Record<string, string> {
  const step = getVolunteerSteps()[stepIndex]
  const errors: Record<string, string> = {}
  if (!step) return { form: 'Invalid application step.' }

  for (const field of step.fields) {
    if (!isFieldVisible(field, data)) continue
    const value = field.name === 'volunteerInterests' ? data.volunteerInterests : data[field.name]
    const message = validateApplicationScalarField(field, value, isFieldRequired(field, data))
    if (message) errors[field.name] = message
  }

  if (data.isEighteenOrOlder === 'no') errors.isEighteenOrOlder = 'Volunteers must be 18 years or older.'
  if (step.id === 'availability' && data.volunteerInterests.includes(transportInterest) && !data.transportDistance.trim()) {
    errors.transportDistance = 'This field is required.'
  }

  return errors
}

export function validateVolunteerApplication(input: unknown): { data?: VolunteerApplicationData, errors: Record<string, string> } {
  if (!input || typeof input !== 'object') return { errors: { form: 'Invalid application.' } }
  const candidate = input as Partial<VolunteerApplicationData>
  const baseline = createVolunteerApplication()
  const data = { ...baseline }

  for (const key of Object.keys(baseline) as (keyof VolunteerApplicationData)[]) {
    if (key === 'type' || key === 'applicationDate' || key === 'volunteerInterests') continue
    const incoming = candidate[key]
    if (typeof baseline[key] === 'boolean') {
      ;(data[key] as boolean) = incoming === true
    } else if (typeof incoming === 'string') {
      ;(data[key] as string) = incoming.trim().slice(0, 5000)
    }
  }

  data.volunteerInterests = Array.isArray(candidate.volunteerInterests)
    ? candidate.volunteerInterests
        .filter(item => typeof item === 'string')
        .map(item => normalizeChoice(item))
        .filter(item => volunteerInterestOptions.map(normalizeChoice).includes(item))
        .slice(0, 20)
    : []

  const errors = Object.assign({}, ...getVolunteerSteps().map((_, index) => validateVolunteerStep(data, index)))
  return Object.keys(errors).length ? { errors } : { data, errors: {} }
}

export const formatVolunteerDisplayValue = (field: VolunteerField, value: string | boolean | string[]): string => {
  if (field.type === 'multiselect' && Array.isArray(value)) {
    if (!value.length) return 'Not provided'
    return value.map(formatChoiceLabel).join(', ')
  }
  if (typeof value === 'boolean') return value ? 'Yes' : 'No'
  if (!value) return 'Not provided'
  return formatChoiceLabel(String(value))
}
