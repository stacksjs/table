<script setup lang="ts">
const { table, search } = $(await useTable())

const q = $ref(table?.query ?? '')

// let's debounce the search for 500ms
watchDebounced(
  q,
  () => {
    // eslint-disable-next-line no-console
    console.log('here?')

    if (table === undefined)
      return

    table.query = q
    search()
  },
  { debounce: 500 },
)
</script>

<template>
  <input v-model="q" type="text" class="">
</template>
