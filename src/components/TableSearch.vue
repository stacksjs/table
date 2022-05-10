<script setup lang="ts">
const { store } = $(useTable())
const { search } = $(useSearch())

const q = ref(store?.query)

// let's debounce the search for 500ms
watchDebounced(
  q,
  () => {
    store.query = q.value
    search()
  },
  { debounce: 500 },
)
</script>

<template>
  <input v-model="q" type="text" class="">
</template>
