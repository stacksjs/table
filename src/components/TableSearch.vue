<script setup lang="ts">
const { query } = $(await useTable())
</script>

<template>
  <input v-model="query" type="text" class="">
</template>
