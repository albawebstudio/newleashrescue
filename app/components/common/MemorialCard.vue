<script setup lang="ts">
import type { MemorialPet } from '~/models/memorials'

defineProps<{
  pet: MemorialPet
}>()
</script>

<template>
  <div
      class="group flex flex-col overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-slate-200/60 transition-all duration-300 hover:-translate-y-1 hover:shadow-md"
  >
    <!-- Photo Container -->
    <div class="relative aspect-4/3 w-full overflow-hidden bg-slate-100">
      <img
          :src="pet.image"
          :alt="pet.imageAlt || pet.name"
          class="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
      />
      <!-- Gentle Overlay Badge for Age/Dates -->
      <div class="absolute bottom-3 left-3 rounded-full bg-slate-900/70 px-3 py-1 text-xs font-medium text-white backdrop-blur-md">
        {{ pet.ageAtPassing }}
      </div>
    </div>

    <!-- Content -->
    <div class="flex flex-1 flex-col p-5">
      <div class="mb-2 flex items-baseline justify-between">
        <h3 class="text-xl font-bold tracking-tight text-slate-900">
          {{ pet.name }}
        </h3>
        <span v-if="pet.yearsActive" class="text-xs font-medium text-slate-500">
          {{ pet.yearsActive }}
        </span>
      </div>

      <p class="mb-4 text-sm leading-relaxed text-slate-600 line-clamp-4">
        {{ pet.description }}
      </p>

      <!-- Attribution / Footer -->
      <div class="mt-auto border-t border-slate-100 pt-3 text-xs italic text-slate-500">
        {{ pet.tributeBy || 'Forever in our hearts' }}
      </div>
    </div>
  </div>
</template>
