<script setup lang="ts">
import type { Hit } from 'meilisearch'

const { hit } = defineProps<{ hit: Hit }>()

const { table, colName, selectedRows } = await useTable()

// let's generate the value of the row
function generateValue(hit: any, col: any) {
  if (col.includes(':'))
    return hit[col.split(':')[0].trim()]

  return JSON.parse(hit[col])
}
</script>

<template>
  <tr scope="row" :class="[selectedRows.includes(hit.id) && 'bg-gray-50']">
    <td class="px-6 w-12 relative sm:px-8 sm:w-16">
      <div v-if="selectedRows.includes(hit.id)" class="bg-indigo-600 inset-y-0 left-0 w-0.5 absolute" />
      <input
        v-model="selectedRows"
        :value="hit.id"
        type="checkbox"
        class="rounded border-gray-300 h-4 -mt-2 top-1/2 left-4 text-indigo-600 w-4 absolute sm:left-6 focus:ring-indigo-500"
      >
    </td>

    <td
      v-for="(col, x) in table.columns"
      :key="x"
      class="font-medium text-sm py-4 text-gray-900 whitespace-nowrap "
      :class="table.columns.length === x - 1 ? 'table-last-column pr-4 text-right sm:pr-6' : 'pr-3 pl-4 sm:pl-6'"
    >
      <!-- last columns oftentimes are styled slightly different -->
      <span v-if="(table.columns.length === x + 1) && (table.actionable || table.actions)">
        <TableCellActionItems action-items="Edit" />
      </span>

      <span v-else>
        <slot :name="colName(col)" :col-data="generateValue(hit, col)">
          {{ generateValue(hit, col) }}
        </slot>
      </span>
    </td>
  </tr>
</template>
