<script setup lang="ts">
import { tableStore } from '~/composables/table'
const emit = defineEmits(['prevPage', 'nextPage'])
// const { results, currentPage } = defineProps<{
//   results?: object
//   currentPage?: number
// }>()

const currentPage = $ref(1)
</script>

<template>
  <div class="bg-white border-t flex border-gray-200 py-3 items-center justify-end">
    <div class="flex flex-1 justify-between sm:hidden">
      <a
        href="#"
        class="bg-white border rounded-md font-medium border-gray-300 text-sm py-2 px-4 text-gray-700 relative inline-flex items-center hover:bg-gray-50"
      >
        Previous </a>
      <a
        href="#"
        class="bg-white border rounded-md font-medium border-gray-300 text-sm ml-3 py-2 px-4 text-gray-700 relative inline-flex items-center hover:bg-gray-50"
      >
        Next </a>
    </div>
    <div class="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
      <div>
        <p class="text-sm text-gray-700">
          Showing {{ ((tableStore.results.limit * currentPage) - tableStore.results.limit) + 1 }}
          <span class="font-medium" />
          to
          <span class="font-medium"> {{ tableStore.results.limit * currentPage }} </span>
          of
          <span class="font-medium"> {{ tableStore.results.nbHits }} </span>
          results
        </p>
      </div>
      <div>
        <nav class="-space-x-px rounded-md shadow-sm z-0 relative inline-flex" aria-label="Pagination">
          <a
            href="#"
            class="bg-white border rounded-l-md font-medium border-gray-300 text-sm py-2 px-2 text-gray-500 relative inline-flex items-center hover:bg-gray-50"
            @click.prevent="emit('prevPage')"
          >
            <span class="sr-only">Previous</span>
            <div class="h-5 w-5 i-heroicons-solid-chevron-left" />
          </a>
          <!-- Current: "z-10 bg-indigo-50 border-indigo-500 text-indigo-600", Default: "bg-white border-gray-300 text-gray-500 hover:bg-gray-50" -->

          <a
            href="#"
            class="bg-white border rounded-r-md font-medium border-gray-300 text-sm py-2 px-2 text-gray-500 relative inline-flex items-center hover:bg-gray-50"
            @click.prevent="emit('nextPage')"
          >
            <span class="sr-only">Next</span>
            <div class="h-5 w-5 i-heroicons-solid-chevron-right" />
          </a>
        </nav>
      </div>
    </div>
  </div>
</template>
