<script setup lang="ts">
import { isString } from '@vueuse/core'
// eslint-disable-next-line no-console
console.log('TableBody.vue')

const { table } = $(await useTable())

function colName(col: any) {
  return col.split(':')[0].trim()
}
</script>

<template>
  <tbody class="divide-y bg-white divide-gray-200">
    <TableRow v-for="(hit, index) in table.results?.hits" :key="index" :hit="hit">
      <template v-for="(col, x) in table.columns" :key="x" #[colName(col)]="tableRowData">
        <slot :name="colName(col)" :table-row-data="tableRowData.colData" />
      </template>
    </TableRow>
  </tbody>
</template>
