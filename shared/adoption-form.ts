import { mergeApplicationScalarFields } from './application-form-common'

export type AdoptionType = 'dog' | 'cat'
export type YesNo = '' | 'yes' | 'no'

export interface HouseholdMember {
  fullName: string
  birthDate: string
  relationship: string
}

export interface ResidentPet {
  age: string
  speciesBreed: string
  gender: string
}

export interface AdoptionApplicationData {
  type: AdoptionType
  applicationDate: string
  fullName: string
  address: string
  unit: string
  city: string
  state: string
  zip: string
  dateOfBirth: string
  phone: string
  email: string
  occupation: string
  animalName: string
  homeType: string
  ownership: string
  residenceLength: string
  plansToMove: YesNo
  moveDetails: string
  hasYard: YesNo
  yardFenced: YesNo
  propertyContainment: string
  catAllergy: YesNo
  householdMembers: HouseholdMember[]
  adoptionReason: string
  primaryCaregiver: string
  previouslyOwnedPets: YesNo
  previousPetTypes: string
  surrenderedPet: YesNo
  surrenderReason: string
  hasResidentPets: YesNo
  residentPets: ResidentPet[]
  residentPetsAltered: YesNo
  residentPetsVaccinated: YesNo
  veterinarianName: string
  veterinarianPhone: string
  residentPetsGoodWithAnimals: YesNo
  understandsAnnualCost: boolean
  hoursAlone: string
  unsupervisedLocation: string
  familiarWithCrateTraining: boolean
  familiarWithHouseTraining: boolean
  exercisePlan: string
  sleepingLocation: string
  backupCaregiverName: string
  backupCaregiverPhone: string
  backupCaregiverRelationship: string
  returnCircumstances: string
  desiredCharacteristics: string
  indoorOutdoorPreference: string
  desiredActivityLevel: string
  commitsToMedicalCareAndTraining: boolean
  commitsToSocialization: boolean
  socializationOpportunities: string
  previouslyTrainedDog: YesNo
  trainingMethods: string
  obedienceClasses: YesNo
  obedienceExplanation: string
  catAllowedOutside: YesNo
  understandsCatLifespan: boolean
  additionalInformation: string
  certifiesAccuracy: boolean
  website: string
  startedAt: string
}

export type AdoptionScalarField = Exclude<keyof AdoptionApplicationData, 'type' | 'applicationDate' | 'householdMembers' | 'residentPets' | 'website' | 'startedAt'>
export const residentPetGenders = ['Male', 'Female'] as const
export type AdoptionInputType = 'text' | 'email' | 'tel' | 'date' | 'number' | 'textarea' | 'select' | 'radio' | 'checkbox'

export interface AdoptionField {
  name: AdoptionScalarField
  label: string
  type: AdoptionInputType
  required?: boolean
  options?: string[]
  placeholder?: string
  help?: string
  appliesTo?: AdoptionType
  showWhen?: { field: AdoptionScalarField, value: string | boolean }
  requiredWhen?: { field: AdoptionScalarField, value: string | boolean }
}

export interface AdoptionStep {
  id: string
  title: string
  description: string
  fields: AdoptionField[]
  repeaters?: ('householdMembers' | 'residentPets')[]
}

const yesNo = ['Yes', 'No']
const homeTypes = ['Apartment', 'Condo', 'Mobile Home', 'Town House', 'Single Family', 'Other']

