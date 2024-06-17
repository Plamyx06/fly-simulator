<template>
  <div class="">
    <div class="flex rounded-md shadow-sm w-full">
      <div class="relative flex flex-grow items-stretch focus-within:z-10">
        <input
          ref="newAltInput"
          v-model.number="newAlt"
          class="block w-full rounded-none rounded-l-md border-0 py-1.5 pl-2 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-gray-500 sm:text-sm sm:leading-6"
          placeholder="New alt in meters"
          type="number"
        />
      </div>
      <button
        type="button"
        @click="confirmNewAlt"
        class="relative -ml-px inline-flex items-center gap-x-1.5 rounded-r-md px-3 py-2 text-sm font-semibold text-white-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 hover:text-gray-900"
      >
        Confirm
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const newAlt = ref<number | null>(null)
const emit = defineEmits<{
  (e: 'updateAltWaypoint', altPoint: number): void
}>()

function confirmNewAlt() {
  if (newAlt.value !== null) {
    emit('updateAltWaypoint', newAlt.value)
    newAlt.value = null
  } else {
    console.log('Invalid altitude')
  }
}
</script>
