import type { ApplicationDisclaimer, ApplicationStepBase, HouseholdChild, HouseholdMember, ResidentPet, YesNo } from './application-form-common'
import {
  formatChoiceLabel,
  isApplicationFieldRequired,
  isApplicationFieldVisible,
  normalizeChoice,
  validateApplicationScalarField,
} from './application-form-common'

export type FosterScalarField = Exclude<
  keyof FosterApplicationData,
  'type' | 'applicationDate' | 'householdMembers' | 'householdChildren' | 'residentPets' | 'website' | 'startedAt'
>

export interface FosterApplicationData {
  type: 'foster'
  applicationDate: string
  fullName: string
  address: string
  city: string
  state: string
  zip: string
  phone: string
  preferText: YesNo
  email: string
  dateOfBirth: string
  fosteredBefore: YesNo
  fosterWhen: string
  fosterAgency: string
  fosterDuration: string
  fosterLeaveReason: string
  homeType: string
  residenceSituation: string
  hasInsurance: YesNo
  householdMembers: HouseholdMember[]
  hasChildren: YesNo
  householdChildren: HouseholdChild[]
  hasOwnPets: YesNo
  residentPets: ResidentPet[]
  veterinarianName: string
  veterinarianPhone: string
  lastRabiesVaccination: string
  lastDhppVaccination: string
  lastBordetellaVaccination: string
  residentPetsAltered: YesNo
  surrenderedPet: YesNo
  surrenderDetails: string
  fosterInterests: string[]
  hoursAlone: string
  crateResidentDogs: YesNo
  crateFosterDog: YesNo
  fosterCaregiver: string
  understandsFosterDamage: boolean
  hasFencedYard: YesNo
  yardExercisePlan: string
  residentOffLeash: YesNo
  fenceDetails: string
  travelsForWork: YesNo
  travelCaregiver: string
  openToHomeVisit: YesNo
  canAttendAdoptionEvents: YesNo
  canTransportToVet: YesNo
  additionalInformation: string
  certifiesAccuracy: boolean
  website: string
  startedAt: string
}

export interface FosterField {
  name: FosterScalarField
  label: string
  type: import('./application-form-common').ApplicationInputType
  required?: boolean
  options?: string[]
  placeholder?: string
  help?: string
  showWhen?: { field: FosterScalarField, value: string | boolean }
  requiredWhen?: { field: FosterScalarField, value: string | boolean }
}

export type FosterStep = ApplicationStepBase<FosterField>

const yesNo = ['Yes', 'No']
const homeTypes = ['Condo / Townhouse', 'Apartment', 'Duplex', 'Mobile Home', 'House', 'Other']
const residenceSituations = ['Rent / Lease', 'Own', 'Live with parents or friends']
const fosterInterestOptions = [
  'Puppy (0-1 year)',
  'Adult (1-7 years)',
  'Senior (8+ years)',
  'Special needs',
  'Nursing moms and pups',
  'Pregnant moms',
  'Small',
  'Medium',
  'Large',
  'Extra large',
  'Cats',
  'Kittens',
]