const steps: AdoptionStep[] = [
  {
    id: 'applicant',
    title: 'About you',
    description: 'Tell us how to contact you and which animal you are interested in.',
    fields: [
      { name: 'fullName', label: 'Full legal name', type: 'text', required: true, placeholder: 'First and last name' },
      { name: 'address', label: 'Street address', type: 'text', required: true },
      { name: 'unit', label: 'Apartment or unit', type: 'text' },
      { name: 'city', label: 'City', type: 'text', required: true },
      { name: 'state', label: 'State', type: 'text', required: true, placeholder: 'MN' },
      { name: 'zip', label: 'ZIP code', type: 'text', required: true },
      { name: 'dateOfBirth', label: 'Date of birth', type: 'date', required: true },
      { name: 'phone', label: 'Phone number', type: 'tel', required: true },
      { name: 'email', label: 'Email address', type: 'email', required: true },
      { name: 'occupation', label: 'Occupation', type: 'text', required: true },
      { name: 'animalName', label: 'Which animal are you interested in?', type: 'text', required: true },
    ],
  },
  {
    id: 'home',
    title: 'Home & household',
    description: 'Help us understand the home your new companion would join.',
    repeaters: ['householdMembers'],
    fields: [
      { name: 'homeType', label: 'Type of home', type: 'select', options: homeTypes, required: true },
      { name: 'ownership', label: 'Do you own or rent your home?', type: 'radio', options: ['Own', 'Rent'], required: true },
      { name: 'residenceLength', label: 'How long have you lived at this residence? (years preferred; months are also accepted)', type: 'text', required: true, placeholder: 'e.g. 3 years or 8 months' },
      { name: 'plansToMove', label: 'Do you plan to move within one year?', type: 'radio', options: yesNo, required: true, appliesTo: 'dog' },
      { name: 'moveDetails', label: 'Will you rent or own after moving?', type: 'textarea', required: true, appliesTo: 'dog', showWhen: { field: 'plansToMove', value: 'yes' } },
      { name: 'hasYard', label: 'Do you have a yard?', type: 'radio', options: yesNo, required: true, appliesTo: 'dog' },
      { name: 'yardFenced', label: 'Is the yard fenced?', type: 'radio', options: yesNo, required: true, appliesTo: 'dog', showWhen: { field: 'hasYard', value: 'yes' } },
      { name: 'propertyContainment', label: 'How will you keep your dog on your property?', type: 'textarea', required: true, appliesTo: 'dog' },
      { name: 'catAllergy', label: 'Does anyone in the home have a known cat allergy?', type: 'radio', options: yesNo, required: true, appliesTo: 'cat' },
    ],
  },
  {
    id: 'history',
    title: 'Pet history',
    description: 'Your experience helps us recommend a safe, lasting match.',
    repeaters: ['residentPets'],
    fields: [
      { name: 'adoptionReason', label: 'Why are you looking for a new companion animal?', type: 'textarea', required: true },
      { name: 'primaryCaregiver', label: 'Who will be the primary caregiver?', type: 'text', required: true },
      { name: 'previouslyOwnedPets', label: 'Have you previously owned pets?', type: 'radio', options: yesNo, required: true },
      { name: 'previousPetTypes', label: 'What kinds of pets have you owned?', type: 'textarea', required: true, showWhen: { field: 'previouslyOwnedPets', value: 'yes' } },
      { name: 'surrenderedPet', label: 'Have you ever surrendered, rehomed, or given away a pet?', type: 'radio', options: yesNo, required: true },
      { name: 'surrenderReason', label: 'What happened?', type: 'textarea', required: true, showWhen: { field: 'surrenderedPet', value: 'yes' } },
      { name: 'hasResidentPets', label: 'Are any pets currently living in your home?', type: 'radio', options: yesNo, required: true },
      { name: 'residentPetsAltered', label: 'Are all resident pets spayed or neutered?', type: 'radio', options: yesNo, required: true, showWhen: { field: 'hasResidentPets', value: 'yes' } },
      { name: 'residentPetsVaccinated', label: 'Are all resident pets current on vaccinations?', type: 'radio', options: yesNo, required: true, showWhen: { field: 'hasResidentPets', value: 'yes' } },
      { name: 'veterinarianName', label: 'Current or most recent veterinarian name', type: 'text', requiredWhen: { field: 'previouslyOwnedPets', value: 'yes' } },
      { name: 'veterinarianPhone', label: 'Veterinarian phone number', type: 'tel', requiredWhen: { field: 'previouslyOwnedPets', value: 'yes' } },
      { name: 'residentPetsGoodWithAnimals', label: 'Are your resident pets good with other animals?', type: 'radio', options: yesNo, required: true, showWhen: { field: 'hasResidentPets', value: 'yes' } },
    ],
  },
  {
    id: 'care',
    title: 'Care plan',
    description: 'Describe your plans for daily care, training, and lifelong support.',
    fields: [
      { name: 'understandsAnnualCost', label: 'I understand pet care costs at least $1,000 per year, including planned and unplanned care.', type: 'checkbox', required: true },
      { name: 'hoursAlone', label: 'On average, how many hours per day will the pet be left alone?', type: 'number', required: true },
      { name: 'unsupervisedLocation', label: 'Where will the dog be kept when unsupervised?', type: 'textarea', required: true, appliesTo: 'dog' },
      { name: 'familiarWithCrateTraining', label: 'I am familiar with crate training.', type: 'checkbox', appliesTo: 'dog' },
      { name: 'familiarWithHouseTraining', label: 'I am familiar with house training.', type: 'checkbox', appliesTo: 'dog' },
      { name: 'exercisePlan', label: 'How will you exercise your dog?', type: 'textarea', required: true, appliesTo: 'dog' },
      { name: 'sleepingLocation', label: 'Where will your dog sleep at night?', type: 'textarea', required: true, appliesTo: 'dog' },
      { name: 'backupCaregiverName', label: 'Who will care for your pet if you can’t?', type: 'text', required: true },
      { name: 'backupCaregiverPhone', label: 'Backup caregiver phone', type: 'tel', required: true },
      { name: 'backupCaregiverRelationship', label: 'Backup caregiver relationship', type: 'text', required: true },
      { name: 'returnCircumstances', label: 'Under what circumstances would you return this pet to New Leash Rescue?', type: 'textarea', required: true },
      { name: 'desiredCharacteristics', label: 'What qualities are you looking for in a dog?', type: 'textarea', required: true, appliesTo: 'dog' },
      { name: 'indoorOutdoorPreference', label: 'Are you looking for an indoor or outdoor companion?', type: 'radio', options: ['Indoor', 'Outdoor', 'Both'], required: true, appliesTo: 'dog' },
      { name: 'desiredActivityLevel', label: 'What activity level would you like?', type: 'select', options: ['Low', 'Moderate', 'High', 'No preference'], required: true },
      { name: 'commitsToMedicalCareAndTraining', label: 'I commit to necessary lifelong medical care and obedience training.', type: 'checkbox', required: true, appliesTo: 'dog' },
      { name: 'commitsToSocialization', label: 'I commit to safely socializing this dog with people, animals, and new situations.', type: 'checkbox', required: true, appliesTo: 'dog' },
      { name: 'socializationOpportunities', label: 'What socialization opportunities will your dog or puppy have?', type: 'textarea', required: true, appliesTo: 'dog' },
      { name: 'previouslyTrainedDog', label: 'Have you previously trained a dog or puppy?', type: 'radio', options: yesNo, required: true, appliesTo: 'dog' },
      { name: 'trainingMethods', label: 'What training methods have you used or will you use?', type: 'textarea', required: true, appliesTo: 'dog' },
      { name: 'obedienceClasses', label: 'Will you enroll your dog or puppy in obedience classes?', type: 'radio', options: yesNo, required: true, appliesTo: 'dog' },
      { name: 'obedienceExplanation', label: 'Please explain why not.', type: 'textarea', required: true, appliesTo: 'dog', showWhen: { field: 'obedienceClasses', value: 'no' } },
      { name: 'catAllowedOutside', label: 'Will your adopted cat be allowed outside?', type: 'radio', options: yesNo, required: true, appliesTo: 'cat' },
      { name: 'understandsCatLifespan', label: 'I understand a cat may live for 20 years and commit to lifelong care.', type: 'checkbox', required: true, appliesTo: 'cat' },
      { name: 'additionalInformation', label: 'Is there anything else we should know about your adoptive home?', type: 'textarea' },
    ],
  },
  {
    id: 'review',
    title: 'Review & submit',
    description: 'Review your answers before sending your application.',
    fields: [
      { name: 'certifiesAccuracy', label: 'I certify that the information in this application is complete and accurate.', type: 'checkbox', required: true },
    ],
  },
]

