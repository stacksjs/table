<script setup lang="ts">
import { TableV2 } from '~/main'
</script>

<template>
  <TableV2
    source="http://127.0.0.1:7700"
    type="hoodratz"
    title="Collections"
    sub-title="Check out these beautiful pieces of art."
    columns="id: ID, name: Name, slug: URL, collection_name: Name, image: URL, absolute_rarity: Rarity, created_at: Created At"
    sorts="name, absolute_rarity, created_at"
    filters="trait_Accessories: Accessories, trait_Background: Background, trait_Breed: Breed, trait_Ears: Ears, trait_Eyes: Eyes, trait_Head: Head, trait_Mouth: Mouth"
    actions="Edit, Delete"
    per-page="50"
  />

  <TablePagination />

  <!-- <TablePagination
    @previous-page="prevPage"
    @next-page="nextPage"
  /> -->
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
