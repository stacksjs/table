<script setup lang="ts">
const q = ref(tableStore.value.query)

// let's debounce the search for 500ms
watchDebounced(
  q,
  () => {
    tableStore.value.query = q.value
    search()
  },
  { debounce: 500 },
)
</script>

<template>
  <input v-model="q" type="text" class="">
</template>
