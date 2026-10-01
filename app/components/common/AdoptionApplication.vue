<script setup lang="ts">
import ProgramApplicationLinks from '~/components/common/ProgramApplicationLinks.vue'
import { useAdoptData } from '~/composables/useAdoptData'

const { onlineApplications, adoptionApplicationDownloads } = useAdoptData()
</script>

<template>
  <ProgramApplicationLinks
    :online-applications="onlineApplications"
    :download-applications="adoptionApplicationDownloads"
  />
</template>
