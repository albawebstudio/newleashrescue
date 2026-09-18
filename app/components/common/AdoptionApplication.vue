<script setup lang="ts">
import { useAdoptData } from "~/composables/useAdoptData";
const { adoptionApplication } = useAdoptData();
</script>

<template>
  <div class="flex flex-col sm:flex-row flex-wrap justify-center items-center gap-4 px-4">
    <NuxtLink
      v-for="application in adoptionApplication"
      :key="application.href"
      :to="application.href"
      :title="application.title"
      class="w-full sm:w-auto py-4 px-6 inline-flex justify-center items-center gap-x-2 text-xl font-medium text-nowrap rounded-xl border border-primary-line text-white bg-primary hover:bg-primary-hover focus:outline-hidden focus:bg-primary-focus transition disabled:opacity-50 disabled:pointer-events-none"
    >
      <UIcon :name="application.icon" class="size-6" />
      {{ application.cta }}
    </NuxtLink>
  </div>
</template>
