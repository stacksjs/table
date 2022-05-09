<script setup lang="ts">
const { store } = $(useTable())
const { search } = $(useSearch())

const q = ref(store.value?.query)

// let's debounce the search for 500ms
watchDebounced(
  q,
  () => {
    store.value.query = q.value
    search()
  },
  { debounce: 500 },
)
</script>

<template>
  <input v-model="q" type="text" class="">
</template>
