<script setup lang="ts">
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from '@/components/ui/resizable'
import { type ActiveFilters, type FilterInputs } from './filtering/filterConfig';
import type { Weapon, Element } from './types';
import { ref } from 'vue';
import type { SplitterPanel } from 'reka-ui';

const sidePanelRef = ref<InstanceType<typeof SplitterPanel>>()

const __default_filter: ActiveFilters = {
  search: "",
  sk1Search: new Set<string>,
  sk2Search: new Set<string>,
  sk3Search: new Set<string>,
  element: new Set<Element>,
  weapon: new Set<Weapon>
}

export type FilterHandlers = {
  [K in keyof FilterInputs]: (value: FilterInputs[K]) => void;
}

const __SIDEBAR = {
  collapsedSize: 4,
  minSize: 10,
  defaultSize: 20
}

</script>

<template>
  <div id="app" class="h-screen">
    <ResizablePanelGroup direction="horizontal" class="bg-base-300 p-2">
      <ResizablePanel ref="sidePanelRef" collapsible :collapsed-size=__SIDEBAR.collapsedSize :min-size=__SIDEBAR.minSize
        :default-size=__SIDEBAR.defaultSize>

        <button class="btn btn-square btn-ghost bg-base-100 w-[30px] h-[30px] hover:bg-neutral-500"
          :class="{ hidden: !sidePanelRef?.isCollapsed }"
          @click="sidePanelRef?.isCollapsed ? sidePanelRef?.expand() : sidePanelRef?.collapse()">

          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
            class="inline-block h-6 w-6 stroke-current">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M4 6 h16 M4 12 h16 M4 18 h16"></path>
          </svg>
        </button>

      </ResizablePanel>
      <ResizableHandle />
      <ResizablePanel>

      </ResizablePanel>
    </ResizablePanelGroup>
  </div>
</template>