const steps: FosterStep[] = [
  {
    id: 'contact',
    title: 'Contact information',
    description: 'Tell us how to reach you about fostering.',
    fields: [
      { name: 'fullName', label: 'Full legal name', type: 'text', required: true, placeholder: 'First and last name' },
      { name: 'address', label: 'Street address', type: 'text', required: true },
      { name: 'city', label: 'City', type: 'text', required: true },
      { name: 'state', label: 'State', type: 'text', required: true, placeholder: 'MN' },
      { name: 'zip', label: 'ZIP code', type: 'text', required: true },
      { name: 'phone', label: 'Phone number', type: 'tel', required: true },
      { name: 'preferText', label: 'Do you prefer text messages?', type: 'radio', options: yesNo, required: true },
      { name: 'email', label: 'Email address', type: 'email', required: true },
      { name: 'dateOfBirth', label: 'Date of birth', type: 'date', required: true },
    ],
  },
  {
    id: 'household',
    title: 'Household & home',
    description: 'Help us understand your home and who lives there.',
    repeaters: ['householdMembers', 'householdChildren', 'residentPets'],
    fields: [
      { name: 'fosteredBefore', label: 'Have you fostered dogs or cats before?', type: 'radio', options: yesNo, required: true },
      { name: 'fosterWhen', label: 'When did you foster?', type: 'text', required: true, showWhen: { field: 'fosteredBefore', value: 'yes' } },
      { name: 'fosterAgency', label: 'Which shelter or agency?', type: 'text', required: true, showWhen: { field: 'fosteredBefore', value: 'yes' } },
      { name: 'fosterDuration', label: 'How long did you foster?', type: 'text', required: true, showWhen: { field: 'fosteredBefore', value: 'yes' } },
      { name: 'fosterLeaveReason', label: 'Why did you leave fostering?', type: 'textarea', showWhen: { field: 'fosteredBefore', value: 'yes' } },
      { name: 'homeType', label: 'What type of home do you live in?', type: 'select', options: homeTypes, required: true },
      { name: 'residenceSituation', label: 'Do you rent, own, or live with others?', type: 'select', options: residenceSituations, required: true },
      { name: 'hasInsurance', label: 'Do you have renters or homeowners insurance?', type: 'radio', options: yesNo, required: true },
      { name: 'hasChildren', label: 'Are there children in your household?', type: 'radio', options: yesNo, required: true },
      { name: 'hasOwnPets', label: 'Do you have pets of your own?', type: 'radio', options: yesNo, required: true },
      { name: 'veterinarianName', label: 'Current veterinarian name', type: 'text', showWhen: { field: 'hasOwnPets', value: 'yes' }, requiredWhen: { field: 'hasOwnPets', value: 'yes' } },
      { name: 'veterinarianPhone', label: 'Veterinarian phone number', type: 'tel', showWhen: { field: 'hasOwnPets', value: 'yes' }, requiredWhen: { field: 'hasOwnPets', value: 'yes' } },
      { name: 'lastRabiesVaccination', label: 'Date of last rabies vaccination', type: 'date', showWhen: { field: 'hasOwnPets', value: 'yes' }, requiredWhen: { field: 'hasOwnPets', value: 'yes' } },
      { name: 'lastDhppVaccination', label: 'Date of last DHPP vaccination', type: 'date', showWhen: { field: 'hasOwnPets', value: 'yes' }, requiredWhen: { field: 'hasOwnPets', value: 'yes' } },
      { name: 'lastBordetellaVaccination', label: 'Date of last Bordetella vaccination', type: 'date', showWhen: { field: 'hasOwnPets', value: 'yes' }, requiredWhen: { field: 'hasOwnPets', value: 'yes' } },
      { name: 'residentPetsAltered', label: 'Are your pets spayed or neutered?', type: 'radio', options: yesNo, required: true, showWhen: { field: 'hasOwnPets', value: 'yes' } },
      { name: 'surrenderedPet', label: 'Have you ever surrendered or rehomed a pet?', type: 'radio', options: yesNo, required: true },
      { name: 'surrenderDetails', label: 'When and why?', type: 'textarea', required: true, showWhen: { field: 'surrenderedPet', value: 'yes' } },
    ],
  },
  {
    id: 'foster-care',
    title: 'Foster preferences & care',
    description: 'Share the types of foster animals you can support and your daily care plan.',
    fields: [
      { name: 'fosterInterests', label: 'Which foster animals are you interested in?', type: 'multiselect', options: fosterInterestOptions, required: true },
      { name: 'hoursAlone', label: 'How long would a foster pet be left alone when no one is home?', type: 'text', required: true, placeholder: 'e.g. 4 hours on weekdays' },
      { name: 'crateResidentDogs', label: 'Do you crate your resident dogs when you are gone?', type: 'radio', options: yesNo, required: true },
      { name: 'crateFosterDog', label: 'Will you crate your foster dog?', type: 'radio', options: yesNo, required: true },
      { name: 'fosterCaregiver', label: 'Who will be responsible for day-to-day foster care?', type: 'text', required: true },
      { name: 'understandsFosterDamage', label: 'I understand fosters may damage belongings, soil furniture or flooring, chew items, or dig in the yard.', type: 'checkbox', required: true },
      { name: 'hasFencedYard', label: 'Do you have a fenced yard?', type: 'radio', options: yesNo, required: true },
      { name: 'yardExercisePlan', label: 'How will you handle exercise and potty breaks without a fenced yard?', type: 'textarea', required: true, showWhen: { field: 'hasFencedYard', value: 'no' } },
      { name: 'residentOffLeash', label: 'Do your resident pets go off leash outside fenced areas?', type: 'radio', options: yesNo, required: true },
      { name: 'fenceDetails', label: 'What kind of fence do you have and how high is it?', type: 'textarea', required: true, showWhen: { field: 'hasFencedYard', value: 'yes' } },
      { name: 'travelsForWork', label: 'Do you travel for business or vacation?', type: 'radio', options: yesNo, required: true },
      { name: 'travelCaregiver', label: 'Who will care for your foster while you are away?', type: 'textarea', required: true, showWhen: { field: 'travelsForWork', value: 'yes' } },
      { name: 'openToHomeVisit', label: 'Are you open to a New Leash representative visiting your home?', type: 'radio', options: yesNo, required: true },
      { name: 'canAttendAdoptionEvents', label: 'Can you attend adoption events about once a month?', type: 'radio', options: yesNo, required: true },
      { name: 'canTransportToVet', label: 'Can you transport fosters to vet appointments (primary vet in West St. Paul)?', type: 'radio', options: yesNo, required: true },
      { name: 'additionalInformation', label: 'Anything else you would like us to know?', type: 'textarea' },
    ],
  },
  {
    id: 'review',
    title: 'Review & submit',
    description: 'Review your answers before sending your foster application.',
    fields: [
      { name: 'certifiesAccuracy', label: 'I certify that the information in this application is complete and accurate.', type: 'checkbox', required: true },
    ],
  },
]

