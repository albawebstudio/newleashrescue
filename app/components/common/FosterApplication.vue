<script setup lang="ts">
import ProgramApplicationLinks from '~/components/common/ProgramApplicationLinks.vue'
import { useFosterData } from '~/composables/useFosterData'

const { fosterApplication, onlineApplications } = useFosterData()
</script>

<template>
  <ProgramApplicationLinks
    :online-applications="onlineApplications"
    :download-applications="fosterApplication"
  />
</template>
