<script setup lang="tsx">
import { ref, onMounted, onBeforeUnmount } from "vue";

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
    <button @click="toggleMenu" class="btn btn-square btn-ghost bg-base-100 w-[30px] h-[30px] hover:bg-neutral-500">
      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 16 16">
        <path
          d="M1.5 1.5A.5.5 0 0 1 2 1h12a.5.5 0 0 1 .5.5v2a.5.5 0 0 1-.128.334L10 8.692V13.5a.5.5 0 0 1-.342.474l-3 1A.5.5 0 0 1 6 14.5V8.692L1.628 3.834A.5.5 0 0 1 1.5 3.5zm1 .5v1.308l4.372 4.858A.5.5 0 0 1 7 8.5v5.306l2-.666V8.5a.5.5 0 0 1 .128-.334L13.5 3.308V2z"
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
