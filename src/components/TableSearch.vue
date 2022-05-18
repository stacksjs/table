<script setup lang="ts">
const { table } = $$(await useTable())
</script>

<template>
  <input v-model="table.query" type="text" class="">
</template>
