<script setup lang="ts">
import VolunteerForm from '~/components/common/VolunteerForm.vue'

useSeoMeta({
  title: 'Volunteer Application | New Leash Rescue',
  description: 'Apply online to volunteer with New Leash Rescue.',
})
</script>

<template>
  <main class="mt-20 min-h-screen bg-gray-50 dark:bg-gray-950">
    <VolunteerForm />
  </main>
</template>
