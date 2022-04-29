<script setup lang="ts">
import { TableV2 } from '../../src'
</script>

<template>
  <table-v2
    searchable="true"
    sorts="name, price, created_at"
    filters="traits_Head, traits_Body, traits_Background"
    actionable="true"
    per-page="20"
    use-pagination="true"
  />
</template>
