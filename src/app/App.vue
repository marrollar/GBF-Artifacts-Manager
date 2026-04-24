<script setup lang="tsx">
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@/app/components/ui/resizable";
import { EXT_SETTINGS_KEY } from "@/extension/src/globals";
import { GetAllArtifacts, SaveArtifact } from "@/extension/src/StorageProxy";
import type { SplitterPanel } from "reka-ui";
import { onMounted, reactive, ref } from "vue";
import ArtifactsList from "./components/ArtifactsList.vue";
import ClearFilterButton from "./components/ClearFilterButton.vue";
import ExtraFiltersMenu from "./components/ExtraFiltersMenu.vue";
import FilterGroup from "./components/FilterGroup.vue";
import SettingsModal from "./components/SettingsModal.vue";
import { type ActiveFilters, type FilterInputs } from "./filtering/filterConfig";
import {
  elements,
  SK1_NAMES,
  SK2_NAMES,
  SK3_NAMES,
  weapons,
  type ArtifactMap,
  type Element,
  type Weapon,
} from "./types";
import { getImage, updateSet } from "./utils";

const __SIDEBAR = {
  collapsedSize: 4,
  minSize: 20,
  defaultSize: 35,
};

const sidePanelRef = ref<InstanceType<typeof SplitterPanel>>();
const filters = reactive<ActiveFilters>({
  search: "",
  sk1Search: new Map<string, boolean>(),
  sk2Search: new Map<string, boolean>(),
  sk3Search: new Map<string, boolean>(),
  element: new Set<Element>(),
  weapon: new Set<Weapon>(),
  filterFavorite: false,
  filterQuirk: false,
  filterScrap: false,
});
const artifacts = ref<ArtifactMap>({});
const filteredCount = ref<number>(0);

export type FilterHandlers = {
  [K in keyof FilterInputs]: (value: FilterInputs[K]) => void;
};

