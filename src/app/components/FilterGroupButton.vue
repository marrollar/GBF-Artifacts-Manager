<script setup lang="tsx">
const props = defineProps<{
  readonly currentFilters: Map<string, boolean>;
  readonly btnName: string;
}>();

const emits = defineEmits<{
  updateFilter: [[btnName: string, value: boolean]];
}>();
</script>

<template>
  <button
    class="hover:bg-neutral-500 hover:cursor-pointer pl-2 pr-2 border rounded-md transition-colors duration-200 ease-out"
    :class="{
      'bg-accent text-base-200': currentFilters.has(btnName) && currentFilters.get(btnName),
      'bg-error text-base-200': currentFilters.has(btnName) && !currentFilters.get(btnName),
    }"
    @click="emits('updateFilter', [btnName, true])"
    @contextmenu.prevent="emits('updateFilter', [btnName, false])"
  >
    {{ btnName }}
  </button>
</template>
