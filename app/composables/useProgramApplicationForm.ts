import type { FosterApplicationData } from '#shared/foster-form'
import { createFosterApplication, getFosterSteps, isFieldVisible as isFosterFieldVisible, validateFosterStep } from '#shared/foster-form'
import type { VolunteerApplicationData } from '#shared/volunteer-form'
import { createVolunteerApplication, getVolunteerSteps, isFieldVisible as isVolunteerFieldVisible, validateVolunteerStep } from '#shared/volunteer-form'

type ProgramApplicationKind = 'foster' | 'volunteer'

type ProgramApplicationData = FosterApplicationData | VolunteerApplicationData

export function useProgramApplicationForm(kind: ProgramApplicationKind) {
  const data = reactive<ProgramApplicationData>(
    kind === 'foster' ? createFosterApplication() : createVolunteerApplication(),
  )

  const steps = computed(() => (kind === 'foster' ? getFosterSteps() : getVolunteerSteps()))
  const currentStepIndex = ref(0)
  const errors = ref<Record<string, string>>({})
  const currentStep = computed(() => steps.value[currentStepIndex.value]!)
  const progress = computed(() => Math.round(((currentStepIndex.value + 1) / steps.value.length) * 100))
  const isFirstStep = computed(() => currentStepIndex.value === 0)
  const isLastStep = computed(() => currentStepIndex.value === steps.value.length - 1)
  const firstErrorKey = computed(() => Object.keys(errors.value)[0])

  const validateCurrentStep = () => {
    errors.value = kind === 'foster'
      ? validateFosterStep(data as FosterApplicationData, currentStepIndex.value)
      : validateVolunteerStep(data as VolunteerApplicationData, currentStepIndex.value)
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

  const clearError = (name: string) => {
    if (!errors.value[name]) return
    const next = { ...errors.value }
    delete next[name]
    errors.value = next
  }

  const isFieldVisible = (fieldName: string) => {
    const field = currentStep.value.fields.find(item => item.name === fieldName)
    if (!field) return false
    return kind === 'foster'
      ? isFosterFieldVisible(field as never, data as FosterApplicationData)
      : isVolunteerFieldVisible(field as never, data as VolunteerApplicationData)
  }

  const addHouseholdMember = () => {
    if (kind !== 'foster') return
    ;(data as FosterApplicationData).householdMembers.push({ fullName: '', birthDate: '' })
  }

  const removeHouseholdMember = (index: number) => {
    if (kind !== 'foster') return
    ;(data as FosterApplicationData).householdMembers.splice(index, 1)
  }

  const addHouseholdChild = () => {
    if (kind !== 'foster') return
    ;(data as FosterApplicationData).householdChildren.push({ name: '', age: '' })
  }

  const removeHouseholdChild = (index: number) => {
    if (kind !== 'foster') return
    ;(data as FosterApplicationData).householdChildren.splice(index, 1)
  }

  const addResidentPet = () => {
    if (kind !== 'foster') return
    ;(data as FosterApplicationData).residentPets.push({ age: '', size: '', speciesBreed: '' })
  }

  const removeResidentPet = (index: number) => {
    if (kind !== 'foster') return
    ;(data as FosterApplicationData).residentPets.splice(index, 1)
  }

  const toggleMultiselect = (fieldName: 'fosterInterests' | 'volunteerInterests', option: string) => {
    if (kind === 'foster') {
      const selections = (data as FosterApplicationData).fosterInterests
      const index = selections.indexOf(option)
      if (index >= 0) selections.splice(index, 1)
      else selections.push(option)
    } else {
      const selections = (data as VolunteerApplicationData).volunteerInterests
      const index = selections.indexOf(option)
      if (index >= 0) selections.splice(index, 1)
      else selections.push(option)
    }
    clearError(fieldName)
  }

  return {
    kind,
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
    clearError,
    isFieldVisible,
    addHouseholdMember,
    removeHouseholdMember,
    addHouseholdChild,
    removeHouseholdChild,
    addResidentPet,
    removeResidentPet,
    toggleMultiselect,
  }
}
