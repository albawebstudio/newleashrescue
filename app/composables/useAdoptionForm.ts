import type { AdoptionApplicationData, AdoptionScalarField, AdoptionType } from '#shared/adoption-form'
import { createAdoptionApplication, getAdoptionSteps, isFieldVisible, validateAdoptionStep } from '#shared/adoption-form'

export function useAdoptionForm(type: AdoptionType) {
  const data = reactive<AdoptionApplicationData>(createAdoptionApplication(type))
  const steps = computed(() => getAdoptionSteps(data.type))
  const currentStepIndex = ref(0)
  const errors = ref<Record<string, string>>({})
  const currentStep = computed(() => steps.value[currentStepIndex.value]!)
  const progress = computed(() => Math.round(((currentStepIndex.value + 1) / steps.value.length) * 100))
  const isFirstStep = computed(() => currentStepIndex.value === 0)
  const isLastStep = computed(() => currentStepIndex.value === steps.value.length - 1)
  // `validateAdoptionStep` inserts keys in the order fields are rendered, so the first key is the topmost invalid field.
  const firstErrorKey = computed(() => Object.keys(errors.value)[0])

  const validateCurrentStep = () => {
    errors.value = validateAdoptionStep(data, currentStepIndex.value)
    return Object.keys(errors.value).length === 0
  }

  const nextStep = () => {
    if (!validateCurrentStep()) return false
    if (!isLastStep.value) currentStepIndex.value += 1
    return true
  }

  const previousStep = () => {
    if (!isFirstStep.value) currentStepIndex.value -= 1
    errors.value = {}
  }

  const goToStep = (index: number) => {
    if (index < 0 || index >= steps.value.length || index > currentStepIndex.value) return
    currentStepIndex.value = index
    errors.value = {}
  }

  const clearError = (name: string) => {
    if (!errors.value[name]) return
    const next = { ...errors.value }
    delete next[name]
    errors.value = next
  }

  const isVisible = (name: AdoptionScalarField) => {
    const field = currentStep.value.fields.find(item => item.name === name)
    return field ? isFieldVisible(field, data) : false
  }

  const addHouseholdMember = () => data.householdMembers.push({ fullName: '', birthDate: '', relationship: '' })
  const removeHouseholdMember = (index: number) => data.householdMembers.splice(index, 1)
  const addResidentPet = () => data.residentPets.push({ age: '', speciesBreed: '', gender: '' })
  const removeResidentPet = (index: number) => data.residentPets.splice(index, 1)

  const reset = () => {
    Object.assign(data, createAdoptionApplication(type))
    currentStepIndex.value = 0
    errors.value = {}
  }

  return {
    data,
    steps,
    currentStep,
    currentStepIndex,
    progress,
    errors,
    firstErrorKey,
    isFirstStep,
    isLastStep,
    validateCurrentStep,
    nextStep,
    previousStep,
    goToStep,
    clearError,
    isVisible,
    addHouseholdMember,
    removeHouseholdMember,
    addResidentPet,
    removeResidentPet,
    reset,
  }
}
