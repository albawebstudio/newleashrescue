<script setup lang="ts">
import { useVolunteerData } from '~/composables/useVolunteerData'

const { volunteerApplication, onlineApplications } = useVolunteerData()
</script>

<template>
  <div class="flex w-full max-w-3xl flex-col items-stretch gap-4 px-4">
    <div class="flex flex-col flex-wrap justify-center gap-4 sm:flex-row">
      <NuxtLink
        v-for="application in onlineApplications"
        :key="application.to"
        :to="application.to"
        :title="application.title"
        class="inline-flex w-full items-center justify-center gap-x-2 rounded-xl border border-primary bg-primary px-6 py-4 text-xl font-medium text-nowrap text-white transition hover:bg-primary-600 focus:bg-primary-600 focus:outline-hidden sm:w-auto"
      >
        <UIcon :name="application.icon" class="size-6" />
        {{ application.cta }}
      </NuxtLink>
    </div>
    <p class="text-center text-sm text-blueGray-600">Prefer a printable form? Download a copy below.</p>
    <div class="flex flex-col flex-wrap justify-center gap-4 sm:flex-row">
      <a
        v-for="application in volunteerApplication"
        :key="application.href"
        :href="application.href"
        :download="application.filename"
        :title="application.title"
        class="inline-flex w-full items-center justify-center gap-x-2 rounded-xl border border-secondary-line bg-secondary px-6 py-4 text-xl font-medium text-nowrap text-white transition hover:bg-secondary-hover focus:bg-secondary-focus focus:outline-hidden sm:w-auto"
      >
        <UIcon name="i-material-symbols-download-rounded" class="size-6" />
        {{ application.cta }}
      </a>
    </div>
  </div>
</template>
