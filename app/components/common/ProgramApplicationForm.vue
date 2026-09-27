<script setup lang="ts">
import type { ApplicationDisclaimer } from '#shared/application-form-common'
import { normalizeChoice } from '#shared/application-form-common'
import type { FosterApplicationData, FosterField } from '#shared/foster-form'
import { formatFosterDisplayValue, isFieldRequired as isFosterFieldRequired, isFieldVisible as isFosterFieldVisible } from '#shared/foster-form'
import type { VolunteerApplicationData, VolunteerField } from '#shared/volunteer-form'
import { formatVolunteerDisplayValue, isFieldRequired as isVolunteerFieldRequired, isFieldVisible as isVolunteerFieldVisible } from '#shared/volunteer-form'

const props = defineProps<{
  kind: 'foster' | 'volunteer'
  eyebrow: string
  successTitle: string
  successMessage: string
  successLinkTo: string
  successLinkLabel: string
  submitEndpoint: string
  submitErrorFallback: string
  disclaimer?: ApplicationDisclaimer
}>()

const {
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
  nextStep,
  previousStep,
  clearError,
  addHouseholdMember,
  removeHouseholdMember,
  addHouseholdChild,
  removeHouseholdChild,
  addResidentPet,
  removeResidentPet,
  toggleMultiselect,
  validateCurrentStep,
} = useProgramApplicationForm(props.kind)

const fosterData = computed(() => data as FosterApplicationData)
const volunteerData = computed(() => data as VolunteerApplicationData)

const submitting = ref(false)
const submitted = ref(false)
const submitError = ref('')

const fieldClass = 'mt-2 block w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-gray-900 shadow-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20 dark:border-gray-600 dark:bg-gray-800 dark:text-white'

type ProgramField = FosterField | VolunteerField

const isFieldVisible = (field: ProgramField) =>
  kind === 'foster'
    ? isFosterFieldVisible(field as FosterField, fosterData.value)
    : isVolunteerFieldVisible(field as VolunteerField, volunteerData.value)

const isFieldRequired = (field: ProgramField) =>
  kind === 'foster'
    ? isFosterFieldRequired(field as FosterField, fosterData.value)
    : isVolunteerFieldRequired(field as VolunteerField, volunteerData.value)

const fieldValue = (field: ProgramField) => {
  if (field.type === 'multiselect') {
    return kind === 'foster' ? fosterData.value.fosterInterests : volunteerData.value.volunteerInterests
  }
  return data[field.name as keyof typeof data]
}

const setValue = (name: string, value: string | boolean) => {
  ;(data as Record<string, unknown>)[name] = value
  clearError(name)
}

const inputValue = (event: Event) => (event.target as HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement).value
const checkedValue = (event: Event) => (event.target as HTMLInputElement).checked

const fieldElements = new Map<string, HTMLElement>()
const setFieldElement = (key: string, element: unknown) => {
  if (element instanceof HTMLElement) {
    fieldElements.set(key, element)
    return
  }
  const registered = fieldElements.get(key)
  if (registered && !registered.isConnected) fieldElements.delete(key)
}

const scrollBehavior = (): ScrollBehavior =>
  window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth'

const scrollToTop = () => window.scrollTo({ top: 0, behavior: scrollBehavior() })

async function scrollToFirstError() {
  await nextTick()
  const key = firstErrorKey.value
  if (!key) return
  const element = fieldElements.get(key) ?? fieldElements.get(key.split('.')[0]!)
  if (!element) return
  element.scrollIntoView({ behavior: scrollBehavior(), block: 'center' })
  element.querySelector<HTMLElement>('input, select, textarea')?.focus({ preventScroll: true })
}

async function goToNextStep() {
  if (!nextStep()) {
    await scrollToFirstError()
    return
  }
  scrollToTop()
}

function goToPreviousStep() {
  previousStep()
  scrollToTop()
}

const fieldSpan = (field: ProgramField) =>
  field.type === 'textarea' || field.type === 'radio' || field.type === 'checkbox' || field.type === 'multiselect' ? 'md:col-span-2' : ''

const visibleFields = (fields: ProgramField[]) => fields.filter(field => isFieldVisible(field))

const displayValue = (field: ProgramField) => {
  const value = fieldValue(field)
  return kind === 'foster'
    ? formatFosterDisplayValue(field as FosterField, value as string | boolean | string[])
    : formatVolunteerDisplayValue(field as VolunteerField, value as string | boolean | string[])
}

