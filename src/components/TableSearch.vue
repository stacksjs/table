<script setup lang="ts">
const { table } = await useTable()
</script>

<template>
  <input v-model="table.query" type="text" class="block w-full shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:max-w-xs sm:text-sm border-gray-300 rounded-md" placeholder="type here">
</template>
