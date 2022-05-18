<script setup lang="ts">
import { isObject } from '@vueuse/core'

const { hit } = defineProps<{ hit: any }>()
// eslint-disable-next-line no-console
console.log('TableRow.vue')

const { table } = $(await useTable())

// let's generate the value of the row
function generateValue(hit: any, col: any) {
  // eslint-disable-next-line no-console
  console.log('generating value', col, typeof col)
  if (col.includes(':'))
    return hit[col.split(':')[0].trim()]

  // eslint-disable-next-line no-console
  console.log('typeof hit[col]', typeof hit[col])
  return hit[col]
}
</script>

<template>
  <tr scope="row">
    <td
      v-for="(col, x) in table.columns"
      :key="x"
      class="font-medium text-sm py-4 text-gray-900 whitespace-nowrap "
      :class="table.columns.length === x - 1 ? 'table-last-column pr-4 text-right sm:pr-6' : 'pr-3 pl-4 sm:pl-6'"
    >
      <!-- last columns oftentimes are styled slightly different -->
      <span v-if="(table.columns.length === x + 1) && (table.actionable || table.actions)">
        <TableRowActionItems action-items="Edit" />
      </span>

      <span v-else>
        {{ generateValue(hit, col) }}
      </span>
    </td>
  </tr>
</template>
