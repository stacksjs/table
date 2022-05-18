<script setup lang="ts">
const { hit } = defineProps<{ hit: any }>()
// eslint-disable-next-line no-console
console.log('TableRow.vue', hit)

const { table, actionable, actions } = $(await useTable())

const columnsExceptLast = $computed(() => {
  if (table.actionable || table.actions?.length)
    return table.columns

  return table.columns.slice(0, -1)
})
const lastColumn = $computed(() => {
  if (table.actionable || table.actions?.length)
    return table.actions

  return []
})
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
      v-if="actionable || actions.length"
      class="font-medium text-right text-sm py-4 pr-4 pl-3 relative whitespace-nowrap sm:pr-6"
    >
      <TableRowActionItems :action-items="lastColumn" />
    </td>
  </tr>
</template>
