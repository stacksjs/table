<script setup lang="ts">
import { TablePagination, TableSearch, TableV2 } from './main'
</script>

<template>
  <div class="font-sans">
    <TableSearch />

    <TableV2
      source="http://127.0.0.1:7700"
      type="hoodratz"
      columns="id: ID, name: Name, collection_name: Collection, image: Image URL, absolute_rarity: Rarity, created_at: Created At"
      sorts="name, absolute_rarity, created_at"
      filters="trait_Accessories: Accessories, trait_Background: Background, trait_Breed: Breed, trait_Ears: Ears, trait_Eyes: Eyes, trait_Head: Head, trait_Mouth: Mouth"
      actions="Edit, Delete"
      per-page="10"
    />

    <TablePagination />
  </div>

  <!-- <TablePagination
    @previous-page="prevPage"
    @next-page="nextPage"
  /> -->

  <!-- default state -->
  <!-- <TableV2
    cols="*"
    :searchable="true"
    :filterable="true"
    :sortable="true"
    :actionable="true"
    :per-page="20"
  /> -->
</template>
