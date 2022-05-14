<script setup lang="ts">
const { lastColumn, table, columnsExcludingLast, columns } = $(useTable())

const hits = $ref(table?.results?.hits)

watch(hits, (newHits) => {
  // eslint-disable-next-line no-console
  console.log(`newHits is ${newHits}`)
})

// eslint-disable-next-line no-console
console.log('hits is', hits)
// eslint-disable-next-line no-console
console.log('columns is', columns)
// eslint-disable-next-line no-console
console.log('columnsExcludingLast is', columnsExcludingLast)
</script>

<template>
  <tbody class="divide-y bg-white divide-gray-200">
    <tr
      v-for="(hit, i) in hits"
      :key="i"
      scope="row"
    >
      <td
        v-for="(col, x) in columnsExcludingLast"
        :key="x"
        class="font-medium text-sm py-4 pr-3 pl-4 text-gray-900 whitespace-nowrap sm:pl-6"
      >
        {{ hit[col.includes(':') ? col.split(':')[0].trim() : col] }}
      </td>

      <td
        class="font-medium text-right text-sm py-4 pr-4 pl-3 relative whitespace-nowrap sm:pr-6"
      >
        {{ hit[(lastColumn as string).includes(':') ? lastColumn.split(':')[0].trim() : lastColumn] }}
      </td>
    </tr>
  </tbody>
</template>
