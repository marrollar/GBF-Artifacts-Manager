<script setup lang="tsx">
// const props = defineProps<{
//     filterName: string
// }>();

// const emits = defineEmits<{
//     clearFilter: [filterName: string]
// }>();
</script>

<template>
    <button class="bg-base-100 hover:bg-red-400 p-1 rounded-md hover:cursor-pointer" @click="$emit('clearFilter')">
        <svg xmlns=" http://www.w3.org/2000/svg" class="h-6 w-6 text-red-500" fill="none" viewBox="0 0 24 24"
        stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5-4h4m-4 0a1 1 0 00-1 1v1h6V4a1 1 0 00-1-1m-4 0h4" />
        </svg>
    </button>
</template>