export const normalizeChoice = (value: string): string => value.toLowerCase().replaceAll(' ', '-')

export const getAdoptionSteps = (type: AdoptionType): AdoptionStep[] => steps.map(step => ({
  ...step,
  fields: step.fields.filter(field => !field.appliesTo || field.appliesTo === type),
}))

export interface AdoptionDisclaimer {
  intro: string
  items: { title: string, body: string }[]
  closing?: string
}

export const adoptionDisclaimers: Partial<Record<AdoptionType, AdoptionDisclaimer>> = {
  dog: {
    intro: 'Thank you so much for opening your heart and home to a rescue pup! Before you submit your application, here are a few gentle reminders about our process and what to expect when bringing a new dog home.',
    items: [
      { title: 'Processing Time', body: 'Our team is working hard to match pups with their forever families. Applications typically take about one week to process, depending on our current volume. We appreciate your patience!' },
      { title: 'Settling In & House Training', body: 'Moving into a new home is a huge transition. Accidents can happen as your pup learns your routine, so expect to offer a quick house-training refresher.' },
      { title: 'Safety First', body: 'When dogs enter a new environment, stress can make them a flight risk. We strongly recommend double-leashing and taking extra safety precautions during the first few weeks to keep your new family member safe.' },
      { title: 'Building The Pack', body: 'If you have existing pets, give everyone time and grace to figure out their new dynamic.' },
      { title: 'The Adjustment Timeline', body: 'A dog’s world flips upside down when they move. While initial adjustments take a week or two, it often takes 2 to 3 full months for a dog to realize they are truly safe and settled. As their real personality emerges, you might notice new behaviors pop up along the way.' },
      { title: 'Background & History', body: 'Our dedicated foster parents will share everything they know about your pup’s background and how they behaved in foster care. However, every home dynamic is unique, and we can’t test every dog in every possible scenario.' },
    ],
    closing: 'Patience, love, and time are the best tools you can offer your new companion. If you ever have questions or need a little guidance, please don\'t hesitate to reach out to your foster parent—we are all in this together!',
  },
  cat: {
    intro: 'We take the time to carefully review every application to make sure each cat finds their perfect forever home. Because of that, processing usually takes about 3 business days—and sometimes a little longer when our adoption desk gets extra busy!',
    items: [
      { title: 'What happens next', body: 'Our team will review your application details and get in touch as soon as possible.' },
      { title: 'How you can help speed things up', body: 'If you currently have pets, let your vet’s office know we might call so they have permission to chat with us.' },
    ],
  },
}

