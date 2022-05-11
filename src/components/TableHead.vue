<script setup lang="ts">
import { useTable } from '~/composables/table'

interface Props {
  columns: string[]
  columnsExcludingLast: string[]
  sorts: string
}

const { columns, columnsExcludingLast } = defineProps<Props>()

const { isColumnSortable } = useTable()

// eslint-disable-next-line no-console
console.log('columns', columns.slice(0, -1))
// eslint-disable-next-line no-console
console.log('columnsExcludingLast', columnsExcludingLast)

const sortOrders = $ref([])
// let tableHeads = $ref([''])

// eslint-disable-next-line no-console
// console.log('columns here', columns)

// watch(columns, (cols) => {
//   // eslint-disable-next-line no-console
//   console.log('test', cols)
//   // const cols = unref(columns)
//   tableHeads = ['test', 'test2']
//   // eslint-disable-next-line no-console
//   console.log('tableHeads', tableHeads)
// })

const lastColumn = columns[columns.length - 1]

function isColumnUsedAsSort(col: string) {
  return sortOrders[col]
}

function toggleSort(col: string) {
  sortOrders[col] = !sortOrders[col]
}
</script>

<template>
  <thead class="bg-gray-50">
    <tr>
      <th
        v-for="(col, index) in columnsExcludingLast"
        :key="index"
        scope="col"
        :class="index === 0 ? `font-semibold text-left text-sm py-3.5 pr-3 pl-4 text-gray-900 sm:pl-6` : `font-semibold text-left text-sm py-3.5 px-3 text-gray-900`"
      >
        <a href="#" class="group inline-flex">
          {{ col.includes(':') ? col.split(':')[1].trim() : col }}
          <span
            v-if="isColumnSortable(sorts as string)"
            class="rounded flex-none ml-2 "
            :class="isColumnUsedAsSort(col.includes(':') ? col.split(':')[0].trim() : col) ? `bg-gray-200 text-gray-900 group-hover:bg-gray-300` : `text-gray-400 invisible group-hover:visible group-focus:visible`"
            @click="toggleSort(col.includes(':') ? col.split(':')[0].trim() : col)"
          >
            <span
              class="rounded flex-none ml-2 "
            >
              <div class="h-5 w-5 i-heroicons-solid-chevron-down" />
            </span>
          </span></a>
      </th>

      <th scope="col" class="font-semibold text-sm text-right py-3.5 pr-4 pl-3 text-gray-900 sm:pr-6">
        <a href="#" class="group inline-flex">
          {{ lastColumn.includes(':') ? lastColumn.split(':')[1].trim() : lastColumn }}
          <span
            v-if="isColumnSortable(lastColumn[0]?.includes(':') ? lastColumn[0].split(':')[0].trim() : lastColumn[0])"
            class="rounded flex-none ml-2"
            :class="isColumnUsedAsSort(lastColumn[0]?.includes(':') ? lastColumn[0].split(':')[0].trim() : lastColumn[0]) ? `bg-gray-200 text-gray-900 group-hover:bg-gray-300` : `text-gray-400 invisible group-hover:visible group-focus:visible`"
            @click="toggleSort(lastColumn[0]?.includes(':') ? lastColumn[0].split(':')[0].trim() : lastColumn[0])"
          >
            <span
              class="rounded flex-none ml-2 text-gray-400 invisible group-hover:visible group-focus:visible"
            >
              <div class="h-5 w-5 i-heroicons-solid-chevron-down" />
            </span>
          </span></a>
      </th>
    </tr>
  </thead>
</template>
