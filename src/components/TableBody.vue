<script setup lang="ts">
// eslint-disable-next-line no-console
console.log('TableBody.vue')

const { hits } = $(useTable())

// watch(hits, (newHits) => {
//   // eslint-disable-next-line no-console
//   console.log(`newHits is ${newHits}`)
// })
</script>

<template>
  <tbody class="divide-y bg-white divide-gray-200">
    <TableRow v-for="hit in hits" :key="hit.id" :hit="hit" />
  </tbody>
</template>