export const getAdoptionDisclaimer = (type: AdoptionType) => adoptionDisclaimers[type]

export const isFieldVisible = (field: AdoptionField, data: AdoptionApplicationData): boolean => {
  if (!field.showWhen) return true
  return data[field.showWhen.field] === field.showWhen.value
}

export const isFieldRequired = (field: AdoptionField, data: AdoptionApplicationData): boolean => {
  if (field.requiredWhen) return data[field.requiredWhen.field] === field.requiredWhen.value
  return Boolean(field.required)
}

export const createAdoptionApplication = (type: AdoptionType): AdoptionApplicationData => ({
  type,
  applicationDate: '',
  fullName: '', address: '', unit: '', city: '', state: '', zip: '', dateOfBirth: '', phone: '', email: '', occupation: '', animalName: '',
  homeType: '', ownership: '', residenceLength: '', plansToMove: '', moveDetails: '', hasYard: '', yardFenced: '', propertyContainment: '', catAllergy: '', householdMembers: [],
  adoptionReason: '', primaryCaregiver: '', previouslyOwnedPets: '', previousPetTypes: '', surrenderedPet: '', surrenderReason: '', hasResidentPets: '', residentPets: [], residentPetsAltered: '', residentPetsVaccinated: '', veterinarianName: '', veterinarianPhone: '', residentPetsGoodWithAnimals: '',
  understandsAnnualCost: false, hoursAlone: '', unsupervisedLocation: '', familiarWithCrateTraining: false, familiarWithHouseTraining: false, exercisePlan: '', sleepingLocation: '', backupCaregiverName: '', backupCaregiverPhone: '', backupCaregiverRelationship: '', returnCircumstances: '', desiredCharacteristics: '', indoorOutdoorPreference: '', desiredActivityLevel: '', commitsToMedicalCareAndTraining: false, commitsToSocialization: false, socializationOpportunities: '', previouslyTrainedDog: '', trainingMethods: '', obedienceClasses: '', obedienceExplanation: '', catAllowedOutside: '', understandsCatLifespan: false, additionalInformation: '', certifiesAccuracy: false,
  website: '',
  startedAt: new Date().toISOString(),
})

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const phonePattern = /^[+()\-\s.\d]{7,25}$/

