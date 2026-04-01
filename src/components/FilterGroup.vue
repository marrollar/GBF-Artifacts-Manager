<script setup lang="ts">
import type { FilterHandlers } from "@/App.vue";
import type { FilterButtonData } from "@/types";
import { ref } from "vue";
import ClearFilterButton from "./ClearFilterButton.vue";

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
        <ClearFilterButton
          @click="$emit('clearFilter')"
        />
      </div>
    </div>
  </div>
</template>
