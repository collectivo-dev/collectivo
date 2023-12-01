<script setup lang="ts">
defineProps({
  item: {
    type: Object as PropType<CollectivoMenuItem>,
    required: true,
  },
});
</script>

<template>
  <!-- <router-link :to="path" class="item">
    <span class="item__icon">
      <slot name="icon"> </slot>
    </span>
    <span class="item__title">{{ title }}</span>
  </router-link> -->
  <div v-if="!item.filter || item.filter(item)">
    <div v-if="item.external">
      <a :href="item.path" :target="item.target ?? '_blank'" class="item">
        <span class="item__icon">
          <slot name="icon">
            <UIcon v-if="item.icon" :name="item.icon" class="link-icon" />
          </slot>
        </span>
        <span class="item__title">{{ item.label }}</span>
      </a>
    </div>
    <div v-else>
      <NuxtLink :to="item.path" class="item">
        <span class="item__icon">
          <slot name="icon">
            <UIcon v-if="item.icon" :name="item.icon" class="link-icon"
          /></slot>
        </span>
        <span class="item__title">{{ item.label }}</span>
      </NuxtLink>
    </div>
  </div>
</template>

<style lang="scss">
.item {
  @apply flex flex-col items-center p-3 mb-1 rounded-xl transition-all;
  &__icon {
    @apply block mb-1.5;
  }

  &__title {
    @apply md:text-xs lg:text-sm text-cv-primary font-semibold;
    letter-spacing: 0.28px;
  }

  &:hover {
    @apply bg-[#ECF1FD];
    .item__title {
      @apply text-cv-active;
    }

    .item__icon {
      .link-icon {
        @apply text-cv-active;
      }
    }
  }
}

.link-icon {
  @apply h-7 w-7 md:h-6 lg:h-[30px] md:w-6 lg:w-[30px] text-cv-primary;
}

.router-link-exact-active {
  .item__title {
    @apply text-cv-active;
  }

  .item__icon {
    .link-icon {
      @apply text-cv-active;
    }
  }
}

.mobile-menu-item {
  @apply p-0 mb-0;
  .item__icon {
    @apply mb-[7px];
  }

  .item__title {
    @apply text-xs;
    letter-spacing: 0.24px;
  }

  &.router-link-exact-active {
    &.mobile-menu-item {
      .item__icon {
        @apply relative z-10;
        &::after {
          @apply content-[''] bg-cv-purple-light w-11 h-[34px] rounded-lg absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 -z-10;
        }
      }
    }
  }

  &:hover {
    @apply bg-transparent;
    .item__title {
      @apply text-cv-active;
    }

    .item__icon {
      .link-icon {
        @apply text-cv-active;
      }
    }
  }
}
</style>