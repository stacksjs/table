<script setup lang="ts">
import { useTable } from '~/composables/table'

// eslint-disable-next-line no-console
console.log('TableHead.vue')

// eslint-disable-next-line no-console
const { isColumnSortable, lastColumn, columnsExcludingLast, readableLastColumn, isColumnUsedAsSort, toggleSort } = await useTable()

// eslint-disable-next-line no-console
console.log('columnsExcludingLast', columnsExcludingLast)
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
        <a href="#" class="text-red-400 group inline-flex">
          {{ col.includes(':') ? col.split(':')[1].trim() : col }}
          <span
            v-if="isColumnSortable(col)"
            class="rounded flex-none ml-2 "
            :class="isColumnUsedAsSort(col) ? `bg-gray-200 text-gray-900 group-hover:bg-gray-300` : `text-gray-400 invisible group-hover:visible group-focus:visible`"
            @click="toggleSort(col)"
          >
            <span
              class="rounded flex-none ml-2 "
            >
              <div class="h-5 w-5 i-heroicons-solid-chevron-down" />
            </span>
          </span>

          <!-- <span v-else>he</span> -->
        </a>
      </th>

      <th scope="col" class="font-semibold text-sm text-right py-3.5 pr-4 pl-3 text-gray-900 sm:pr-6">
        <a href="#" class="group inline-flex">
          {{ readableLastColumn }}
          <span
            v-if="isColumnSortable(lastColumn[0])"
            class="rounded flex-none ml-2"
            :class="isColumnUsedAsSort(lastColumn) ? `bg-gray-200 text-gray-900 group-hover:bg-gray-300` : `text-gray-400 invisible group-hover:visible group-focus:visible`"
            @click="toggleSort(lastColumn[0])"
          >
            <span
              class="rounded flex-none ml-2 text-gray-400 invisible group-hover:visible group-focus:visible"
            >
              <div class="h-5 w-5 i-heroicons-solid-chevron-down" />
            </span>
          </span>
        </a>
      </th>
    </tr>
  </thead>
</template>