export const getFosterSteps = (): FosterStep[] => steps

export const fosterDisclaimer: ApplicationDisclaimer = {
  intro: 'Thank you for opening your heart and home to a pet in need. Before you submit, here are a few reminders about fostering with New Leash Rescue.',
  items: [
    { title: 'Adjustment period', body: 'Every new animal needs time to settle in. Accidents can happen while routines are established, so plan on a housetraining refresher.' },
    { title: 'Pack dynamics', body: 'When new dogs enter the same home, they need time to figure out their new group dynamic.' },
    { title: 'Safety first', body: 'Dogs in new environments are at higher risk of getting loose. Double leashing and extra safety precautions are strongly recommended.' },
    { title: 'Patience matters', body: 'Moving to a foster home turns a dog’s world upside down. Please be patient and reach out if you have questions along the way.' },
  ],
  closing: 'We appreciate you supporting animals between rescue and their forever homes.',
}

export const isFieldVisible = (field: FosterField, data: FosterApplicationData): boolean =>
  isApplicationFieldVisible(field, data)

export const isFieldRequired = (field: FosterField, data: FosterApplicationData): boolean =>
  isApplicationFieldRequired(field, data)

export const createFosterApplication = (): FosterApplicationData => ({
  type: 'foster',
  applicationDate: '',
  fullName: '',
  address: '',
  city: '',
  state: '',
  zip: '',
  phone: '',
  preferText: '',
  email: '',
  dateOfBirth: '',
  fosteredBefore: '',
  fosterWhen: '',
  fosterAgency: '',
  fosterDuration: '',
  fosterLeaveReason: '',
  homeType: '',
  residenceSituation: '',
  hasInsurance: '',
  householdMembers: [],
  hasChildren: '',
  householdChildren: [],
  hasOwnPets: '',
  residentPets: [],
  veterinarianName: '',
  veterinarianPhone: '',
  lastRabiesVaccination: '',
  lastDhppVaccination: '',
  lastBordetellaVaccination: '',
  residentPetsAltered: '',
  surrenderedPet: '',
  surrenderDetails: '',
  fosterInterests: [],
  hoursAlone: '',
  crateResidentDogs: '',
  crateFosterDog: '',
  fosterCaregiver: '',
  understandsFosterDamage: false,
  hasFencedYard: '',
  yardExercisePlan: '',
  residentOffLeash: '',
  fenceDetails: '',
  travelsForWork: '',
  travelCaregiver: '',
  openToHomeVisit: '',
  canAttendAdoptionEvents: '',
  canTransportToVet: '',
  additionalInformation: '',
  certifiesAccuracy: false,
  website: '',
  startedAt: new Date().toISOString(),
})

