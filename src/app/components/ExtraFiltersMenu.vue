<script setup lang="tsx">
import { onBeforeUnmount, onMounted, ref } from "vue";

const isOpen = ref(false);

const props = defineProps<{
  filterFavorite: boolean;
  filterQuirk: boolean;
  filterScrap: boolean;
}>();

const emits = defineEmits<{
  toggleFavorite: [value: boolean];
  toggleQuirk: [value: boolean];
  toggleScrap: [value: boolean];
}>();

const options = [
  { label: "Favorite", key: "favorite", ref: props.filterFavorite },
  { label: "Quirk", key: "quirk", ref: props.filterQuirk },
  { label: "Scrap", key: "scrap", ref: props.filterScrap },
];

const onChange = (event: Event) => {
  const target = event.target as HTMLInputElement;
  switch (target.value) {
    case "favorite":
      emits("toggleFavorite", target.checked);
      break;
    case "quirk":
      emits("toggleQuirk", target.checked);
      break;
    case "scrap":
      emits("toggleScrap", target.checked);
      break;
  }
};

const wrapper = ref<HTMLElement | null>(null);

const toggleMenu = async () => {
  isOpen.value = !isOpen.value;
};

const handleClickOutside = (event: MouseEvent) => {
  if (wrapper.value && !wrapper.value.contains(event.target as Node)) {
    isOpen.value = false;
  }
};

onMounted(() => {
  document.addEventListener("click", handleClickOutside);
});

onBeforeUnmount(() => {
  document.removeEventListener("click", handleClickOutside);
});
</script>

<template>
  <!-- TODO: DaisyUI's dropdown css class does not play very nice with...anything here. Its Just Working. Fix at some point maybe. -->
  <div ref="wrapper">
    <button @click="toggleMenu" class="btn btn-square btn-ghost bg-base-100 w-[32px] h-[32px] hover:bg-neutral-500">
      <!-- https://icon-sets.iconify.design/solar/ -->
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
        <path
          fill="none"
          stroke="currentColor"
          stroke-width="1.5"
          d="M19 3H5c-1.414 0-2.121 0-2.56.412S2 4.488 2 5.815v.69c0 1.037 0 1.556.26 1.986s.733.698 1.682 1.232l2.913 1.64c.636.358.955.537 1.183.735c.474.411.766.895.898 1.49c.064.284.064.618.064 1.285v2.67c0 .909 0 1.364.252 1.718c.252.355.7.53 1.594.88c1.879.734 2.818 1.101 3.486.683S15 19.452 15 17.542v-2.67c0-.666 0-1 .064-1.285a2.68 2.68 0 0 1 .899-1.49c.227-.197.546-.376 1.182-.735l2.913-1.64c.948-.533 1.423-.8 1.682-1.23c.26-.43.26-.95.26-1.988v-.69c0-1.326 0-1.99-.44-2.402C21.122 3 20.415 3 19 3Z"
        />
      </svg>
    </button>
    <!-- Dropdown Menu -->
    <div
      v-show="isOpen"
      class="dropdown absolute min-w-[140px] bg-base-100 border-gray-600 p-2 mt-1 rounded-md border z-1001 flex flex-col gap-1"
    >
      <div v-for="option in options" :key="option.key" class="flex center gap-1">
        <!-- TODO: This needs to get synced up with the reset all filters button to reset the toggle. -->
        <input type="checkbox" class="toggle" :value="option.key" @change="onChange" />
        {{ option.label }}
      </div>
    </div>
  </div>
</template>
