<template>
  <button
    @click="handleClick"
    :type="type"
    class="inline-flex items-center gap-x-2 rounded-md bg-white px-3.5 py-2.5 text-sm font-semibold shadow-sm hover:bg-gray-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-900"
  >
    <component :is="icon" class="-mr-0.5 h-5 w-5" aria-hidden="true" v-if="icon" />
    {{ label }}
  </button>
</template>

<script lang="ts" setup>
import { defineProps, defineEmits } from 'vue'

interface Props {
  label: string
  icon?: string | Object
  type?: 'button' | 'submit' | 'reset'
}
const props = defineProps<Props>()

const emit = defineEmits<{
  (e: 'click'): void
}>()
function handleClick() {
  emit('click')
}
</script>
