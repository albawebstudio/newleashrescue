<script setup lang="ts">
import FosterForm from '~/components/common/FosterForm.vue'

useSeoMeta({
  title: 'Foster Home Application | New Leash Rescue',
  description: 'Apply online to become a foster home with New Leash Rescue.',
})
</script>

<template>
  <main class="mt-20 min-h-screen bg-gray-50 dark:bg-gray-950">
    <FosterForm />
  </main>
</template>
