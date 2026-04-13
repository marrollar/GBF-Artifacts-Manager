<script setup lang="tsx">
import { ref, watch } from "vue";

const props = defineProps<{
  name: string;
  value: string;
  class?: string;
}>();

type Position = {
  top: string;
  left: string;
};

const nameDiv = ref<HTMLDivElement | null>(null);
const tooltipDiv = ref<HTMLDivElement | null>(null);
const isHovered = ref<boolean>(false);
const pos = ref<Position>({ top: "0px", left: "0px" });

watch(
  isHovered,
  () => {
    if (nameDiv.value && tooltipDiv.value) {
      const rect = nameDiv.value.getBoundingClientRect();
      const tooltipRect = tooltipDiv.value.getBoundingClientRect();

      let top = rect.top - tooltipRect.height - 8;
      let left = rect.left;

      // Clamp horizontally
      if (left + tooltipRect.width > window.innerWidth) {
        left = window.innerWidth - tooltipRect.width - 8;
      }
      if (left < 8) {
        left = 8;
      }

      // Clamp vertically (flip if needed)
      if (top < 8) {
        top = rect.bottom + 28;
      }

      pos.value = { top: `${top}px`, left: `${left}px` };
    }
  },
  { flush: "post" },
);
</script>
<template>
  <div class="flex flex-col flex-1 h-full rounded-md hover:outline-[1px] hover:outline-gray-500" :class="class">
    <div class="flex h-1/2">
      <div
        ref="nameDiv"
        class="flex overflow-clip px-[6px] hover:cursor-default"
        @mouseenter="isHovered = true"
        @mouseleave="isHovered = false"
      >
        {{ props.name }}
      </div>
    </div>
    <div class="flex h-1/2 text-yellow-300 overflow-clip items-center px-[6px] hover:cursor-default">
      {{ props.value }}
    </div>
    <div
      ref="tooltipDiv"
      v-if="isHovered"
      :style="{
        top: pos.top,
        left: pos.left,
      }"
      class="fixed z-50 pointer-events-none bg-[#213452] px-[6px] py-[6px] rounded-md max-w-[250px] whitespace-normal wrap-break-word border border-gray-500"
    >
      <div>{{ name }}</div>
      <div class="text-yellow-300">{{ value }}</div>
    </div>
  </div>
</template>
