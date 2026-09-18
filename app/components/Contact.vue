<script setup lang="ts">
import { ref, shallowRef } from 'vue'
import { useSiteData } from "~/composables/useSiteData"
import { useContactData } from "~/composables/useContactData"
import { differenceInSeconds } from "date-fns"
import Spinner from "~/components/common/Spinner.vue"
import ContactForm   from "~/components/common/ContactForm.vue"
import Success from "~/components/common/Success.vue"

export interface ContactFormResponse {
  success: boolean
}

const { contact } = useContactData()
const { site, phone, address } = useSiteData()

interface FormData {
  name: string,
  subject: string,
  email: string,
  phone: string,
  form_time: Date | string,
  messageBody: string,
}

const showSpinner = shallowRef(false)
const showSuccess = shallowRef(false)
const showForm = computed(() => !showSuccess.value && !showSpinner.value)

const getInitialFormData = (): FormData => ({
  name: "",
  subject: "",
  email: "",
  phone: "",
  form_time: new Date(),
  messageBody: "",
})

const form = ref<FormData>(getInitialFormData());
const resetForm = () => Object.assign(form.value, getInitialFormData());

const isFormValid = computed(() => {
  return form.value.name.trim() &&
      form.value.email.trim() &&
      form.value.subject.trim() &&
      form.value.messageBody.trim();
});

const submitForm = async () => {
  showSpinner.value = true
  // validate
  if (!isFormValid) {
    showSpinner.value = false
    return;
  }
  try{

    const formData = form.value
    const submissionDT = new Date()
    const isOutsideThreshold = differenceInSeconds(submissionDT, formData.form_time) > 5

    if (formData.phone === '' && isOutsideThreshold) {
      const { phone, form_time, ...contactForm } = formData
      const contactFormResponse = await useApi<ContactFormResponse>('/api/send', {
        method: 'POST',
        body: contactForm,
      })

      if (!contactFormResponse.success) {
        throw new Error('Failed to submit form')
      }
    }
    resetForm()
    showSpinner.value = false
    showSuccess.value = true
  } catch (e) {
    console.log(e);
    showSpinner.value = false
  }
}
const clearSuccess = () => {
  resetForm()
  showSuccess.value=false
}
</script>

<template>
  <section id="contact-us" class="bg-white dark:bg-gray-900">
    <div class="pt-8 px-4 mx-auto max-w-7xl sm:pt-16 lg:px-6">
      <div class="mx-auto text-center">
        <h2 class="font-luckiest-guy text-primary mb-4 text-4xl tracking-tight font-extrabold leading-tight">{{ contact.h2 }}</h2>
        <template v-for="(paragraph, index) in contact.content" :key="index">
          <p class="mb-6 font-light text-gray-500 dark:text-gray-400 md:text-lg" v-html="paragraph" />
        </template>
      </div>
    </div>
    <div class="px-2">
      <div class="flex flex-wrap mx-4">
        <div class="w-full md:w-2/3 py-8 lg:py-16 px-4 mx-auto max-w-3xl space-y-4">
          <Spinner v-if="showSpinner" />

          <ContactForm
              v-if="showForm"
              v-model:name.trim="form.name"
              v-model:email.trim="form.email"
              v-model:phone.trim="form.phone"
              v-model:subject.trim="form.subject"
              v-model:messageBody.trim="form.messageBody"
              @submit="submitForm"
          />

          <Success @updateClearSuccess="clearSuccess" v-if="showSuccess" />

        </div>

        <div class="w-full md:w-1/3 flex flex-col place-content-center text-center place-items-center space-y-4 p-6 rounded-lg">
          <div class="flex flex-col items-center space-x-2">
            <div class="flex flex-col items-center justify-center w-10 h-10 bg-blue-500 rounded-full">
              <svg class="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                <path fill-rule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clip-rule="evenodd"></path>
              </svg>
            </div>
            <p class="font-semibold text-lg dark:text-white">{{ contact.locationLabel }}</p>
          </div>
          <p class="text-gray-500 dark:text-gray-400">{{ address.address1 }} {{ address.city }}, {{ address.state }} {{ address.postcode }}</p>

<!--          <div class="flex flex-col items-center space-x-2">
            <div class="flex flex-col items-center justify-center w-10 h-10 bg-blue-500 rounded-full">
              <svg class="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z"></path>
              </svg>
            </div>
            <p class="font-semibold text-lg dark:text-white">{{ contact.callLabel }}</p>
          </div>
          <p class="text-gray-500 dark:text-gray-400">{{ contact.callContent }}</p>
          <p class="text-primary hover:text-primary-300 font-bold"><NuxtLink :to="'tel:' + phone.raw">{{phone.formatted}}</NuxtLink></p>-->
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>

</style>
