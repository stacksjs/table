<script setup lang="ts">
import { TableConfigure, TableV2 } from '../../src'
</script>

<template>
  <TableConfigure
    host="http://127.0.0.1:7700/"
    index="hoodratz"
  />

  <TableV2
    title="Collections"
    sub-title="Check out these beautiful pieces of art."
    cols="order, name, slug, collection_name, description, image_url, created_at, published_at"
    sortable="order, name, published_at"
    filterable=""
    actionable="Edit, Delete"
    per-page="50"
  />

  <!-- default state -->
  <!-- <TableV2
    title="Collections"
    sub-title="Check out these beautiful pieces of art."
    cols="*"
    :searchable="true"
    :filterable="true"
    :sortable="true"
    :actionable="true"
    :per-page="20"
  /> -->
</template>
