<script setup lang="ts">
import { useTable } from '~/composables/table'

// eslint-disable-next-line no-console
console.log('TableHead.vue')

const { table, isColumnSortable, isColumnUsedAsSort, toggleSort, indeterminate, hits } = await useTable()

const lastColumn = computed(() => {
  if (table.actionable || table.actions?.length)
    return [''] // actions-columns have no table-head

  return table.columns[table.columns.length - 1]
})

const readableLastColumn = computed(() => lastColumn[0]?.includes(':') ? lastColumn[0].split(':')[1].trim() : lastColumn[0])
</script>

<template>
  <thead class="bg-gray-50">
    <tr>
      <th scope="col" class="px-6 w-12 relative sm:px-8 sm:w-16">
        <input
          type="checkbox"
          class="rounded border-gray-300 h-4 -mt-2 top-1/2 left-4 text-indigo-600 w-4 absolute sm:left-6 focus:ring-indigo-500"
          :checked="indeterminate || table.selectedRows?.length === hits.length"
          :indeterminate="indeterminate"
          @change="table.selectedRows = $event?.target?.checked ? hits.map((h) => h.id) : []"
        >
        <!-- <input
          type="checkbox"
          class="rounded border-gray-300 h-4 -mt-2 top-1/2 left-4 text-indigo-600 w-4 absolute sm:left-6 focus:ring-indigo-500"
          :checked="indeterminate || selectedRows?.length === hits?.length"
          :indeterminate="indeterminate"
          @change="selectedRows = []"
        > -->
      </th>

      <th
        v-for="(col, index) in table.columns"
        :key="index"
        scope="col"
        class="font-semibold text-left text-sm py-3.5 text-gray-900"
        :class="index === 0 ? `pr-3 pl-4 sm:pl-6` : `px-3`"
        @click="toggleSort(col)"
      >
        <!-- the last column is oftentimes styled slightly different -->
        <a v-if="(index === table.columns.length - 1)" href="#" class="group inline-flex">
          {{ readableLastColumn }}
          <span
            v-if="isColumnSortable(lastColumn[0])"
            :class="isColumnUsedAsSort(lastColumn) ? `bg-gray-200 text-gray-900 group-hover:bg-gray-300` : `text-gray-400 invisible group-hover:visible group-focus:visible`"
            @click="toggleSort(lastColumn[0])"
          >
            <div v-if="table.sort?.includes('desc')" class="h-5 w-5 i-heroicons-solid-chevron-down" />
            <div v-if="table.sort?.includes('asc')" class="h-5 w-5 i-heroicons-solid-chevron-up" />
          </span>
        </a>

        <a v-else href="#" class="group inline-flex">
          {{ col.includes(':') ? col.split(':')[1].trim() : col }}
          <span
            v-if="isColumnSortable(col)"
            class="rounded flex-none ml-2"
            :class="isColumnUsedAsSort(col) ? `bg-gray-200 text-gray-900 group-hover:bg-gray-300` : `text-gray-400 invisible group-hover:visible group-focus:visible`"
            @click="toggleSort(col)"
          >
            <div v-if="table.sort?.includes('desc')" class="h-5 w-5 i-heroicons-solid-chevron-down" />
            <div v-if="table.sort?.includes('asc')" class="h-5 w-5 i-heroicons-solid-chevron-up" />
          </span>
        </a>
      </th>
    </tr>
  </thead>
</template>
