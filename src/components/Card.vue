<template>
  <div class="bg-gray-900 rounded-lg">
    <dl class="mx-2">
      <Disclosure as="div" class="px-3 py-3" v-slot="{ open }">
        <dt>
          <DisclosureButton class="flex w-full items-start justify-between text-left text-white">
            <span class="text-base font-semibold leading-7">{{ name }}</span>
            <span class="ml-6 flex h-7 items-center">
              <ChevronDownIcon v-if="!open" class="h-6 w-6" aria-hidden="true" />
              <ChevronUpIcon v-else class="h-6 w-6" aria-hidden="true" />
            </span>
          </DisclosureButton>
        </dt>
        <DisclosurePanel as="dd" class="mt-2 pr-12">
          <div class="flex items-center justify-between w-full mb-2">
            <p v-if="lng" class="text-base leading-7 text-gray-300 w-1/2">
              lng : {{ lng.toFixed(7) }}
            </p>
            <p v-if="lat" class="text-base leading-7 text-gray-300 my-1.5">
              lat : {{ lat.toFixed(7) }}
            </p>
          </div>
          <div class="flex items-center justify-between w-full">
            <p class="text-base leading-7 text-gray-300 w-1/2">alt : {{ alt }} meters</p>
            <Input @updateAltWaypoint="updateAltWaypoint" />
          </div>
          <div class="flex justify-center mt-8">
            <button
              type="button"
              @click="deleteWaypoint"
              class="flex items-center gap-x-2 rounded-md bg-red-500 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-red-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-800"
            >
              <ExclamationTriangleIcon class="-ml-0.5 h-5 w-5" aria-hidden="true" />
              Delete waypoint
            </button>
          </div>
        </DisclosurePanel>
      </Disclosure>
    </dl>
  </div>
</template>

<script setup lang="ts">
import { defineProps, defineEmits } from 'vue'
import { Disclosure, DisclosureButton, DisclosurePanel } from '@headlessui/vue'
import { ChevronDownIcon, ChevronUpIcon, ExclamationTriangleIcon } from '@heroicons/vue/24/outline'
import Input from './Input.vue'

const props = defineProps<{
  name?: string
  lat?: number
  lng?: number
  alt?: number
}>()

const emit = defineEmits<{
  (e: 'deleteWaypoint'): void
  (e: 'updateAltWaypoint', altPoint: number): void
}>()

const deleteWaypoint = () => {
  emit('deleteWaypoint')
}

const updateAltWaypoint = (altPoint: number) => {
  emit('updateAltWaypoint', altPoint)
}
</script>
