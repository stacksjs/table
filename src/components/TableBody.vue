<script setup lang="ts">
// eslint-disable-next-line no-console
console.log('TableBody.vue')

const { table } = $(await useTable())
</script>

<template>
  <tbody class="divide-y bg-white divide-gray-200">
    <TableRow v-for="(hit, index) in table.results?.hits" :key="index" :hit="hit" />
  </tbody>
</template>
