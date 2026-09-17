<script setup lang="ts">
import { ref, reactive } from 'vue'

const isDragging = ref(false)
const isSubmitting = ref(false)
const isSubmitted = ref(false)
const imagePreview = ref<string | null>(null)
const selectedFile = ref<File | null>(null)
const fileInput = ref<HTMLInputElement | null>(null)

const form = reactive({
  name: '',
  age: '',
  tributeBy: '',
  yearsActive: '',
  story: '',
  contactEmail: ''
})

function processFile(file: File) {
  if (!file.type.startsWith('image/')) return
  selectedFile.value = file
  const reader = new FileReader()
  reader.onload = (e) => {
    imagePreview.value = e.target?.result as string
  }
  reader.readAsDataURL(file)
}

function handleFileSelect(event: Event) {
  const target = event.target as HTMLInputElement
  if (target.files && target.files[0]) {
    processFile(target.files[0])
  }
}

function handleDrop(event: DragEvent) {
  isDragging.value = false
  if (event.dataTransfer?.files && event.dataTransfer.files[0]) {
    processFile(event.dataTransfer.files[0])
  }
}

function clearImage() {
  imagePreview.value = null
  selectedFile.value = null
  if (fileInput.value) {
    fileInput.value.value = ''
  }
}

async function handleSubmit() {
  if (!selectedFile.value) {
    alert('Please upload a photo of the pet.')
    return
  }

  isSubmitting.value = true

  try {
    const formData = new FormData()
    formData.append('name', form.name)
    formData.append('age', form.age)
    formData.append('tributeBy', form.tributeBy)
    formData.append('yearsActive', form.yearsActive)
    formData.append('story', form.story)
    formData.append('contactEmail', form.contactEmail)
    formData.append('photo', selectedFile.value)

    // Replace with your API route / Worker endpoint / FormData handler
    await $fetch('/api/memoriam/submit', {
      method: 'POST',
      body: formData
    })

    isSubmitted.value = true
  } catch (err) {
    console.error('Submission failed:', err)
  } finally {
    isSubmitting.value = false
  }
}

function resetForm() {
  form.name = ''
  form.age = ''
  form.tributeBy = ''
  form.yearsActive = ''
  form.story = ''
  form.contactEmail = ''
  clearImage()
  isSubmitted.value = false
}
</script>

