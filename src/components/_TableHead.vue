<script setup lang="ts">
import { isColumnSortable, tableStore } from '~/composables/table'
const columns = tableStore.value.columns
const sortOrders = $ref([])

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
        v-for="(col, index) in columns.slice(0, -1)"
        :key="index"
        scope="col"
        :class="index === 0 ? `font-semibold text-left text-sm py-3.5 pr-3 pl-4 text-gray-900 sm:pl-6` : `font-semibold text-left text-sm py-3.5 px-3 text-gray-900`"
      >
        <a href="#" class="group inline-flex">
          {{ col.includes(':') ? col.split(':')[1].trim() : col }}
          <span
            v-if="isColumnSortable(tableStore.sorts.includes(col))"
            class="rounded flex-none ml-2 "
            :class="isColumnUsedAsSort(col.includes(':') ? col.split(':')[0].trim() : col) ? `bg-gray-200 text-gray-900 group-hover:bg-gray-300` : `text-gray-400 invisible group-hover:visible group-focus:visible`"
            @click="toggleSort(col.includes(':') ? col.split(':')[0].trim() : col)"
          >
            <div class="h-5 w-5 i-heroicons-solid-chevron-down" />
          </span>
        </a>
      </th>

      <!-- <th v-if="actionable || actions.length" scope="col" class="py-3.5 pr-4 pl-3 relative sm:pr-6">
                    <span class="sr-only">Edit</span>
                  </th> -->

      <th scope="col" class="font-semibold text-right text-sm py-3.5 pr-4 pl-3 text-gray-900 sm:pr-6">
        <a href="#" class="group inline-flex">
          {{ columns[columns.length - 1].includes(':') ? columns[columns.length - 1].split(':')[1].trim() : columns[columns.length - 1] }}
          <span
            v-if="isColumnSortable(columns[columns.length - 1].includes(':') ? columns[columns.length - 1].split(':')[0].trim() : columns[columns.length - 1])"
            class="rounded flex-none ml-2"
            :class="isColumnUsedAsSort(columns[columns.length - 1].includes(':') ? columns[columns.length - 1].split(':')[0].trim() : columns[columns.length - 1]) ? `bg-gray-200 text-gray-900 group-hover:bg-gray-300` : `text-gray-400 invisible group-hover:visible group-focus:visible`"
            @click="toggleSort(columns[columns.length - 1].includes(':') ? columns[columns.length - 1].split(':')[0].trim() : columns[columns.length - 1])"
          >
            <div class="h-5 w-5 i-heroicons-solid-chevron-down" />
          </span>
        </a>
      </th>
    </tr>
  </thead>
</template>

<style scoped>

</style>
