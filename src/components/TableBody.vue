<script setup lang="ts">
const { lastColumn, table, columns } = $(useTable())

const hits = $ref(table?.results?.hits)

watch(hits, (newHits) => {
  // eslint-disable-next-line no-console
  console.log(`newHits is ${newHits}`)
})
</script>

<template>
  <tbody class="divide-y bg-white divide-gray-200">
    <tr
      scope="row"
    >
      <td
        v-for="(hit, i) in hits"
        :key="i"
        class="font-medium text-sm py-4 pr-3 pl-4 text-gray-900 whitespace-nowrap sm:pl-6"
      >
        {{ i }}
        {{ hit[columns[0].includes(':') ? columns[0].split(':')[0].trim() : columns[0]] }}
      </td>

      <td
        v-for="(col, x) in lastColumn"
        :key="x"
        class="text-sm py-4 px-3 text-gray-500 whitespace-nowrap"
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
