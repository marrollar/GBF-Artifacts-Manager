<script setup lang="tsx">
import type { ActiveFilters } from "@/app/filtering/filterConfig";
import { elementSortOrder, weaponSortOrder, type ArtifactMap } from "@/app/types";
import { getImage } from "@/app/utils";
import ArtifactSkillColumn from "./ArtifactSkillColumn.vue";
import { computed } from "vue";

const props = defineProps<{
  artifacts: ArtifactMap;
  filterOpts: ActiveFilters;
}>();

const emits = defineEmits<{
  (e: "idToScrap", payload: { id: string; checked: boolean }): void;
}>();

function regexFilter(artifact: ArtifactMap[number], filterOpts: ActiveFilters) {
  // TODO: Make this more elaborate and/or accept the usual filters that can be selected.
  const search = filterOpts.search;
  const nameText = artifact.s1.name + " " + artifact.s2.name + " " + artifact.s3.name + " " + artifact.s4.name;
  return new RegExp(search).test(nameText);
}

function selectFiltersLogic(artifact: ArtifactMap[number], filterOpts: ActiveFilters) {
  const search = filterOpts.search;
  const sk1Filter = filterOpts.sk1Search;
  const sk2Filter = filterOpts.sk2Search;
  const sk3Filter = filterOpts.sk3Search;
  const eleFilter = filterOpts.element;
  const wepFilter = filterOpts.weapon;
  const filterFavorite = filterOpts.filterFavorite;
  const filterQuirk = filterOpts.filterQuirk;
  const filterScrap = filterOpts.filterScrap;

  function sk1_logic(): boolean {
    const hasS1 = sk1Filter.has(artifact.s1.name);
    const hasS2 = sk1Filter.has(artifact.s2.name);

    const s1bool = sk1Filter.get(artifact.s1.name);
    const s2bool = sk1Filter.get(artifact.s2.name);

    if ((hasS1 && s1bool === false) || (hasS2 && s2bool === false)) {
      return false;
    }

    if (hasS1 && hasS2) {
      if (s1bool === false || s2bool === false) {
        return false;
      }
    }

    if ((hasS1 && s1bool === true) || (hasS2 && s2bool === true)) {
      return true;
    }

    if (!hasS1 && !hasS2) {
      if (sk1Filter.size === 0) {
        return true;
      }

      for (const [_, v] of sk1Filter) {
        if (v === true) {
          return false;
        }
      }
    }

    return true;
  }

  function sk23_logic(filter: Map<string, boolean>, name: string): boolean {
    if (filter.size === 0) {
      return true;
    }

    const hasSkill = filter.has(name);
    if (hasSkill) {
      return filter.get(name)!;
    } else {
      for (const [_, v] of filter) {
        if (v === true) {
          return false;
        }
      }
    }
    return true;
  }

  const everyPass: boolean[] = [
    sk1_logic(),
    sk23_logic(sk2Filter, artifact.s3.name),
    sk23_logic(sk3Filter, artifact.s4.name),
    eleFilter.size === 0 || eleFilter.has(artifact.element),
    wepFilter.size === 0 || wepFilter.has(artifact.weapon),
    filterFavorite ? artifact.is_locked : true,
    filterQuirk ? artifact.is_quirk : true,
    filterScrap ? artifact.is_scrap : true,
    search.trim().length === 0 || regexFilter(artifact, filterOpts),
  ];
  console.log(everyPass, everyPass.every(Boolean));

  return everyPass.every(Boolean);
}

