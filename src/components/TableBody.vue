<script setup lang="ts">
const { store } = $(useTable())
const hits = $ref(store?.results?.hits)
const columns = $ref(store?.columns)

onBeforeMount(() => {
  //
})
</script>

<template>
  <tbody class="divide-y bg-white divide-gray-200">
    <tr
      v-for="(hit, i) in hits"
      :key="i"
      scope="row"
    >
      <td
        class="font-medium text-sm py-4 pr-3 pl-4 text-gray-900 whitespace-nowrap sm:pl-6"
      >
        {{ hit[columns[0].includes(':') ? columns[0].split(':')[0].trim() : columns[0]] }}
      </td>

      <td
        v-for="(col, x) in columns.slice(1, -1)"
        :key="x"
        class="text-sm py-4 px-3 text-gray-500 whitespace-nowrap"
      >
        {{ hit[col.includes(':') ? col.split(':')[0].trim() : col] }}
      </td>

      <td
        class="font-medium text-right text-sm py-4 pr-4 pl-3 relative whitespace-nowrap sm:pr-6"
      >
        {{ hit[columns[columns.length - 1].includes(':') ? columns[columns.length - 1].split(':')[0].trim() : columns[columns.length - 1]] }}
      </td>
    </tr>
  </tbody>
</template>