const filterHandlers: FilterHandlers = {
  search: (value) => {
    filters.search = value;
  },
  sk1Search: (value) => {
    const k = value[0];
    const v = value[1];

    if (filters.sk1Search.has(k)) {
      filters.sk1Search.delete(k);
    } else {
      filters.sk1Search.set(k, v);
    }
  },
  sk2Search: (value) => {
    const k = value[0];
    const v = value[1];

    if (filters.sk2Search.has(k)) {
      filters.sk2Search.delete(k);
    } else {
      filters.sk2Search.set(k, v);
    }
  },
  sk3Search: (value) => {
    const k = value[0];
    const v = value[1];

    if (filters.sk3Search.has(k)) {
      filters.sk3Search.delete(k);
    } else {
      filters.sk3Search.set(k, v);
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
  filterFavorite: (value) => {
    filters.filterFavorite = value;
  },
  filterQuirk: (value) => {
    filters.filterQuirk = value;
  },
  filterScrap: (value) => {
    filters.filterScrap = value;
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
      filters.sk1Search = new Map<string, boolean>();
      filters.sk2Search = new Map<string, boolean>();
      filters.sk3Search = new Map<string, boolean>();
      filters.element = new Set<Element>();
      filters.weapon = new Set<Weapon>();
      filters.filterFavorite = false;
      filters.filterQuirk = false;
      filters.filterScrap = false;
      break;
    case "search":
      filters.search = "";
      break;
    case "sk1Search":
      filters.sk1Search = new Map<string, boolean>();
      break;
    case "sk2Search":
      filters.sk2Search = new Map<string, boolean>();
      break;
    case "sk3Search":
      filters.sk3Search = new Map<string, boolean>();
      break;
    case "element":
      filters.element = new Set<Element>();
      break;
    case "weapon":
      filters.weapon = new Set<Weapon>();
      break;
  }
}

function toggleAsScrap(id: string, checked: boolean) {
  artifacts.value[Number(id)].is_scrap = checked;
  const arti: ArtifactMap = { [id]: artifacts.value[Number(id)] };
  // console.log(artifacts.value[Number(id)])
  SaveArtifact({ data: arti });
}

async function fetchFromLocalStorage() {
  try {
    const data = (await GetAllArtifacts()).data;
    Object.entries(data).forEach(([id, value]) => {
      if (id !== EXT_SETTINGS_KEY) {
        artifacts.value[Number(id)] = value;
      }
    });
  } catch (err) {
    console.error("Failed to get data.");
  }
}

function handleDataCleared() {
  artifacts.value = {};
}

onMounted(() => {
  fetchFromLocalStorage().then();

  chrome.storage.onChanged.addListener((_, area) => {
    // TODO: This ends up being called 20 times per page because of how the extension end updates local storage. Find a way to debounce.
    if (area === "local") {
      fetchFromLocalStorage().then();
    }
  });
});
</script>

<template>
  <div id="app" class="h-screen">
    <ResizablePanelGroup direction="horizontal">
      <ResizablePanel
        ref="sidePanelRef"
        collapsible
        :collapsed-size="__SIDEBAR.collapsedSize"
        :min-size="__SIDEBAR.minSize"
        :default-size="__SIDEBAR.defaultSize"
        class="bg-base-300 p-2"
      >
        <div class="w-full h-full overflow-auto">
          <!-- Show sidebar button -->
          <button
            class="btn btn-square btn-ghost bg-base-100 w-[30px] h-[30px] hover:bg-neutral-500"
            v-if="sidePanelRef?.isCollapsed"
            @click="sidePanelRef?.isCollapsed ? sidePanelRef?.expand() : sidePanelRef?.collapse()"
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
            <div class="flex flex-col items-center gap-2" v-if="!sidePanelRef?.isCollapsed">
              <div class="flex items-center justify-center gap-2">
                <!-- Clear Filters button -->
                <button class="btn bg-base-100 hover:bg-red-400 h-7" @click="clearFilter('all')">
                  Clear All Filters
                </button>

                <!-- Refresh data button -->
                <button @click="fetchFromLocalStorage()" class="btn bg-base-100 hover:bg-green-400 h-7">Refresh</button>
              </div>

              <div class="flex gap-2 items-center">
                <!-- Search bar -->
                <label class="input">
                  <input v-model="filters.search" type="search" placeholder="Search" />
                </label>
                <!-- Extra filters button -->
                <ExtraFiltersMenu
                  :filter-favorite="filters.filterFavorite"
                  :filter-quirk="filters.filterQuirk"
                  :filter-scrap="filters.filterScrap"
                  @toggle-favorite="(e) => filterUpdaterFactory('filterFavorite')(e)"
                  @toggle-quirk="(e) => filterUpdaterFactory('filterQuirk')(e)"
                  @toggle-scrap="(e) => filterUpdaterFactory('filterScrap')(e)"
                />
              </div>

              <!-- Elements filter -->
              <div class="flex gap-2">
                <div class="flex items-center gap-2 h-[50px] overflow-auto">
                  <button
                    v-for="element in elements"
                    :key="element"
                    class="flex-none p-0.5 hover:bg-neutral-500 hover:cursor-pointer rounded-md transition-colors duration-200 ease-out"
                    :class="{ 'bg-accent': filters['element'].has(element) }"
                  >
                    <img
                      class="w-[30px] h-[30px]"
                      :src="getImage(`Icon_Element_${element}.png`)"
                      @click="filterUpdaterFactory('element')(element)"
                    />
                  </button>

                  <div class="flex items-center">
                    <ClearFilterButton @clear-filter="clearFilter('element')" />
                  </div>
                </div>
              </div>

              <!-- Weapons filter -->
              <div class="flex gap-2">
                <div class="flex overflow-auto">
                  <div class="flex-none grid grid-flow-row grid-rows-2 grid-cols-5 overflow-auto pb-2">
                    <button
                      v-for="weapon in weapons"
                      :key="weapon"
                      class="p-0.5 hover:bg-neutral-500 hover:cursor-pointer rounded-md transition-colors duration-200 ease-out"
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
                  <ClearFilterButton @clear-filter="clearFilter('weapon')" />
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

              <!-- Skill Group 2 Filters -->
              <FilterGroup
                :btn-names="SK2_NAMES"
                group-name="Skill Group 2 Search"
                :current-filters="filters['sk2Search']"
                :selected-skills-updater="filterUpdaterFactory('sk2Search')"
                @clear-filter="clearFilter('sk2Search')"
              />

              <!-- Skill Group 3 Filters -->
              <FilterGroup
                :btn-names="SK3_NAMES"
                group-name="Skill Group 3 Search"
                :current-filters="filters['sk3Search']"
                :selected-skills-updater="filterUpdaterFactory('sk3Search')"
                @clear-filter="clearFilter('sk3Search')"
              />
            </div>
          </div>
        </div>
      </ResizablePanel>
      <ResizableHandle />
      <ResizablePanel class="bg-base-300">
        <div class="flex flex-col w-full h-full overflow-auto">
          <div class="flex flex-none w-full bg-base-100 h-[44px] p-2">
            <div class="flex flex-none items-center text-[0.875rem] font-bold">
              Filtered: {{ filteredCount }} / {{ Object.keys(artifacts).length }}
            </div>
            <div class="w-full"></div>
            <SettingsModal @cleared-data="handleDataCleared" />
          </div>
          <ArtifactsList
            :artifacts="artifacts"
            :filter-opts="filters"
            @id-to-scrap="(e) => toggleAsScrap(e.id, e.checked)"
            @filtered-amount="filteredCount = $event"
          />
        </div>
      </ResizablePanel>
    </ResizablePanelGroup>
  </div>
</template>
