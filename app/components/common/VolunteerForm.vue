<script setup lang="ts">
import ProgramApplicationForm from '~/components/common/ProgramApplicationForm.vue'
import { volunteerDisclaimer } from '#shared/volunteer-form'
</script>

<template>
  <ProgramApplicationForm
    kind="volunteer"
    eyebrow="Volunteer application"
    success-title="Application received"
    :success-message="`Thank you for offering your time to New Leash Rescue. We will review your volunteer application and follow up using the contact information you provided.`"
    success-link-to="/volunteer"
    success-link-label="Return to volunteer information"
    submit-endpoint="/api/volunteer"
    submit-error-fallback="We could not send your application. Please try again or email Newleashrescue2018@gmail.com."
    :disclaimer="volunteerDisclaimer"
  />
</template>
