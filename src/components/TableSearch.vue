<script setup lang="ts">
const { table } = $(useTable())
// const { search } = $(useSearch())

const q = $ref(table?.query ?? '')

// let's debounce the search for 500ms
// watchDebounced(
//   q,
//   () => {
//     if (table === undefined)
//       return
//     table.query = q
//     search()
//   },
//   { debounce: 500 },
// )
</script>

<template>
  <input v-model="q" type="text" class="">
</template>
