<script setup lang="tsx">
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import {
  type ActiveFilters,
  type FilterInputs,
} from "./filtering/filterConfig";
import {
  type Weapon,
  type Element,
  elements,
  weapons,
  SK1_NAMES,
} from "./types";
import { reactive, ref } from "vue";
import type { SplitterPanel } from "reka-ui";
import { getImage, updateSet } from "./utils";
import ClearFilterButton from "./components/ClearFilterButton.vue";
import FilterGroup from "./components/FilterGroup.vue";

const sidePanelRef = ref<InstanceType<typeof SplitterPanel>>();
const filters = reactive<ActiveFilters>({
  search: "",
  sk1Search: new Set<string>(),
  sk2Search: new Set<string>(),
  sk3Search: new Set<string>(),
  element: new Set<Element>(),
  weapon: new Set<Weapon>(),
});

export type FilterHandlers = {
  [K in keyof FilterInputs]: (value: FilterInputs[K]) => void;
};

const filterHandlers: FilterHandlers = {
  search: (value) => {
    filters.search = value;
  },
  sk1Search: (value) => {
    if (filters.sk1Search.has(value)) {
      filters.sk1Search = updateSet(filters.sk1Search, (s) => s.delete(value));
    } else {
      filters.sk1Search = updateSet(filters.sk1Search, (s) => s.add(value));
    }
  },
  sk2Search: (value) => {
    if (filters.sk2Search.has(value)) {
      filters.sk2Search = updateSet(filters.sk2Search, (s) => s.delete(value));
    } else {
      filters.sk2Search = updateSet(filters.sk2Search, (s) => s.add(value));
    }
  },
  sk3Search: (value) => {
    if (filters.sk3Search.has(value)) {
      filters.sk3Search = updateSet(filters.sk3Search, (s) => s.delete(value));
    } else {
      filters.sk3Search = updateSet(filters.sk3Search, (s) => s.add(value));
    }
  },
  element: (value) => {
    if (filters.element.has(value)) {
      filters.element = updateSet(filters.element, (s) => s.delete(value));
    } else {
      filters.element = updateSet(filters.element, (s) => s.add(value));
    }
  },
  weapon: (value) => {
    if (filters.weapon.has(value)) {
      filters.weapon = updateSet(filters.weapon, (s) => s.delete(value));
    } else {
      filters.weapon = updateSet(filters.weapon, (s) => s.add(value));
    }
  },
};

function filterUpdaterFactory<K extends keyof ActiveFilters>(key: K) {
  return (value: FilterInputs[K]) => {
    filterHandlers[key](value);
  };
}

function clearFilter<K extends keyof ActiveFilters | "all">(key: K) {
  switch (key) {
    case "all":
      filters.search = "";
      filters.sk1Search = new Set<string>();
      filters.sk2Search = new Set<string>();
      filters.sk3Search = new Set<string>();
      filters.element = new Set<Element>();
      filters.weapon = new Set<Weapon>();
      break;
    case "search":
      filters.search = "";
      break;
    case "sk1Search":
      filters.sk1Search = new Set<string>();
      break;
    case "sk2Search":
      filters.sk2Search = new Set<string>();
      break;
    case "sk3Search":
      filters.sk3Search = new Set<string>();
      break;
    case "element":
      filters.element = new Set<Element>();
      break;
    case "weapon":
      filters.weapon = new Set<Weapon>();
      break;
  }
}

const __SIDEBAR = {
  collapsedSize: 4,
  minSize: 20,
  defaultSize: 35,
};
</script>

<template>
  <div id="app" class="h-screen">
    <ResizablePanelGroup direction="horizontal" class="bg-base-300 p-2">
      <ResizablePanel
        ref="sidePanelRef"
        collapsible
        :collapsed-size="__SIDEBAR.collapsedSize"
        :min-size="__SIDEBAR.minSize"
        :default-size="__SIDEBAR.defaultSize"
      >
        <!-- Show sidebar button -->
        <button
          class="btn btn-square btn-ghost bg-base-100 w-[30px] h-[30px] hover:bg-neutral-500"
          v-if="sidePanelRef?.isCollapsed"
          @click="
            sidePanelRef?.isCollapsed
              ? sidePanelRef?.expand()
              : sidePanelRef?.collapse()
          "
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            class="inline-block h-6 w-6 stroke-current"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="1"
              d="M4 6 h16 M4 12 h16 M4 18 h16"
            ></path>
          </svg>
        </button>

        <div class="flex flex-col items-center gap-2 pr-6">
          <div
            class="flex flex-col items-center gap-2"
            v-if="!sidePanelRef?.isCollapsed"
          >
            <!-- Clear Filters button -->
            <div class="flex items-center justify-center">
              <button
                class="btn bg-base-100 hover:bg-red-400 h-7"
                @click="clearFilter('all')"
              >
                Clear Filters
              </button>
            </div>

            <!-- Search bar -->
            <label class="input">
              <input
                v-model="filters.search"
                type="search"
                placeholder="Search"
              />
            </label>

            <!-- Elements filter -->
            <div class="flex gap-2">
              <div class="flex items-center gap-2 h-[50px] overflow-auto">
                <button
                  v-for="element in elements"
                  :key="element"
                  class="flex-none p-0.5 hover:bg-neutral-500 hover:cursor-pointer rounded-md"
                  :class="{ 'bg-accent': filters['element'].has(element) }"
                >
                  <img
                    class="w-[30px] h-[30px]"
                    :src="getImage(`Icon_Element_${element}.png`)"
                    @click="filterUpdaterFactory('element')(element)"
                  />
                </button>

                <div class="flex items-center">
                  <ClearFilterButton
                    @clear-filter="clearFilter('element')"
                  />
                </div>
              </div>
            </div>

            <!-- Weapons filter -->
            <div class="flex gap-2">
              <div class="flex overflow-auto">
                <div
                  class="flex-none grid grid-flow-row grid-rows-2 grid-cols-5 overflow-auto pb-2"
                >
                  <button
                    v-for="weapon in weapons"
                    :key="weapon"
                    class="p-0.5 hover:bg-neutral-500 hover:cursor-pointer rounded-md"
                    :class="{ 'bg-accent': filters['weapon'].has(weapon) }"
                  >
                    <img
                      class="h-[20px]"
                      :src="getImage(`Label_Weapon_${weapon}.png`)"
                      @click="filterUpdaterFactory('weapon')(weapon)"
                    />
                  </button>
                </div>
              </div>
              <div class="flex items-center pb-2">
                <ClearFilterButton
                  @clear-filter="clearFilter('weapon')"
                />
              </div>
            </div>

            <!-- Skill Group 1 Filters -->
            <FilterGroup
              :btn-names="SK1_NAMES"
              group-name="Skill Group 1 Search"
              :current-filters="filters['sk1Search']"
              :selected-skills-updater="filterUpdaterFactory('sk1Search')"
              @clear-filter="clearFilter('sk1Search')"
            />
          </div>
        </div>
      </ResizablePanel>
      <ResizableHandle />
      <ResizablePanel> </ResizablePanel>
    </ResizablePanelGroup>
  </div>
</template>
