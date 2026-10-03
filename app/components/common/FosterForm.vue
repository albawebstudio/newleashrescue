<script setup lang="ts">
import ProgramApplicationForm from '~/components/common/ProgramApplicationForm.vue'
import { fosterDisclaimer } from '#shared/foster-form'
</script>

<template>
  <ProgramApplicationForm
    kind="foster"
    eyebrow="Foster home application"
    success-title="Application received"
    :success-message="`Thank you for applying to foster with New Leash Rescue. We will review your application and contact you at the email address you provided.`"
    success-link-to="/foster"
    success-link-label="Return to foster information"
    submit-endpoint="/api/foster"
    submit-error-fallback="We could not send your application. Please try again or email Newleashrescue2018@gmail.com."
    :disclaimer="fosterDisclaimer"
  />
</template>
