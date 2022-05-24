<script setup lang="ts">
// eslint-disable-next-line no-console
console.log('TableBody.vue')

const { table, columnName } = await useTable()
</script>

<template>
  <tbody class="divide-y bg-white divide-gray-200">
    <TableRow v-for="(hit, index) in table.results?.hits" :key="index" :hit="hit">
      <template v-for="(col, x) in table.columns" :key="x" #[columnName(col)]="tableRowData">
        <slot :name="columnName(col)" :table-row-data="tableRowData.colData" />
      </template>
    </TableRow>
  </tbody>
</template>
