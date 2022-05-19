<script setup lang="ts">
// eslint-disable-next-line no-console
console.log('TableBody.vue')

const { table, colName } = $(await useTable())
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
