<script setup lang="ts">
import { TablePagination, TableSearch, TableV2 } from './main'
</script>

<template>
  <div class="font-sans">
    <div class="sm:flex sm:items-center">
      <div class="sm:flex-auto">
        <h1 class="font-semibold text-xl text-gray-900">
          Collections
        </h1>
        <p class="mt-2 text-sm text-gray-700">
          Check out these beautiful pieces of art.
        </p>
      </div>
      <div class="mt-4 sm:flex-none sm:mt-0 sm:ml-16">
        <button
          type="button"
          class="border border-transparent rounded-md font-medium bg-indigo-600 shadow-sm text-sm text-white py-2 px-4 inline-flex items-center justify-center sm:w-auto hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
        >
          Add user
        </button>
      </div>
    </div>

    <TableSearch />

    <TableV2
      source="http://127.0.0.1:7700"
      type="hoodratz"
      columns="id: ID, name: Name, collection_name: Collection, image: Image URL, absolute_rarity: Rarity, created_at: Created At"
      sorts="name, absolute_rarity, created_at"
      filters="trait_Accessories: Accessories, trait_Background: Background, trait_Breed: Breed, trait_Ears: Ears, trait_Eyes: Eyes, trait_Head: Head, trait_Mouth: Mouth"
      actions="Edit, Delete"
      per-page="25"
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
