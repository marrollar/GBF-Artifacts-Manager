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

function filterLogic(artifact: ArtifactMap[number], filterOpts: ActiveFilters) {
  // const search = filterOpts.search; // TODO: Implement global search
  const sk1Filter = filterOpts.sk1Search;
  const sk2Filter = filterOpts.sk2Search;
  const sk3Filter = filterOpts.sk3Search;
  const eleFilter = filterOpts.element;
  const wepFilter = filterOpts.weapon;
  const filterFavorite = filterOpts.filterFavorite;
  const filterQuirk = filterOpts.filterQuirk;
  const filterScrap = filterOpts.filterScrap;

  if (
    (sk1Filter.size === 0 || sk1Filter.has(artifact.s1.name) || sk1Filter.has(artifact.s2.name)) &&
    (sk2Filter.size === 0 || sk2Filter.has(artifact.s3.name)) &&
    (sk3Filter.size === 0 || sk3Filter.has(artifact.s4.name)) &&
    (eleFilter.size === 0 || eleFilter.has(artifact.element)) &&
    (wepFilter.size === 0 || wepFilter.has(artifact.weapon)) &&
    (filterFavorite ? artifact.is_locked : true) &&
    (filterQuirk ? artifact.is_quirk : true) &&
    (filterScrap ? artifact.is_scrap : true)
  ) {
    return true;
  }

  return false;
}

function filterAndSort(artifacts: ArtifactMap, filterOpts: ActiveFilters) {
  var filteredArtifacts = Object.entries(artifacts).filter(([_, arti]) => filterLogic(arti, filterOpts));

  for (var i = 0; i < filteredArtifacts.length; i++) {
    const s1 = filteredArtifacts[i][1].s1;
    const s2 = filteredArtifacts[i][1].s2;

    if (filterOpts.sk1Search.size > 0) {
      const [first] = filterOpts.sk1Search;

      // NOTE: This is probably always true just because we should've filtered out all entries that aren't in the filter options already.
      if (s2.name === first) {
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
        <ArtifactSkillColumn :name="artifact[1].s1.name" :value="artifact[1].s1.value" />
        <ArtifactSkillColumn :name="artifact[1].s2.name" :value="artifact[1].s2.value" />
        <ArtifactSkillColumn :name="artifact[1].s3.name" :value="artifact[1].s3.value" />
        <ArtifactSkillColumn :name="artifact[1].s4.name" :value="artifact[1].s4.value" />
      </div>
    </div>
  </div>
</template>
