<script setup lang="ts">
import ProgramApplicationLinks from '~/components/common/ProgramApplicationLinks.vue'
import { useVolunteerData } from '~/composables/useVolunteerData'

const { volunteerApplication, onlineApplications } = useVolunteerData()
</script>

<template>
  <ProgramApplicationLinks
    :online-applications="onlineApplications"
    :download-applications="volunteerApplication"
  />
</template>