const multiselectFieldName = computed(() => (kind === 'foster' ? 'fosterInterests' : 'volunteerInterests') as 'fosterInterests' | 'volunteerInterests')

async function submitApplication() {
  submitError.value = ''
  if (!validateCurrentStep()) {
    await scrollToFirstError()
    return
  }
  submitting.value = true
  try {
    await $fetch(props.submitEndpoint, { method: 'POST', body: data })
    submitted.value = true
    scrollToTop()
  } catch (error: unknown) {
    const fetchError = error as { data?: { message?: string } }
    submitError.value = fetchError.data?.message || props.submitErrorFallback
  } finally {
    submitting.value = false
  }
}
</script>

<template>
  <div class="mx-auto w-full max-w-4xl px-4 py-10 sm:px-6">
    <div v-if="submitted" class="rounded-3xl border border-green-200 bg-green-50 p-8 text-center shadow-sm dark:border-green-900 dark:bg-green-950/40">
      <UIcon name="i-material-symbols-check-circle-rounded" class="mx-auto size-16 text-green-600" />
      <h1 class="mt-4 text-3xl font-bold text-gray-900 dark:text-white">{{ successTitle }}</h1>
      <p class="mx-auto mt-3 max-w-xl text-gray-700 dark:text-gray-300">{{ successMessage }}</p>
      <NuxtLink :to="successLinkTo" class="mt-6 inline-flex rounded-xl bg-primary px-6 py-3 font-semibold text-white transition hover:bg-primary-600">
        {{ successLinkLabel }}
      </NuxtLink>
    </div>

    <template v-else>
      <header class="mb-8">
        <p class="text-sm font-semibold uppercase tracking-wider text-primary">{{ eyebrow }}</p>
        <div class="mt-2 flex items-end justify-between gap-4">
          <div>
            <h1 class="text-3xl font-bold text-gray-900 dark:text-white">{{ currentStep.title }}</h1>
            <p class="mt-2 text-gray-600 dark:text-gray-300">{{ currentStep.description }}</p>
          </div>
          <p class="shrink-0 text-sm font-semibold text-gray-700 dark:text-gray-200">Step {{ currentStepIndex + 1 }} of {{ steps.length }}</p>
        </div>
        <div class="mt-5 h-2 overflow-hidden rounded-full bg-gray-200 dark:bg-gray-700" role="progressbar" :aria-valuenow="progress" aria-valuemin="0" aria-valuemax="100" :aria-label="`${progress}% complete`">
          <div class="h-full rounded-full bg-primary transition-all duration-300" :style="{ width: `${progress}%` }" />
        </div>
      </header>

      <form class="rounded-3xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-700 dark:bg-gray-900 sm:p-8" novalidate @submit.prevent="isLastStep ? submitApplication() : goToNextStep()">
        <div v-if="currentStep.id !== 'review'" class="grid gap-6 md:grid-cols-2">
          <template v-for="field in visibleFields(currentStep.fields)" :key="field.name">
            <fieldset v-if="field.type === 'radio'" :ref="el => setFieldElement(field.name, el)" :class="fieldSpan(field)">
              <legend class="font-semibold text-gray-900 dark:text-white">{{ field.label }} <span v-if="isFieldRequired(field)" class="text-primary">*</span></legend>
              <div class="mt-3 flex flex-wrap gap-3">
                <label v-for="option in field.options" :key="option" class="flex cursor-pointer items-center gap-2 rounded-xl border border-gray-300 px-4 py-3 dark:border-gray-600">
                  <input :name="field.name" type="radio" :value="normalizeChoice(option)" :checked="data[field.name as keyof typeof data] === normalizeChoice(option)" class="size-4 accent-primary" @change="setValue(field.name, normalizeChoice(option))">
                  <span class="text-gray-800 dark:text-gray-100">{{ option }}</span>
                </label>
              </div>
              <p v-if="errors[field.name]" class="mt-2 text-sm text-red-600" role="alert">{{ errors[field.name] }}</p>
            </fieldset>

            <fieldset v-else-if="field.type === 'multiselect'" :ref="el => setFieldElement(field.name, el)" :class="fieldSpan(field)">
              <legend class="font-semibold text-gray-900 dark:text-white">{{ field.label }} <span v-if="isFieldRequired(field)" class="text-primary">*</span></legend>
              <div class="mt-3 grid gap-2 sm:grid-cols-2">
                <label v-for="option in field.options" :key="option" class="flex cursor-pointer items-center gap-2 rounded-xl border border-gray-300 px-4 py-3 dark:border-gray-600">
                  <input type="checkbox" :checked="(fieldValue(field) as string[]).includes(normalizeChoice(option))" class="size-4 accent-primary" @change="toggleMultiselect(multiselectFieldName, normalizeChoice(option))">
                  <span class="text-sm text-gray-800 dark:text-gray-100">{{ option }}</span>
                </label>
              </div>
              <p v-if="errors[field.name]" class="mt-2 text-sm text-red-600" role="alert">{{ errors[field.name] }}</p>
            </fieldset>

            <label v-else-if="field.type === 'checkbox'" :ref="el => setFieldElement(field.name, el)" :class="['flex cursor-pointer items-start gap-3 rounded-xl border p-4', fieldSpan(field), errors[field.name] ? 'border-red-500 bg-red-50 dark:bg-red-950/20' : 'border-gray-300 dark:border-gray-600']">
              <input type="checkbox" :checked="Boolean(data[field.name as keyof typeof data])" class="mt-1 size-5 shrink-0 accent-primary" @change="setValue(field.name, checkedValue($event))">
              <span class="text-sm font-semibold text-pretty text-gray-900 dark:text-white">{{ field.label }} <span v-if="isFieldRequired(field)" class="text-primary">*</span><span v-if="errors[field.name]" class="mt-1 block font-normal text-red-600" role="alert">{{ errors[field.name] }}</span></span>
            </label>

            <label v-else :ref="el => setFieldElement(field.name, el)" :class="['row-span-3 grid grid-rows-subgrid gap-y-0', fieldSpan(field)]">
              <span class="self-end font-semibold text-pretty text-gray-900 dark:text-white">{{ field.label }} <span v-if="isFieldRequired(field)" class="text-primary">*</span></span>
              <textarea v-if="field.type === 'textarea'" :value="String(data[field.name as keyof typeof data] ?? '')" :placeholder="field.placeholder" rows="4" :class="[fieldClass, errors[field.name] && 'border-red-500']" @input="setValue(field.name, inputValue($event))" />
              <select v-else-if="field.type === 'select'" :value="String(data[field.name as keyof typeof data] ?? '')" :class="['self-start', fieldClass, errors[field.name] && 'border-red-500']" @change="setValue(field.name, inputValue($event))">
                <option value="" disabled>Select an option</option>
                <option v-for="option in field.options" :key="option" :value="normalizeChoice(option)">{{ option }}</option>
              </select>
              <input v-else :type="field.type" :value="String(data[field.name as keyof typeof data] ?? '')" :placeholder="field.placeholder" :class="['self-start', fieldClass, errors[field.name] && 'border-red-500']" @input="setValue(field.name, inputValue($event))">
              <span v-if="field.help || errors[field.name]" class="block">
                <span v-if="field.help" class="mt-1 block text-sm text-gray-500">{{ field.help }}</span>
                <span v-if="errors[field.name]" class="mt-2 block text-sm text-red-600" role="alert">{{ errors[field.name] }}</span>
              </span>
            </label>
          </template>
        </div>

        <section v-if="kind === 'foster' && currentStep.repeaters?.includes('householdMembers')" class="mt-8 border-t border-gray-200 pt-8 dark:border-gray-700">
          <div class="flex items-center justify-between gap-4">
            <div>
              <h2 class="text-lg font-bold text-gray-900 dark:text-white">Adults in your household</h2>
              <p class="text-sm text-gray-600 dark:text-gray-300">Include full name and date of birth for each adult.</p>
            </div>
            <button type="button" class="shrink-0 rounded-lg border border-primary px-4 py-2 font-semibold text-primary hover:bg-primary-50" @click="addHouseholdMember">Add adult</button>
          </div>
          <p v-if="errors.householdMembers" class="mt-3 text-sm text-red-600">{{ errors.householdMembers }}</p>
          <div v-for="(member, index) in fosterData.householdMembers" :key="index" :ref="el => setFieldElement(`householdMembers.${index}`, el)" class="mt-4 grid gap-4 rounded-2xl bg-gray-50 p-4 dark:bg-gray-800 md:grid-cols-2">
            <label><span class="text-sm font-semibold">Full name</span><input v-model.trim="member.fullName" :class="fieldClass"></label>
            <label><span class="text-sm font-semibold">Birth date</span><input v-model="member.birthDate" type="date" :class="fieldClass"></label>
            <p v-if="errors[`householdMembers.${index}`]" class="text-sm text-red-600 md:col-span-2">{{ errors[`householdMembers.${index}`] }}</p>
            <button type="button" class="justify-self-start text-sm font-semibold text-red-600 md:col-span-2 md:justify-self-end" @click="removeHouseholdMember(index)">Remove</button>
          </div>
        </section>

        <section v-if="kind === 'foster' && currentStep.repeaters?.includes('householdChildren') && fosterData.hasChildren === 'yes'" class="mt-8 border-t border-gray-200 pt-8 dark:border-gray-700">
          <div class="flex items-center justify-between gap-4">
            <div>
              <h2 class="text-lg font-bold text-gray-900 dark:text-white">Children in your household</h2>
              <p class="text-sm text-gray-600 dark:text-gray-300">Include each child’s name and age.</p>
            </div>
            <button type="button" class="shrink-0 rounded-lg border border-primary px-4 py-2 font-semibold text-primary hover:bg-primary-50" @click="addHouseholdChild">Add child</button>
          </div>
          <p v-if="errors.householdChildren" class="mt-3 text-sm text-red-600">{{ errors.householdChildren }}</p>
          <div v-for="(child, index) in fosterData.householdChildren" :key="index" :ref="el => setFieldElement(`householdChildren.${index}`, el)" class="mt-4 grid gap-4 rounded-2xl bg-gray-50 p-4 dark:bg-gray-800 md:grid-cols-2">
            <label><span class="text-sm font-semibold">Name</span><input v-model.trim="child.name" :class="fieldClass"></label>
            <label><span class="text-sm font-semibold">Age</span><input v-model.trim="child.age" :class="fieldClass"></label>
            <p v-if="errors[`householdChildren.${index}`]" class="text-sm text-red-600 md:col-span-2">{{ errors[`householdChildren.${index}`] }}</p>
            <button type="button" class="justify-self-start text-sm font-semibold text-red-600 md:col-span-2 md:justify-self-end" @click="removeHouseholdChild(index)">Remove</button>
          </div>
        </section>

        <section v-if="kind === 'foster' && currentStep.repeaters?.includes('residentPets') && fosterData.hasOwnPets === 'yes'" :ref="el => setFieldElement('residentPets', el)" class="mt-8 border-t border-gray-200 pt-8 dark:border-gray-700">
          <div class="flex items-center justify-between gap-4">
            <div><h2 class="text-lg font-bold text-gray-900 dark:text-white">Your pets</h2><p class="text-sm text-gray-600 dark:text-gray-300">List age, size, and species/breed for each pet.</p></div>
            <button type="button" class="shrink-0 rounded-lg border border-primary px-4 py-2 font-semibold text-primary hover:bg-primary-50" @click="addResidentPet">Add pet</button>
          </div>
          <p v-if="errors.residentPets" class="mt-3 text-sm text-red-600">{{ errors.residentPets }}</p>
          <div v-for="(pet, index) in fosterData.residentPets" :key="index" :ref="el => setFieldElement(`residentPets.${index}`, el)" class="mt-4 grid gap-4 rounded-2xl bg-gray-50 p-4 dark:bg-gray-800 md:grid-cols-3">
            <label><span class="text-sm font-semibold">Age</span><input v-model.trim="pet.age" :class="fieldClass"></label>
            <label><span class="text-sm font-semibold">Size</span><input v-model.trim="pet.size" :class="fieldClass"></label>
            <label><span class="text-sm font-semibold">Species / breed</span><input v-model.trim="pet.speciesBreed" :class="fieldClass"></label>
            <p v-if="errors[`residentPets.${index}`]" class="text-sm text-red-600 md:col-span-2">{{ errors[`residentPets.${index}`] }}</p>
            <button type="button" class="justify-self-start text-sm font-semibold text-red-600 md:justify-self-end" @click="removeResidentPet(index)">Remove</button>
          </div>
        </section>

        <div v-if="currentStep.id === 'review'" class="space-y-6">
          <section v-for="step in steps.slice(0, -1)" :key="step.id" class="overflow-hidden rounded-2xl border border-gray-200 dark:border-gray-700">
            <h2 class="bg-gray-50 px-5 py-3 text-lg font-bold text-gray-900 dark:bg-gray-800 dark:text-white">{{ step.title }}</h2>
            <dl class="divide-y divide-gray-100 dark:divide-gray-800">
              <div v-for="field in visibleFields(step.fields)" :key="field.name" class="grid gap-1 px-5 py-3 sm:grid-cols-5">
                <dt class="text-sm font-semibold text-gray-600 dark:text-gray-300 sm:col-span-2">{{ field.label }}</dt>
                <dd class="break-words text-gray-900 dark:text-white sm:col-span-3">{{ displayValue(field) }}</dd>
              </div>
            </dl>
          </section>
          <section v-if="kind === 'foster' && (fosterData.householdMembers.length || fosterData.householdChildren.length || fosterData.residentPets.length)" class="rounded-2xl border border-gray-200 p-5 dark:border-gray-700">
            <h2 class="text-lg font-bold">Household details</h2>
            <p v-for="(member, index) in fosterData.householdMembers" :key="`adult-${index}`" class="mt-2">Adult: {{ member.fullName }} — {{ member.birthDate }}</p>
            <p v-for="(child, index) in fosterData.householdChildren" :key="`child-${index}`" class="mt-2">Child: {{ child.name }} — age {{ child.age }}</p>
            <p v-for="(pet, index) in fosterData.residentPets" :key="`pet-${index}`" class="mt-2">Pet: {{ pet.speciesBreed }} — age {{ pet.age }} — size {{ pet.size }}</p>
          </section>
          <label :ref="el => setFieldElement('certifiesAccuracy', el)" :class="['flex cursor-pointer items-start gap-3 rounded-xl border p-4', errors.certifiesAccuracy ? 'border-red-500 bg-red-50 dark:bg-red-950/20' : 'border-gray-300 dark:border-gray-600']">
            <input type="checkbox" :checked="data.certifiesAccuracy" class="mt-1 size-5 shrink-0 accent-primary" @change="setValue('certifiesAccuracy', checkedValue($event))">
            <span class="text-sm font-semibold text-pretty text-gray-900 dark:text-white">
              {{ currentStep.fields[0]?.label }} <span class="text-primary">*</span>
              <span v-if="errors.certifiesAccuracy" class="mt-1 block font-normal text-red-600" role="alert">{{ errors.certifiesAccuracy }}</span>
            </span>
          </label>
          <label class="sr-only" aria-hidden="true">Website<input v-model="data.website" type="text" tabindex="-1" autocomplete="off"></label>
          <aside v-if="disclaimer" class="rounded-2xl border border-gray-200 bg-gray-50 px-5 py-4 leading-relaxed text-gray-600 dark:border-gray-700 dark:bg-gray-800/60 dark:text-gray-300">
            <p>{{ disclaimer.intro }}</p>
            <ul class="mt-3 list-disc space-y-2 pl-4">
              <li v-for="item in disclaimer.items" :key="item.title">
                <span class="font-semibold text-gray-700 dark:text-gray-200">{{ item.title }}:</span>
                {{ item.body }}
              </li>
            </ul>
            <p v-if="disclaimer.closing" class="mt-3">{{ disclaimer.closing }}</p>
          </aside>
        </div>

        <p v-if="submitError" class="mt-6 rounded-xl bg-red-50 p-4 text-red-700 dark:bg-red-950/30 dark:text-red-300" role="alert">{{ submitError }}</p>

        <div class="mt-8 flex items-center justify-between gap-4 border-t border-gray-200 pt-6 dark:border-gray-700">
          <button v-if="!isFirstStep" type="button" class="rounded-xl border border-gray-300 px-5 py-3 font-semibold text-gray-800 hover:bg-gray-50 dark:border-gray-600 dark:text-white dark:hover:bg-gray-800" @click="goToPreviousStep">Back</button>
          <span v-else />
          <button type="submit" :disabled="submitting" class="inline-flex items-center gap-2 rounded-xl bg-primary px-6 py-3 font-semibold text-white transition hover:bg-primary-600 disabled:cursor-not-allowed disabled:opacity-60">
            <UIcon v-if="submitting" name="i-material-symbols-progress-activity" class="size-5 animate-spin" />
            {{ isLastStep ? (submitting ? 'Sending…' : 'Submit application') : 'Continue' }}
          </button>
        </div>
      </form>
    </template>
  </div>
</template>