export function validateFosterStep(data: FosterApplicationData, stepIndex: number): Record<string, string> {
  const step = getFosterSteps()[stepIndex]
  const errors: Record<string, string> = {}
  if (!step) return { form: 'Invalid application step.' }

  for (const field of step.fields) {
    if (!isFieldVisible(field, data)) continue
    const value = field.type === 'multiselect' ? data.fosterInterests : data[field.name]
    const message = validateApplicationScalarField(field, value, isFieldRequired(field, data))
    if (message) errors[field.name] = message
  }

  if (step.repeaters?.includes('householdMembers')) {
    if (!data.householdMembers.length) errors.householdMembers = 'Add each adult in your household.'
    data.householdMembers.forEach((member, index) => {
      if (!member.fullName.trim() || !member.birthDate) errors[`householdMembers.${index}`] = 'Complete each adult’s name and birth date.'
    })
  }

  if (step.repeaters?.includes('householdChildren') && data.hasChildren === 'yes') {
    if (!data.householdChildren.length) errors.householdChildren = 'Add each child in your household.'
    data.householdChildren.forEach((child, index) => {
      if (!child.name.trim() || !child.age.trim()) errors[`householdChildren.${index}`] = 'Complete each child’s name and age.'
    })
  }

  if (step.repeaters?.includes('residentPets') && data.hasOwnPets === 'yes') {
    if (!data.residentPets.length) errors.residentPets = 'Add each pet currently living in your home.'
    data.residentPets.forEach((pet, index) => {
      if (!pet.age.trim() || !pet.size.trim() || !pet.speciesBreed.trim()) {
        errors[`residentPets.${index}`] = 'Complete age, size, and species/breed for each pet.'
      }
    })
  }

  return errors
}

export function validateFosterApplication(input: unknown): { data?: FosterApplicationData, errors: Record<string, string> } {
  if (!input || typeof input !== 'object') return { errors: { form: 'Invalid application.' } }
  const candidate = input as Partial<FosterApplicationData>
  const baseline = createFosterApplication()
  const data = { ...baseline }

  for (const key of Object.keys(baseline) as (keyof FosterApplicationData)[]) {
    if (key === 'type' || key === 'applicationDate' || key === 'householdMembers' || key === 'householdChildren' || key === 'residentPets' || key === 'fosterInterests') continue
    const incoming = candidate[key]
    if (typeof baseline[key] === 'boolean') {
      ;(data[key] as boolean) = incoming === true
    } else if (typeof incoming === 'string') {
      ;(data[key] as string) = incoming.trim().slice(0, 5000)
    }
  }

  data.householdMembers = Array.isArray(candidate.householdMembers)
    ? candidate.householdMembers.slice(0, 12).map(member => ({
        fullName: typeof member?.fullName === 'string' ? member.fullName.trim().slice(0, 200) : '',
        birthDate: typeof member?.birthDate === 'string' ? member.birthDate.trim().slice(0, 20) : '',
      }))
    : []

  data.householdChildren = Array.isArray(candidate.householdChildren)
    ? candidate.householdChildren.slice(0, 12).map(child => ({
        name: typeof child?.name === 'string' ? child.name.trim().slice(0, 200) : '',
        age: typeof child?.age === 'string' ? child.age.trim().slice(0, 50) : '',
      }))
    : []

  data.residentPets = Array.isArray(candidate.residentPets)
    ? candidate.residentPets.slice(0, 12).map(pet => ({
        age: typeof pet?.age === 'string' ? pet.age.trim().slice(0, 50) : '',
        size: typeof pet?.size === 'string' ? pet.size.trim().slice(0, 50) : '',
        speciesBreed: typeof pet?.speciesBreed === 'string' ? pet.speciesBreed.trim().slice(0, 200) : '',
      }))
    : []

  data.fosterInterests = Array.isArray(candidate.fosterInterests)
    ? candidate.fosterInterests
        .filter(item => typeof item === 'string')
        .map(item => normalizeChoice(item))
        .filter(item => fosterInterestOptions.map(normalizeChoice).includes(item))
        .slice(0, 20)
    : []

  const errors = Object.assign({}, ...getFosterSteps().map((_, index) => validateFosterStep(data, index)))
  return Object.keys(errors).length ? { errors } : { data, errors: {} }
}

export const formatFosterDisplayValue = (field: FosterField, value: string | boolean | string[]): string => {
  if (field.type === 'multiselect' && Array.isArray(value)) {
    if (!value.length) return 'Not provided'
    return value.map(formatChoiceLabel).join(', ')
  }
  if (typeof value === 'boolean') return value ? 'Yes' : 'No'
  if (!value) return 'Not provided'
  return formatChoiceLabel(String(value))
}
