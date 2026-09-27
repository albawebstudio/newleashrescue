<script setup lang="ts">
import { useVolunteerData } from '~/composables/useVolunteerData'
import VolunteerApplication from '~/components/common/VolunteerApplication.vue'

const { featureBlocks, volunteerRolesSection, volunteerContactEmail } = useVolunteerData()

const introBlock = computed(() => featureBlocks.value[0])
const closingBlock = computed(() => featureBlocks.value[1])
</script>

<template>
  <section id="volunteer">
    <div class="container mx-auto px-4">
      <div class="my-8 md:my-12 flex w-full justify-center">
        <VolunteerApplication />
      </div>

      <div v-if="introBlock" class="flex flex-wrap items-center mt-16">
        <div class="w-full md:w-5/12 px-4 mr-auto ml-auto">
          <h3 class="text-2xl mb-2 font-semibold leading-normal font-luckiest-guy text-secondary">
            {{ introBlock.h3 }}
          </h3>
          <p
            v-for="(paragraph, pIndex) in introBlock.content"
            :key="pIndex"
            class="text-lg font-light leading-relaxed mt-4 mb-4 text-blueGray-600"
          >
            {{ paragraph }}
          </p>
        </div>
        <div class="w-full md:w-5/12 px-4 mr-auto ml-auto">
          <div class="relative flex flex-col min-w-0 wrap-break-word bg-white w-full mb-2 shadow-lg rounded-lg">
            <NuxtImg
              :src="introBlock.img.src"
              :alt="introBlock.img.alt"
              class="w-full align-middle rounded-lg"
            />
          </div>
        </div>
      </div>

      <section class="py-24">
        <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div
            class="mb-10 lg:mb-16 flex justify-center items-center flex-col gap-x-0 gap-y-6 lg:gap-y-0 lg:flex-row lg:justify-between max-md:max-w-lg max-md:mx-auto"
          >
            <div class="relative w-full text-center lg:text-left lg:w-2/4">
              <h2
                class="text-4xl font-bold text-gray-900 leading-[3.25rem] lg:mb-6 mx-auto max-w-max lg:max-w-md lg:mx-0 font-luckiest-guy text-secondary"
              >
                {{ volunteerRolesSection.title }}
              </h2>
            </div>
            <div class="relative w-full text-center lg:text-left lg:w-2/4">
              <p class="text-lg font-normal text-gray-500 mb-5">
                {{ volunteerRolesSection.intro }}
              </p>
            </div>
          </div>
          <div class="mx-auto flex max-w-6xl flex-wrap justify-center gap-6">
            <div
              v-for="role in volunteerRolesSection.roles"
              :key="role.title"
              class="group relative w-full max-w-sm min-h-64 shrink-0 basis-full bg-gray-100 dark:bg-gray-800 rounded-2xl p-4 transition-all duration-500 sm:basis-[calc(50%-0.75rem)] lg:basis-[calc(33.333%-1rem)] lg:max-w-[calc(33.333%-1rem)] xl:p-7 hover:bg-primary-600"
            >
              <div
                class="mb-5 flex h-14 w-14 items-center justify-center rounded-full bg-white text-primary transition-colors duration-500 group-hover:text-primary-600"
              >
                <UIcon :name="role.icon" class="size-8 transition-colors duration-500" aria-hidden="true" />
              </div>
              <h4
                class="text-xl font-semibold text-gray-900 dark:text-white mb-3 capitalize transition-all duration-500 group-hover:text-white"
              >
                {{ role.title }}
              </h4>
              <p
                class="text-sm font-normal text-gray-500 dark:text-white transition-all duration-500 leading-5 group-hover:text-white"
              >
                {{ role.description }}
              </p>
            </div>
          </div>
        </div>
      </section>

      <div v-if="closingBlock" class="flex flex-wrap items-center mt-16 flex-row-reverse">
        <div class="w-full md:w-5/12 px-4 mr-auto ml-auto">
          <h3 class="text-2xl mb-2 font-semibold leading-normal font-luckiest-guy text-primary">
            {{ closingBlock.h3 }}
          </h3>
          <p
            v-for="(paragraph, pIndex) in closingBlock.content"
            :key="pIndex"
            class="text-lg font-light leading-relaxed mt-4 mb-4 text-blueGray-600"
          >
            {{ paragraph }}
          </p>
          <p class="text-lg font-light leading-relaxed mt-4 mb-4 text-blueGray-600">
            Fill out a volunteer application using a method above, or reach out to us at
            <a
              :href="`mailto:${volunteerContactEmail}`"
              class="font-medium text-primary underline hover:text-primary-600"
            >
              {{ volunteerContactEmail }}
            </a>
            to get started!
          </p>
        </div>
        <div class="w-full md:w-5/12 px-4 mr-auto ml-auto">
          <div class="relative flex flex-col min-w-0 wrap-break-word bg-white w-full mb-2 shadow-lg rounded-lg">
            <NuxtImg
              :src="closingBlock.img.src"
              :alt="closingBlock.img.alt"
              class="w-full align-middle rounded-lg"
            />
          </div>
        </div>
      </div>

      <div class="my-8 md:my-12 flex w-full justify-center">
        <VolunteerApplication />
      </div>
    </div>
  </section>
</template>

<style scoped>

</style>
