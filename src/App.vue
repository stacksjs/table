<script setup lang="ts">
import { Table as TableV2 } from './main'
// import { TablePagination, TableSearch, Table as TableV2 } from './main'
</script>

<template>
  <div class="font-sans">
    <Suspense>
      <TableSearch />
    </Suspense>

    <Suspense>
      <TableV2
        source="http://3.85.80.143:7700"
        password="NtUvZv5Q87e355b807622149c350ac38679645b4e2603a1d3eb48cda080f977e76329aeb"
        type="orders"
        columns="id: Order, customer_name: Customer, customer_po: PO#, part_name: Parts, created_at: Ordered, due_at: Due, stage_name: Status"
        sort="id:desc"
        sorts="created_at, customer_name, customer_po, due_at, id, part_name, stage_name"
        filters="created_at, customer_name, customer_po, document_types, due_at, id, invoice_number, part_name, stage_name, vendor_name"
        actions="Info Icon"
        per-page="10"
      />
      <!-- <TableV2
        source="http://127.0.0.1:7700"
        type="orders"
        columns="id: ID, name: Name, collection_name: Collection, image: Image URL, absolute_rarity: Rarity, created_at: Created At"
        sort="name:desc"
        sorts="name, absolute_rarity, created_at"
        filters="trait_Accessories: Accessories, trait_Background: Background, trait_Breed: Breed, trait_Ears: Ears, trait_Eyes: Eyes, trait_Head: Head, trait_Mouth: Mouth"
        actions="Edit, Delete"
        per-page="10"
      /> -->
    </Suspense>
    <!-- <TablePagination /> -->
  </div>
</template>
