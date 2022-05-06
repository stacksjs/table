<script setup lang="ts">
import { tableStore } from '~/composables/table'
</script>

<template>
  <input v-model="tableStore.query" type="text" class="">
</template>
