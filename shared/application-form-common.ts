export type YesNo = '' | 'yes' | 'no'

export type ApplicationInputType =
  | 'text'
  | 'email'
  | 'tel'
  | 'date'
  | 'number'
  | 'textarea'
  | 'select'
  | 'radio'
  | 'checkbox'
  | 'multiselect'

export interface HouseholdMember {
  fullName: string
  birthDate: string
}

export interface HouseholdChild {
  name: string
  age: string
}

export interface ResidentPet {
  age: string
  size: string
  speciesBreed: string
}

export const residentPetGenders = ['Male', 'Female'] as const

export const normalizeChoice = (value: string): string => value.toLowerCase().replaceAll(' ', '-')

export const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
export const phonePattern = /^[+()\-\s.\d]{7,25}$/

export interface ApplicationFieldBase<TScalar extends string, TData> {
  name: TScalar
  label: string
  type: ApplicationInputType
  required?: boolean
  options?: string[]
  placeholder?: string
  help?: string
  showWhen?: { field: TScalar, value: string | boolean }
  requiredWhen?: { field: TScalar, value: string | boolean }
}

export interface ApplicationStepBase<TField> {
  id: string
  title: string
  description: string
  fields: TField[]
  repeaters?: ('householdMembers' | 'householdChildren' | 'residentPets')[]
}

export interface ApplicationDisclaimer {
  intro: string
  items: { title: string, body: string }[]
  closing?: string
}

export function isApplicationFieldVisible<TScalar extends string, TData extends Record<TScalar, unknown>>(
  field: ApplicationFieldBase<TScalar, TData>,
  data: TData,
): boolean {
  if (!field.showWhen) return true
  return data[field.showWhen.field] === field.showWhen.value
}

export function isApplicationFieldRequired<TScalar extends string, TData extends Record<TScalar, unknown>>(
  field: ApplicationFieldBase<TScalar, TData>,
  data: TData,
): boolean {
  if (field.requiredWhen) return data[field.requiredWhen.field] === field.requiredWhen.value
  return Boolean(field.required)
}

export function validateApplicationScalarField<TScalar extends string>(
  field: ApplicationFieldBase<TScalar, Record<TScalar, unknown>>,
  value: unknown,
  required: boolean,
): string | undefined {
  if (field.type === 'checkbox') {
    if (required && value !== true) return 'This field is required.'
    return undefined
  }
  if (field.type === 'multiselect') {
    const selections = Array.isArray(value) ? value : []
    if (required && selections.length === 0) return 'Select at least one option.'
    if (selections.some(item => typeof item !== 'string' || !field.options?.map(normalizeChoice).includes(item))) {
      return 'Select valid options.'
    }
    return undefined
  }
  if (required && (value === false || String(value ?? '').trim() === '')) return 'This field is required.'
  if (field.type === 'email' && value && !emailPattern.test(String(value))) return 'Enter a valid email address.'
  if (field.type === 'tel' && value && !phonePattern.test(String(value))) return 'Enter a valid phone number.'
  if (field.options && value && !field.options.map(normalizeChoice).includes(String(value))) return 'Select a valid option.'
  if (field.type === 'date' && value && !/^\d{4}-\d{2}-\d{2}$/.test(String(value))) return 'Enter a valid date.'
  return undefined
}

export const formatChoiceLabel = (value: string) =>
  value.replaceAll('-', ' ').replace(/\b\w/g, character => character.toUpperCase())
