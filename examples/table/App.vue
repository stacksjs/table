<script setup lang="ts">
import { TableConfigure, TableV2 } from '../../src'
</script>

<template>
  <table-configure host="http://127.0.0.1:7700/" index="collections" />

  <table-v2
    searchable="true"
    title="Collections"
    sorts="name, price, created_at"
    filters="traits_Head, traits_Body, traits_Background"
    columns="name, id, slug"
    sortable="name, id"
    actionable="true"
    per-page="50"
    use-pagination="true"
  />
</template>
