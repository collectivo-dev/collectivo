<script setup lang="ts">
const appConfig = useAppConfig();
const logoPath = appConfig.logoPath;
const logoLabel = appConfig.logoLabel;

defineProps({
  hideLabel: {
    type: Boolean,
    default: false,
  },
});
</script>

<template>
  <div class="logo">
    <router-link v-if="logoPath" to="/" class="logo__image">
      <img :src="logoPath" alt="" class="object-cover" />
    </router-link>
    <div v-if="!hideLabel && logoLabel" class="logo__label">
      {{ logoLabel }}
    </div>
  </div>
</template>

<style lang="scss" scoped>
.logo {
  @apply lg:w-full flex flex-col justify-center items-center md:mb-10 lg:mb-[52px];
  &__label {
    @apply md:text-xs lg:text-sm font-semibold justify-center mt-2;
    letter-spacing: 0.28px;
  }
}
</style>
