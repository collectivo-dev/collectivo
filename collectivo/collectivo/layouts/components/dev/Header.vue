<script setup lang="ts">
const pageTitle = useCollectivoTitle();
const { t } = useI18n();
</script>

<template>
  <div class="flex items-center h-full font-bold px-4">
    {{ t(pageTitle) }}
  </div>
</template>
