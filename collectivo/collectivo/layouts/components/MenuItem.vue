<script setup lang="ts">
const { t } = useI18n();

const props = defineProps({
  item: {
    type: Object as PropType<CollectivoMenuItem>,
    required: true,
  },
});

const visible = ref(false);
filterItem(props.item);

async function filterItem(item: CollectivoMenuItem) {
  if (item.filter) {
    visible.value = await item.filter(item);
    return;
  }

  visible.value = true;
}
</script>

<template>
  <div v-if="visible">
    <!-- IF item.to is function -->
    <div v-if="item.click">
      <a class="item cursor-pointer" @click="item.click()">
        <span class="item__icon">
          <slot name="icon">
            <UIcon v-if="item.icon" :name="item.icon" class="link-icon" />
          </slot>
        </span>
        <span class="item__title">{{ t(item.label) }}</span>
      </a>
    </div>
    <div v-else-if="item.external">
      <a :href="item.to" :target="item.target ?? '_blank'" class="item">
        <span class="item__icon">
          <slot name="icon">
            <UIcon v-if="item.icon" :name="item.icon" class="link-icon" />
          </slot>
        </span>
        <span class="item__title">{{ t(item.label) }}</span>
      </a>
    </div>
    <div v-else>
      <NuxtLink :to="item.to" class="item">
        <span class="item__icon">
          <slot name="icon">
            <UIcon v-if="item.icon" :name="item.icon" class="link-icon"
          /></slot>
        </span>
        <span class="item__title">{{ t(item.label) }}</span>
      </NuxtLink>
    </div>
  </div>
</template>

<style lang="scss">
.item {
  @apply flex flex-col items-center p-3 mb-1 rounded-xl transition-all;
  &__icon {
    @apply block mb-1;
  }

  &__title {
    @apply md:text-xs lg:text-sm font-semibold;
    letter-spacing: 0.28px;
  }

  &:hover {
    @apply bg-primary-50;
    .item__title {
      @apply text-primary-900;
    }

    .item__icon {
      .link-icon {
        @apply text-primary-900;
      }
    }
  }

  &.router-link-exact-active {
    @apply bg-primary-50;
    .item__title {
      @apply text-primary-900;
    }

    .item__icon {
      .link-icon {
        @apply text-primary-900;
      }
    }
  }
}

.link-icon {
  @apply h-7 w-7 md:h-6 lg:h-[30px] md:w-6 lg:w-[30px];
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
          @apply content-[''] bg-purple-500 w-11 h-[34px] rounded-lg absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 -z-10;
        }
      }
    }
  }

  &:hover {
    @apply bg-transparent;
    .item__title {
      @apply text-primary-900;
    }

    .item__icon {
      .link-icon {
        @apply text-primary-900;
      }
    }
  }
}
</style>