export function validateAdoptionStep(data: AdoptionApplicationData, stepIndex: number): Record<string, string> {
  const step = getAdoptionSteps(data.type)[stepIndex]
  const errors: Record<string, string> = {}
  if (!step) return { form: 'Invalid application step.' }

  for (const field of step.fields) {
    if (!isFieldVisible(field, data)) continue
    const value = data[field.name]
    if (isFieldRequired(field, data) && (value === false || String(value).trim() === '')) errors[field.name] = 'This field is required.'
    if (field.type === 'email' && value && !emailPattern.test(String(value))) errors[field.name] = 'Enter a valid email address.'
    if (field.type === 'tel' && value && !phonePattern.test(String(value))) errors[field.name] = 'Enter a valid phone number.'
    if (field.options && value && !field.options.map(normalizeChoice).includes(String(value))) errors[field.name] = 'Select a valid option.'
    if (field.type === 'date' && value && !/^\d{4}-\d{2}-\d{2}$/.test(String(value))) errors[field.name] = 'Enter a valid date.'
    if (field.name === 'hoursAlone' && value && (Number(value) < 0 || Number(value) > 24)) errors[field.name] = 'Enter a number from 0 to 24.'
  }

  if (step.repeaters?.includes('householdMembers')) {
    data.householdMembers.forEach((member, index) => {
      if (!member.fullName.trim() || !member.birthDate || !member.relationship.trim()) errors[`householdMembers.${index}`] = 'Complete all household member fields.'
    })
  }
  if (step.repeaters?.includes('residentPets') && data.hasResidentPets === 'yes') {
    if (!data.residentPets.length) errors.residentPets = 'Add each pet currently living in your home.'
    data.residentPets.forEach((pet, index) => {
      if (!pet.age.trim() || !pet.speciesBreed.trim() || !pet.gender.trim()) errors[`residentPets.${index}`] = 'Complete all resident pet fields.'
      else if (!residentPetGenders.map(normalizeChoice).includes(pet.gender)) errors[`residentPets.${index}`] = 'Select male or female.'
    })
  }
  return errors
}

export function validateAdoptionApplication(input: unknown): { data?: AdoptionApplicationData, errors: Record<string, string> } {
  if (!input || typeof input !== 'object') return { errors: { form: 'Invalid application.' } }
  const candidate = input as Partial<AdoptionApplicationData>
  if (candidate.type !== 'dog' && candidate.type !== 'cat') return { errors: { type: 'Application type must be dog or cat.' } }
  const baseline = createAdoptionApplication(candidate.type)
  const data = { ...baseline }
  mergeApplicationScalarFields(data, baseline, candidate, ['type', 'applicationDate', 'householdMembers', 'residentPets'])
  data.householdMembers = Array.isArray(candidate.householdMembers)
    ? candidate.householdMembers.slice(0, 12).map(member => ({
        fullName: typeof member?.fullName === 'string' ? member.fullName.trim().slice(0, 200) : '',
        birthDate: typeof member?.birthDate === 'string' ? member.birthDate.trim().slice(0, 20) : '',
        relationship: typeof member?.relationship === 'string' ? member.relationship.trim().slice(0, 200) : '',
      }))
    : []
  data.residentPets = Array.isArray(candidate.residentPets)
    ? candidate.residentPets.slice(0, 12).map(pet => ({
        age: typeof pet?.age === 'string' ? pet.age.trim().slice(0, 50) : '',
        speciesBreed: typeof pet?.speciesBreed === 'string' ? pet.speciesBreed.trim().slice(0, 200) : '',
        gender: typeof pet?.gender === 'string' ? pet.gender.trim().slice(0, 20) : '',
      }))
    : []

  const errors = Object.assign({}, ...getAdoptionSteps(data.type).map((_, index) => validateAdoptionStep(data, index)))
  return Object.keys(errors).length ? { errors } : { data, errors: {} }
}
