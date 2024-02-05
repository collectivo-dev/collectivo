<script setup lang="ts">
const _ = defineProps({
  title: {
    type: String,
  },
  color: {
    type: String,
  },
});
</script>

<template>
  <div :class="`card bg-${color ?? 'primary'}-50`">
    <div :class="`card-corner bg-${color ?? 'primary'}-100`"></div>
    <p v-if="title" class="card__title">
      {{ title }}
    </p>
    <slot name="content"></slot>
  </div>
</template>

<style lang="scss" scoped>
.card {
  @apply h-fit w-full rounded-[15px] relative overflow-hidden p-6;
  &__title {
    @apply mb-1 font-semibold text-lg leading-[22px];
  }

  .card-corner {
    @apply h-[70px] w-[70px] absolute rounded-full right-0 top-0 transform translate-x-2/4 -translate-y-2/4 mt-2 mr-2;
  }
}
</style>
