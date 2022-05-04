<script setup lang="ts">
import { TableV2 } from '~/main'
</script>

<template>
  <TableV2
    source="http://127.0.0.1:7700/"
    type="hoodratz"
    title="Collections"
    sub-title="Check out these beautiful pieces of art."
    columns="order, name, slug, collection_name, image_url, created_at, published_at"
    sorts="order, name, published_at"
    filters="trait_Accessories, trait_Background, trait_Breed, trait_Ears, trait_Eyes, trait_Head, trait_Mouth"
    actions="Edit, Delete"
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
