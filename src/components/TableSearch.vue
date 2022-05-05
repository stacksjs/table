<script setup lang="ts">
// import { tableStore } from '~/composables/table'
</script>

<template>
  <div>
    <label for="search" class="font-medium text-sm text-gray-700 block">Quick search</label>
    <div class="flex mt-1 relative items-center">
      <input id="search" type="text" name="search" class="rounded-md border-gray-300 shadow-sm w-full pr-12 block sm:text-sm focus:border-indigo-500 focus:ring-indigo-500">
      <div class="flex py-1.5 pr-1.5 inset-y-0 right-0 absolute">
        <kbd class="border rounded font-sans font-medium border-gray-200 text-sm px-2 text-gray-400 inline-flex items-center"> ⌘K </kbd>
      </div>
    </div>
  </div>
</template>
