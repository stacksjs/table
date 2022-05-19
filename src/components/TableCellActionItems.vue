<script setup lang="ts">
const { actionItems } = defineProps<{ actionItems: string }>()
</script>

<template>
  {{ actionItems }}
</template>
