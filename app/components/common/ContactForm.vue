<script setup lang="ts">
interface Props {
  name: string;
  email: string;
  phone: string
  subject: string;
  messageBody: string;
}

const props = defineProps<Props>();

const SUBJECT_OPTIONS = [
  'Adoption Inquiry',
  'Volunteer Opportunities',
  'Donation Information',
  'Foster Care Program',
  'General Questions or Feedback',
] as const;

const emit = defineEmits<{
  (e: 'update:name', value: string): void
  (e: 'update:email', value: string): void
  (e: 'update:phone', value: string): void
  (e: 'update:subject', value: string): void
  (e: 'update:messageBody', value: string): void
  (e: 'submit'): void
}>();

const updateName = (event: Event) => {
  emit('update:name', (event.target as HTMLInputElement).value);
};

const updateEmail = (event: Event) => {
  emit('update:email', (event.target as HTMLInputElement).value);
};

const updatePhone = (event: Event) => {
  emit('update:phone', (event.target as HTMLInputElement).value)
}

const updateSubject = (event: Event) => {
  emit('update:subject', (event.target as HTMLSelectElement).value);
};

const updateMessage = (event: Event) => {
  emit('update:messageBody', (event.target as HTMLTextAreaElement).value);
};

const submitForm = () => {
  emit('submit');
};
</script>

<template>
  <section id="contact">
    <form @submit.prevent="submitForm" class="space-y-8">
      <div>
        <label for="subject" class="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300">Subject</label>
        <select :value="subject"
                @change="updateSubject"
                id="subject"
                class="block p-3 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 shadow-sm focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500 dark:shadow-sm-light cursor-pointer"
                required>
          <option value="" disabled>Select a topic</option>
          <option v-for="option in SUBJECT_OPTIONS" :key="option" :value="option">{{ option }}</option>
        </select>
      </div>
      <div>
        <label for="name" class="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300">Your Full Name</label>
        <input :value="name"
               @input="updateName"
               type="text"
               id="name"
               class="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500 dark:shadow-sm-light"
               placeholder="Your first and last name"
               required>
      </div>
      <div>
        <label for="email" class="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300">Your email</label>
        <input :value="email"
               @input="updateEmail"
               type="email"
               id="email"
               class="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500 dark:shadow-sm-light"
               placeholder="you@email.com"
               required>
      </div>
      <div class="form__alt" aria-hidden="true">
        <label for="mobile">Mobile</label>
        <input
            :value="phone ?? ''"
            @input="updatePhone"
            type="tel"
            name="mobile"
            id="mobile"
            tabindex="-1"
            autocomplete="off"
            data-1p-ignore
            data-lpignore="true"
            data-bwignore
            data-form-type="other"
            data-protonpass-ignore
        />
      </div>
      <div class="sm:col-span-2">
        <label for="messageBody" class="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-400">Your message</label>
        <textarea :value="messageBody"
                  @input="updateMessage"
                  id="messageBody"
                  rows="6"
                  class="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg shadow-sm border border-gray-300 focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                  placeholder="Share your message..."></textarea>
      </div>
      <button type="submit" class="py-3 px-5 text-sm font-medium text-center text-white rounded-lg bg-primary sm:w-fit hover:bg-primary-600 focus:ring-4 focus:outline-none focus:ring-primary-300 dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800">Send message</button>
    </form>
  </section>
</template>

<style scoped>
.form__alt {
  position: absolute;
  left: -9999px;
  width: 1px;
  height: 1px;
  overflow: hidden;
}
</style>
