<script setup lang="ts">
import type { AdoptionType } from '#shared/adoption-form'
import AdoptionForm from '~/components/common/AdoptionForm.vue'

const route = useRoute()
const type = route.params.type

if (type !== 'dog' && type !== 'cat') {
  throw createError({ statusCode: 404, statusMessage: 'Adoption application not found' })
}

const applicationType = type as AdoptionType
useSeoMeta({
  title: `${applicationType === 'dog' ? 'Dog' : 'Cat'} Adoption Application | New Leash Rescue`,
  description: `Apply online to adopt a ${applicationType} from New Leash Rescue.`,
})
</script>

<template>
  <main class="mt-20 min-h-screen bg-gray-50 dark:bg-gray-950">
    <AdoptionForm :type="applicationType" />
  </main>
</template>
