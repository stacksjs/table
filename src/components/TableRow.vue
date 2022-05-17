<script setup lang="ts">
// eslint-disable-next-line no-console
console.log('TableRow.vue')

const { table } = $(await useTable())

const columnsExceptLast = $computed(() => table.columns.slice(0, -1))
const lastColumn = $computed(() => table.columns ? [table.columns[table.columns.length - 1]] : [])
</script>

<template>
  <tr scope="row">
    <td
      v-for="(col, x) in columnsExceptLast"
      :key="x"
      class="font-medium text-sm py-4 pr-3 pl-4 text-gray-900 whitespace-nowrap sm:pl-6"
    >
      {{ hit[col.includes(':') ? col.split(':')[0].trim() : col] }}
    </td>

    <td
      class="font-medium text-right text-sm py-4 pr-4 pl-3 relative whitespace-nowrap sm:pr-6"
    >
      {{ hit[lastColumn.includes(':') ? lastColumn.split(':')[0].trim() : lastColumn] }}
    </td>
  </tr>
</template>
