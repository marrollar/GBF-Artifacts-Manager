<script setup lang="tsx">
import type { FilterHandlers } from "@/App.vue";
import type { FilterButtonData } from "@/app/types";
import { computed, ref } from "vue";
import ClearFilterButton from "./ClearFilterButton.vue";
import FilterGroupButton from "./FilterGroupButton.vue";

const props = defineProps<{
  readonly btnNames: FilterButtonData[];
  readonly groupName: string;
  readonly currentFilters: Set<string>;
  selectedSkillsUpdater:
    | FilterHandlers["sk1Search"]
    | FilterHandlers["sk2Search"]
    | FilterHandlers["sk3Search"];
}>();

const groupSearch = ref("");

const filteredButtons = computed(() => {
  if (!groupSearch) return props.btnNames;

  const normalizedSearch = groupSearch.value.toLowerCase().trim();
  const filteredButtons = props.btnNames.filter((btn) => {
    const nameMatch = btn.name.toLowerCase().trim().includes(normalizedSearch);
    const aliasMatch = btn.aliases?.some((alias) =>
      alias.toLowerCase().trim().includes(normalizedSearch),
    );
    return nameMatch || aliasMatch;
  });

  return filteredButtons;
});
</script>

<template>
  <div
    class="flex flex-col w-full bg-base-200 rounded-md border border-gray-700 p-2 gap-2 min-h-[220px] max-h-[250px] overflow-auto"
  >
    <div class="flex gap-2">
      <label class="input self-center w-full">
        <input v-model="groupSearch" type="search" :placeholder="groupName" />
      </label>
      <div class="flex items-center">
        <ClearFilterButton @click="$emit('clearFilter')" />
      </div>
    </div>
    <div class="flex flex-wrap gap-1">
      <div v-for="btnData in filteredButtons">
        <FilterGroupButton
          :current-filters="currentFilters"
          :btn-name="btnData.name"
          @update-filter="selectedSkillsUpdater(btnData.name)"
        />
      </div>
    </div>
  </div>
</template>
