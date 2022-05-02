<script setup lang="ts">
const { results, currentPage } = defineProps<{
  results?: object
  currentPage?: number
}>()

const emit = defineEmits(['prevPage', 'nextPage'])
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
          Showing {{ ((results.limit * currentPage) - results.limit) + 1 }}
          <span class="font-medium" />
          to
          <span class="font-medium"> {{ results.limit * currentPage }} </span>
          of
          <span class="font-medium"> {{ results.nbHits }} </span>
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
            <!-- Heroicon name: solid/chevron-left -->
            <svg
              class="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor"
              aria-hidden="true"
            >
              <path
                fill-rule="evenodd"
                d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
                clip-rule="evenodd"
              />
            </svg>
          </a>
          <!-- Current: "z-10 bg-indigo-50 border-indigo-500 text-indigo-600", Default: "bg-white border-gray-300 text-gray-500 hover:bg-gray-50" -->

          <a
            href="#"
            class="bg-white border rounded-r-md font-medium border-gray-300 text-sm py-2 px-2 text-gray-500 relative inline-flex items-center hover:bg-gray-50"
            @click.prevent="emit('nextPage')"
          >
            <span class="sr-only">Next</span>
            <!-- Heroicon name: solid/chevron-right -->
            <svg
              class="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor"
              aria-hidden="true"
            >
              <path
                fill-rule="evenodd"
                d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                clip-rule="evenodd"
              />
            </svg>
          </a>
        </nav>
      </div>
    </div>
  </div>
</template>
