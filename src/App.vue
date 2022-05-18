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
    </Suspense>

    <Suspense>
      <TablePagination />
    </Suspense>
  </div>
</template>
