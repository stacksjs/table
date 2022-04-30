<script setup lang="ts">
import { TableConfigure, TableV2 } from '../../src'
</script>

<template>
  <table-configure
    host="http://127.0.0.1:7700/"
    index="hoodratz"
  />

  <table-v2
    title="Collections"
    sub-title="Check out these beautiful pieces of art."
    cols="id, name, slug"
    sortable="id, name"
    filterable="traits_Head, traits_Body, traits_Background"
    actionable="Edit, Delete"
    per-page="50"
  />

  <!-- default state -->
  <!-- <table-v2
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
