<script setup lang="tsx">
const props = defineProps<{
  readonly currentFilters: Set<string>;
  readonly btnName: string;
}>();

const emits = defineEmits<{
  updateFilter: [btnName: string];
}>();
</script>

<template>
  <button
    class="hover:bg-neutral-500 hover:cursor-pointer pl-2 pr-2 border rounded-md transition-colors duration-200 ease-out"
    :class="{ 'bg-accent text-base-200': currentFilters.has(btnName) }"
    @click="emits('updateFilter', btnName)"
  >
    {{ btnName }}
  </button>
</template>