<template>
  <div class="mx-auto max-w-3xl bg-white p-6 sm:p-10">
    <!-- Success Banner -->
    <div
        v-if="isSubmitted"
        class="rounded-2xl bg-emerald-50 p-6 text-center text-emerald-900 ring-1 ring-emerald-200"
    >
      <div class="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
        <svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
        </svg>
      </div>
      <h3 class="mt-4 text-xl font-bold">Tribute Received</h3>
      <p class="mt-2 text-sm text-emerald-700">
        Thank you for sharing your memorial for {{ form.name }}. Our team will review and publish it shortly.
      </p>
      <button
          type="button"
          @click="resetForm"
          class="mt-6 rounded-xl bg-emerald-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:ring-offset-2"
      >
        Submit Another Memorial
      </button>
    </div>

    <!-- Main Form -->
    <form v-else @submit.prevent="handleSubmit" class="space-y-8">
      <div>
        <h2 class="text-2xl font-bold tracking-tight text-slate-900">Submit a Memorial</h2>
        <p class="mt-1 text-sm text-slate-600">
          Share a pet’s story to be remembered on our Rainbow Bridge page.
        </p>
      </div>

      <div class="grid grid-cols-1 gap-6 sm:grid-cols-2">
        <!-- Pet Name -->
        <div>
          <label for="pet-name" class="block text-sm font-semibold text-slate-900">
            Pet's Name <span class="text-primary">*</span>
          </label>
          <input
              id="pet-name"
              v-model="form.name"
              type="text"
              required
              placeholder="e.g., Barnaby"
              class="mt-2 block w-full rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm text-slate-900 shadow-sm placeholder:text-slate-400 focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-500/20"
          />
        </div>

        <!-- Age at Passing -->
        <div>
          <label for="pet-age" class="block text-sm font-semibold text-slate-900">
            Age at Passing <span class="text-primary">*</span>
          </label>
          <input
              id="pet-age"
              v-model="form.age"
              type="text"
              required
              placeholder="e.g., 12 years old"
              class="mt-2 block w-full rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm text-slate-900 shadow-sm placeholder:text-slate-400 focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-500/20"
          />
        </div>

        <!-- Submitters / Family Attribution -->
        <div>
          <label for="tribute-by" class="block text-sm font-semibold text-slate-900">
            Loved By / Family Name
          </label>
          <input
              id="tribute-by"
              v-model="form.tributeBy"
              type="text"
              placeholder="e.g., The Miller Family"
              class="mt-2 block w-full rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm text-slate-900 shadow-sm placeholder:text-slate-400 focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-500/20"
          />
        </div>

        <!-- Years Active / Memorial Dates -->
        <div>
          <label for="years-active" class="block text-sm font-semibold text-slate-900">
            Years / Dates <span class="text-xs font-normal text-slate-500">(Optional)</span>
          </label>
          <input
              id="years-active"
              v-model="form.yearsActive"
              type="text"
              placeholder="e.g., 2012 – 2026"
              class="mt-2 block w-full rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm text-slate-900 shadow-sm placeholder:text-slate-400 focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-500/20"
          />
        </div>
      </div>

      <!-- Photo Upload Area -->
      <div>
        <label class="block text-sm font-semibold text-slate-900">
          Pet Photo <span class="text-primary">*</span>
        </label>

        <div
            @dragover.prevent="isDragging = true"
            @dragleave.prevent="isDragging = false"
            @drop.prevent="handleDrop"
            :class="[
            'mt-2 flex flex-col items-center justify-center rounded-2xl border-2 border-dashed p-6 transition-colors',
            isDragging ? 'border-secondary-500 bg-secondary-50/50' : 'border-slate-300 bg-slate-50/50 hover:bg-slate-100/50'
          ]"
        >
          <!-- Image Preview if Selected -->
          <div v-if="imagePreview" class="relative group aspect-4/3 w-full max-w-xs overflow-hidden rounded-xl shadow-md">
            <img :src="imagePreview" alt="Uploaded Preview" class="h-full w-full object-cover" />
            <button
                type="button"
                @click="clearImage"
                class="absolute top-2 right-2 rounded-full bg-slate-900/70 p-1.5 text-white backdrop-blur-sm transition hover:bg-slate-900"
                title="Remove image"
            >
              <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <!-- Default Dropzone Prompt -->
          <template v-else>
            <div class="flex h-12 w-12 items-center justify-center rounded-full bg-white text-slate-400 shadow-xs">
              <svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <div class="mt-3 text-center text-sm text-slate-600">
              <label for="file-upload" class="cursor-pointer font-semibold text-secondary-600 hover:text-secondary-500 focus-within:outline-none">
                <span>Upload a file</span>
                <input
                    id="file-upload"
                    ref="fileInput"
                    type="file"
                    accept="image/*"
                    class="sr-only"
                    @change="handleFileSelect"
                />
              </label>
              <span class="pl-1">or drag and drop</span>
            </div>
            <p class="mt-1 text-xs text-slate-400">PNG, JPG, or WEBP up to 5MB</p>
          </template>
        </div>
      </div>

      <!-- Story / Description -->
      <div>
        <div class="flex items-center justify-between">
          <label for="pet-story" class="block text-sm font-semibold text-slate-900">
            Memory & Character Description <span class="text-primary">*</span>
          </label>
          <span class="text-xs text-slate-400">{{ form.story.length }} / 500 characters</span>
        </div>
        <textarea
            id="pet-story"
            v-model="form.story"
            rows="4"
            maxlength="500"
            required
            placeholder="Tell us about their personality, favorite activities, or what made them special..."
            class="mt-2 block w-full rounded-xl border border-slate-300 bg-white p-4 text-sm text-slate-900 shadow-sm placeholder:text-slate-400 focus:border-secondary-500 focus:outline-none focus:ring-2 focus:ring-secondary-500/20"
        ></textarea>
      </div>

      <!-- Submitter Contact Information -->
      <div class="border-t border-slate-100 pt-6">
        <h3 class="text-sm font-semibold text-slate-900">Your Contact Info</h3>
        <p class="text-xs text-slate-500">Internal use only — we will reach out if we have questions regarding the post.</p>

        <div class="mt-4 grid grid-cols-1 gap-6 sm:grid-cols-2">
          <div>
            <label for="contact-email" class="block text-xs font-semibold text-slate-700">Email Address <span class="text-primary">*</span></label>
            <input
                id="contact-email"
                v-model="form.contactEmail"
                type="email"
                required
                placeholder="you@example.com"
                class="mt-1 block w-full rounded-xl border border-slate-300 bg-white px-4 py-2 text-sm text-slate-900 shadow-sm placeholder:text-slate-400 focus:border-secondary-500 focus:outline-none focus:ring-2 focus:ring-secondary-500/20"
            />
          </div>
        </div>
      </div>

      <!-- Live Card Preview Option -->
      <div v-if="form.name || imagePreview || form.story" class="rounded-2xl border border-slate-200 bg-slate-50/50 p-4">
        <span class="text-xs font-semibold uppercase tracking-wider text-slate-400">Live Preview</span>
        <div class="mt-3 max-w-xs overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-slate-200">
          <div class="aspect-4/3 relative w-full bg-slate-100">
            <img v-if="imagePreview" :src="imagePreview" class="h-full w-full object-cover" />
            <div v-else class="flex h-full w-full items-center justify-center text-xs text-slate-400">No Image Selected</div>
            <div v-if="form.age" class="absolute bottom-3 left-3 rounded-full bg-slate-900/70 px-3 py-1 text-xs font-medium text-white backdrop-blur-md">
              {{ form.age }}
            </div>
          </div>
          <div class="p-4">
            <div class="flex items-baseline justify-between">
              <h4 class="font-bold text-slate-900">{{ form.name || 'Pet Name' }}</h4>
              <span class="text-xs text-slate-500">{{ form.yearsActive }}</span>
            </div>
            <p class="mt-2 text-xs text-slate-600 line-clamp-3">
              {{ form.story || 'Your memory text will appear here...' }}
            </p>
            <div class="mt-3 border-t border-slate-100 pt-2 text-[10px] italic text-slate-400">
              {{ form.tributeBy ? `Loved by ${form.tributeBy}` : 'Forever in our hearts' }}
            </div>
          </div>
        </div>
      </div>

      <!-- Action Buttons -->
      <div class="flex items-center justify-end gap-4 border-t border-slate-100 pt-6">
        <button
            type="submit"
            :disabled="isSubmitting"
            class="inline-flex items-center justify-center rounded-xl bg-secondary-600 px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-secondary-500 focus:outline-none focus:ring-2 focus:ring-secondary-600 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <svg v-if="isSubmitting" class="mr-2 h-4 w-4 animate-spin text-white" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          {{ isSubmitting ? 'Submitting...' : 'Submit Tribute' }}
        </button>
      </div>
    </form>
  </div>
</template>
