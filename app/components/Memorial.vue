<script setup lang="ts">
import { ref, computed } from 'vue'
import { useMemorialData } from "~/composables/useMemorialData"
import MemorialCard from "~/components/common/MemorialCard.vue"
import MemorialSubmissionForm from "~/components/common/MemorialSubmissionForm.vue";

const { pets } = useMemorialData()
const isModalOpen = ref(false)
const searchQuery = ref('')

const filteredPets = computed(() => {
  if (!searchQuery.value.trim()) return pets.value
  const q = searchQuery.value.toLowerCase()
  return pets.value.filter(p => p.name.toLowerCase().includes(q) || p.description.toLowerCase().includes(q))
})
</script>

<template>
  <main class="min-h-screen bg-white dark:bg-neutral-900 py-12">
    <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

      <!-- Page Header -->
      <header class="mx-auto max-w-2xl text-center">
        <h1 class="mt-2 text-4xl font-extrabold tracking-tight text-secondary sm:text-5xl">
          In Memoriam
        </h1>
        <span class="font-['Caveat'] text-3xl tracking-wider text-blue-violet dark:text-amber-gold">Furry Angels</span>
        <p class="mt-4 text-lg leading-relaxed text-slate-600 dark:text-slate-200">
          Honoring the wonderful pets who filled our lives with joy, unconditional love, and unforgettable memories.
        </p>
        <!-- Open Form Button -->
        <div class="mt-8">
          <UButton
              icon="i-material-symbols-candle-rounded"
              @click="isModalOpen = true"
              type="button"
              class="inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-primary-400 focus:outline-none focus:ring-2 focus:ring-amber-600 focus:ring-offset-2"
          >
            Submit a Pet Tribute
          </UButton>
        </div>
      </header>

      <!-- Search & Filter Bar -->
      <div class="mt-10 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div class="relative max-w-xs flex-1">
          <input
              v-model="searchQuery"
              type="text"
              placeholder="Search by name..."
              class="w-full rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm shadow-sm transition placeholder:text-slate-400 focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-500/20"
          />
        </div>
        <p class="text-xs text-slate-500 dark:text-slate-300">
          Showing {{ filteredPets.length }} {{ filteredPets.length === 1 ? 'memorial' : 'memorials' }}
        </p>
      </div>

      <!-- Grid -->
      <div class="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <MemorialCard
            v-for="pet in filteredPets"
            :key="pet.id"
            :pet="pet"
        />
      </div>

      <!-- Empty State -->
      <div v-if="filteredPets.length === 0" class="mt-12 rounded-2xl border border-dashed border-slate-300 p-12 text-center">
        <p class="text-slate-500">No memorials found matching your search.</p>
      </div>

    </div>

    <!-- Submission Modal -->
    <Teleport to="body">
      <Transition
          enter-active-class="transition duration-200 ease-out"
          enter-from-class="opacity-0"
          enter-to-class="opacity-100"
          leave-active-class="transition duration-150 ease-in"
          leave-from-class="opacity-100"
          leave-to-class="opacity-0"
      >
        <div
            v-if="isModalOpen"
            class="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 lg:p-8"
        >
          <!-- Backdrop -->
          <div
              class="fixed inset-0 bg-slate-900/60 backdrop-blur-xs transition-opacity"
              @click="isModalOpen = false"
          />

          <!-- Modal Dialog Frame -->
          <div
              class="relative flex max-h-[85vh] w-full max-w-3xl flex-col overflow-hidden rounded-3xl bg-white shadow-2xl ring-1 ring-slate-900/10"
          >
            <!-- Fixed Header Bar inside Modal -->
            <div class="flex items-center justify-between border-b border-slate-100 px-6 py-4 sm:px-8">
              <h3 class="text-lg font-bold text-slate-900">Submit a Pet Tribute</h3>
              <button
                  @click="isModalOpen = false"
                  type="button"
                  class="rounded-full bg-slate-100 p-2 text-slate-400 transition hover:bg-slate-200 hover:text-slate-600 focus:outline-none"
                  aria-label="Close modal"
              >
                <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <!-- Scrollable Form Container (Fully Clipped) -->
            <div class="flex-1 overflow-y-auto p-6 sm:p-8 custom-scrollbar">
              <MemorialSubmissionForm />
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>
  </main>
</template>
