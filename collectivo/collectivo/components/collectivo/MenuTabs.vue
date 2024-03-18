<script setup lang="ts">
const { t } = useI18n();

const props = defineProps({
  items: {
    type: Object as PropType<CollectivoMenuItem[]>,
    required: true,
  },
});

const sortedItems = Object.values(props.items).sort(
  (a, b) => (a.order ?? 100) - (b.order ?? 100),
);
</script>

<template>
  <div class="menu-tabs">
    <div v-for="item in sortedItems" :key="item.label">
      <NuxtLink :to="item.to" class="">
        <span class="">{{ t(item.label) }}</span>
      </NuxtLink>
    </div>
  </div>
</template>

<style scoped lang="scss">
.menu-tabs {
  .router-link-exact-active {
    @apply text-primary-900 border-b-2 border-primary-900;
  }

  @apply flex flex-wrap gap-4 font-medium text-lg mx-3 my-2;
}
</style>
