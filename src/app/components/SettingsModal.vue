<script setup lang="tsx">
import { type ExtensionSettings } from "@/extension/src/globals";
import { ClearAllArtifacts, GetExtensionSettings, SetExtensionSettings } from "@/extension/src/StorageProxy";
import { onMounted, onUnmounted, reactive, ref, watch } from "vue";

const local_ext_settings = reactive<ExtensionSettings>({
  do_styles: false,
});
const inConfirm = ref(false);
const timerSeconds = ref(0);
let interval: any = null;

function confirmClearData() {
  if (inConfirm.value) {
    ClearAllArtifacts().then(() => {
      timerSeconds.value = 0;
      inConfirm.value = false;
      clearInterval(interval);
      emits("clearedData")
    });
  } else {
    timerSeconds.value = 6;
    inConfirm.value = true;

    interval = setInterval(() => {
      if (timerSeconds.value > 0) {
        timerSeconds.value--;
      } else {
        inConfirm.value = false;
        clearInterval(interval);
      }
    }, 1000);
  }
}

onMounted(() => {
  GetExtensionSettings().then((fromStorage) => {
    const settings = fromStorage.data;
    Object.assign(local_ext_settings, settings);
  });
});

onUnmounted(() => {
  timerSeconds.value = 0;
  inConfirm.value = false;
  clearInterval(interval);
});

watch(local_ext_settings, () => {
  SetExtensionSettings({ data: local_ext_settings });
});

const emits = defineEmits(["clearedData"])

</script>
<template>
  <label
    for="extension_settings_modal"
    class="btn btn-square btn-ghost bg-base-100 w-[28px] h-[28px] hover:bg-neutral-500"
  >
    <!-- https://icon-sets.iconify.design/solar/ -->
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
      <g fill="none" stroke="currentColor" stroke-width="1.5">
        <circle cx="12" cy="12" r="3" />
        <path
          d="M13.765 2.152C13.398 2 12.932 2 12 2s-1.398 0-1.765.152a2 2 0 0 0-1.083 1.083c-.092.223-.129.484-.143.863a1.62 1.62 0 0 1-.79 1.353a1.62 1.62 0 0 1-1.567.008c-.336-.178-.579-.276-.82-.308a2 2 0 0 0-1.478.396C4.04 5.79 3.806 6.193 3.34 7s-.7 1.21-.751 1.605a2 2 0 0 0 .396 1.479c.148.192.355.353.676.555c.473.297.777.803.777 1.361s-.304 1.064-.777 1.36c-.321.203-.529.364-.676.556a2 2 0 0 0-.396 1.479c.052.394.285.798.75 1.605c.467.807.7 1.21 1.015 1.453a2 2 0 0 0 1.479.396c.24-.032.483-.13.819-.308a1.62 1.62 0 0 1 1.567.008c.483.28.77.795.79 1.353c.014.38.05.64.143.863a2 2 0 0 0 1.083 1.083C10.602 22 11.068 22 12 22s1.398 0 1.765-.152a2 2 0 0 0 1.083-1.083c.092-.223.129-.483.143-.863c.02-.558.307-1.074.79-1.353a1.62 1.62 0 0 1 1.567-.008c.336.178.579.276.819.308a2 2 0 0 0 1.479-.396c.315-.242.548-.646 1.014-1.453s.7-1.21.751-1.605a2 2 0 0 0-.396-1.479c-.148-.192-.355-.353-.676-.555A1.62 1.62 0 0 1 19.562 12c0-.558.304-1.064.777-1.36c.321-.203.529-.364.676-.556a2 2 0 0 0 .396-1.479c-.052-.394-.285-.798-.75-1.605c-.467-.807-.7-1.21-1.015-1.453a2 2 0 0 0-1.479-.396c-.24.032-.483.13-.82.308a1.62 1.62 0 0 1-1.566-.008a1.62 1.62 0 0 1-.79-1.353c-.014-.38-.05-.64-.143-.863a2 2 0 0 0-1.083-1.083Z"
        />
      </g>
    </svg>
  </label>
  <input type="checkbox" id="extension_settings_modal" class="modal-toggle" />
  <div class="modal" role="dialog">
    <div class="modal-box overflow-visible">
      <h3 class="text-lg font-bold">Misc Extension Settings</h3>

      <div class="flex flex-col gap-2 pt-4">
        <div class="flex gap-2">
          <input type="checkbox" class="toggle" v-model="local_ext_settings!['do_styles']" />
          <div class="content-center">Affect Game Styles</div>
          <div class="tooltip">
            <div class="tooltip-content">
              Setting artifacts to be trashed in this web application is reflected in the game by either a red outline
              or green outline. If you want to disable this functionality, make sure this is toggled OFF.
              <br />
              <br />
              The game's webpage can theoretically detect changes in element styling. Enable at your own discretion.
            </div>
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
              <g fill="none">
                <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="1.5" />
                <path stroke="currentColor" stroke-linecap="round" stroke-width="1.5" d="M12 17v-6" />
                <circle cx="1" cy="1" r="1" fill="currentColor" transform="matrix(1 0 0 -1 11 9)" />
              </g>
            </svg>
          </div>
        </div>
        <div class="grid grid-flow-col grid-rows-1 grid-cols-3 justify-center pt-10">
          <button class="col-start-2 col-end-3 btn btn-error btn-outline" 
          :class="{'btn-disabled':timerSeconds > 5}"
          @click="confirmClearData">
            Reset ALL Data
          </button>
          <div class="col-start-3 tooltip w-[24px] h-[24px] self-center pl-2">
            <div class="tooltip-content">
              Clears all extension data EXCEPT settings. Does not affect anything in game.
            </div>
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
              <g fill="none">
                <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="1.5" />
                <path stroke="currentColor" stroke-linecap="round" stroke-width="1.5" d="M12 17v-6" />
                <circle cx="1" cy="1" r="1" fill="currentColor" transform="matrix(1 0 0 -1 11 9)" />
              </g>
            </svg>
          </div>
        </div>
        <div v-if="timerSeconds > 0" class="text-center text-error">
          Confirm clear all artifact data? {{ timerSeconds }}
        </div>
      </div>
    </div>
    <label class="modal-backdrop" for="extension_settings_modal">Close</label>
  </div>
</template>
