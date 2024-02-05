<script setup lang="ts">
import Sidebar from "./components/Sidebar.vue";
import PageTitle from "./components/PageTitle.vue";
import MobileHeader from "./components/MobileHeader.vue";
import MobileMenu from "./components/MobileMenu.vue";

const { setLocale, t } = useI18n();
const user = useCollectivoUser();
const router = useRouter();

const topRightMenuNoAuthItems: any = ref([[]]);

const topRightMenuItems: any = ref([
  [
    {
      label: "Profile",
      click: () => {
        router.push({ name: "profile" });
      },
    },
    {
      label: "Logout",
      click: () => {
        user.value.logout();
      },
    },
  ],
  [
    // for languages items
  ],
]);

const locales = {
  de: "Deutsch",
  en: "English",
};

for (const [key, value] of Object.entries(locales)) {
  topRightMenuNoAuthItems.value[0].push({
    label: value,
    click: () => {
      setLocale(key);
    },
  });

  topRightMenuItems.value[1].push({
    label: value,
    click: () => {
      setLocale(key);
    },
  });
}
</script>

<template>
  <div class="layout">
    <div class="layout__bg">
      <svg
        width="359"
        height="269"
        viewBox="0 0 359 269"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <mask
          id="mask0_2159_5105"
          style="mask-type: alpha"
          maskUnits="userSpaceOnUse"
          x="0"
          y="0"
          width="359"
          height="269"
        >
          <rect width="359" height="269" fill="#D9D9D9" />
        </mask>
        <g mask="url(#mask0_2159_5105)">
          <rect
            x="-443"
            y="-264.359"
            width="753.268"
            height="753.268"
            transform="rotate(-45 -443 -264.359)"
            fill="#FFF7E3"
          />
        </g>
      </svg>
    </div>
    <Sidebar />
    <MobileHeader />
    <div class="main">
      <div class="main__top">
        <div class="main__top__left">
          <PageTitle class="mb-1.5" />
        </div>

        <div class="main__top__right">
          <!-- <a :href="logoutPath">
            <UIcon
              name="i-system-uicons-exit-left"
              class="main__top__right__icon"
          /></a> -->
          <template v-if="!user.isAuthenticated">
            <UDropdown
              :items="topRightMenuNoAuthItems"
              :popper="{ placement: 'bottom-start' }"
            >
              <UIcon
                class="main__top__right__icon"
                name="i-system-uicons-translate"
              ></UIcon>

              <template #item="{ item }">
                <span>{{ t(item.label) }}</span>
              </template>
            </UDropdown>
          </template>
          <template v-else>
            <UDropdown
              :items="topRightMenuItems"
              :popper="{ placement: 'bottom-start' }"
            >
              <UIcon
                class="main__top__right__icon"
                name="i-system-uicons-user-male-circle"
              />

              <template #item="{ item }">
                <span>{{ t(item.label) }}</span>
              </template>
            </UDropdown>
          </template>
        </div>
      </div>
      <slot></slot>
    </div>
    <MobileMenu />
  </div>
</template>

<style lang="scss" scoped>
.layout {
  @apply md:pr-8 md:py-8 h-full;

  &__bg {
    @apply hidden md:block fixed top-0 left-0 -z-10;
  }
  .main {
    @apply md:pl-[172px] lg:pl-[226px] h-full w-full lg:pr-10 px-[25px] md:px-0 pb-28 md:pb-0;
  }
}

.main {
  @apply mt-3;

  &__top {
    @apply hidden md:flex justify-between items-center mb-11;

    &__right {
      &__icon {
        @apply w-7 h-7;
      }
    }
  }

  &__table {
    @apply mt-10 mb-28 md:mb-0;

    &__top {
      @apply flex items-center justify-between mb-5;

      &__buttons {
        @apply hidden md:flex items-center gap-2.5;

        button {
          @apply pl-[14px] pr-2.5 py-2 h-10 rounded-[10px] gap-0;
        }
      }
    }
  }
}
</style>