function filterAndSort(artifacts: ArtifactMap, filterOpts: ActiveFilters) {
  var filteredArtifacts = Object.entries(artifacts).filter(([_, arti]) => selectFiltersLogic(arti, filterOpts));

  for (var i = 0; i < filteredArtifacts.length; i++) {
    const s1 = filteredArtifacts[i][1].s1;
    const s2 = filteredArtifacts[i][1].s2;

    if (filterOpts.sk1Search.size > 0) {
      const [first] = filterOpts.sk1Search;

      // NOTE: This is probably always true just because we should've filtered out all entries that aren't in the filter options already.
      if (s2.name === first[0]) {
        filteredArtifacts[i][1].s1 = s2;
        filteredArtifacts[i][1].s2 = s1;
      }
    } else if (s2.id < s1.id) {
      filteredArtifacts[i][1].s1 = s2;
      filteredArtifacts[i][1].s2 = s1;
    }
  }

  const sortedArtifacts = filteredArtifacts.sort((a, b) => {
    // if (a[1].s2.name < a[1].s1.name) {
    //     a[1].s1, a[1].s2 = a[1].s2, a[1].s1
    // }

    // if (b[1].s2.name < b[1].s1.name) {
    //     b[1].s1, b[1].s2 = b[1].s2, b[1].s1
    // }

    const a_elemOrd = elementSortOrder.get(a[1].element);
    const b_elemOrd = elementSortOrder.get(b[1].element);

    if (a_elemOrd !== b_elemOrd) return (a_elemOrd ?? Infinity) - (b_elemOrd ?? Infinity);

    const a_wepOrd = weaponSortOrder.get(a[1].weapon);
    const b_wepOrd = weaponSortOrder.get(b[1].weapon);

    if (a_wepOrd !== b_wepOrd) return (a_wepOrd ?? Infinity) - (b_wepOrd ?? Infinity);

    const a_skillIds = [a[1].s1.id, a[1].s2.id, a[1].s3.id, a[1].s4.id];
    const b_skillIds = [b[1].s1.id, b[1].s2.id, b[1].s3.id, b[1].s4.id];

    for (let i = 0; i < a_skillIds.length; i++) {
      if (a_skillIds[i] < b_skillIds[i]) return -1;
      if (a_skillIds[i] > b_skillIds[i]) return 1;
    }

    const a_skillVals = [a[1].s1.value, a[1].s2.value, a[1].s3.value, a[1].s4.value];
    const b_skillVals = [b[1].s1.value, b[1].s2.value, b[1].s3.value, b[1].s4.value];

    for (let i = 0; i < a_skillIds.length; i++) {
      if (a_skillVals[i] < b_skillVals[i]) return -1;
      if (a_skillVals[i] > b_skillVals[i]) return 1;
    }

    return 0;
  });
  return sortedArtifacts;
}

const sortedArtifacts = computed(() => {
  return filterAndSort(props.artifacts, props.filterOpts);
});
</script>

<template>
  <div class="flex flex-col gap-2 p-2">
    <div v-for="artifact in sortedArtifacts" :key="artifact[0]" class="flex gap-1 h-[40px] items-center">
      <input
        type="checkbox"
        className="checkbox checkbox-error"
        :checked="artifact[1].is_scrap"
        @change="emits('idToScrap', {id:artifact[0], checked:($event.target as HTMLInputElement).checked})"
      />
      <img
        :src="getImage(`Icon_Element_${artifact[1].element}.png`)"
        className="flex-none w-[25px] h-auto object-contain"
      />
      <img
        :src="getImage(`Label_Weapon_${artifact[1].weapon}.png`)"
        className="flex-none w-[50px] h-auto object-contain"
      />
      <div className="flex h-full w-full">
        <ArtifactSkillColumn :name="artifact[1].s1.name" :value="artifact[1].s1.value" class="max-w-[200px]" />
        <ArtifactSkillColumn :name="artifact[1].s2.name" :value="artifact[1].s2.value" class="max-w-[200px]" />
        <ArtifactSkillColumn :name="artifact[1].s3.name" :value="artifact[1].s3.value" />
        <ArtifactSkillColumn :name="artifact[1].s4.name" :value="artifact[1].s4.value" />
      </div>
    </div>
  </div>
</template>
