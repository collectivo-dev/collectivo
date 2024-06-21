<script setup lang="ts">
import Sidebar from "./components/Sidebar.vue";
import MobileHeader from "./components/MobileHeader.vue";
import MobileMenu from "./components/MobileMenu.vue";
import ProfileMenu from "./components/ProfileMenu.vue";
import { useCollectivoBackLink } from "~/composables/page";

const { t } = useI18n();
const config = useAppConfig();
const pageTitle = useCollectivoTitle();
const backLink = useCollectivoBackLink();
const sidebarWidthMd = String(config.collectivo.sidebarWidth + 65) + "px";
const sidebarWidthLg = String(config.collectivo.sidebarWidth + 90) + "px";
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

      <svg
        class="bottom-right"
        viewBox="0 0 200 200"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          fill="#f1f5fd"
          d="M42.3,-27.9C57.3,-15,73.6,2.8,70.1,15C66.5,27.3,43.1,34.1,23.2,40.7C3.4,47.3,-12.8,53.8,-31.8,50.6C-50.8,47.4,-72.5,34.5,-74.2,19.2C-75.9,3.9,-57.6,-13.7,-41.9,-26.8C-26.2,-39.9,-13.1,-48.5,0.3,-48.8C13.7,-49,27.4,-40.9,42.3,-27.9Z"
          transform="translate(190 175)"
        />

        <path
          fill="#f2fbf9"
          d="M30.5,-23.7C43.3,-17.8,59.9,-8.9,64.4,4.6C69,18,61.6,36.1,48.8,40.6C36.1,45.2,18,36.2,0.4,35.8C-17.2,35.4,-34.3,43.4,-49.3,38.9C-64.3,34.3,-77.2,17.2,-70.1,7.1C-63,-3,-36,-6,-21,-11.9C-6,-17.7,-3,-26.5,3,-29.5C8.9,-32.4,17.8,-29.6,30.5,-23.7Z"
          transform="translate(100 190)"
        />
      </svg>
    </div>
    <Sidebar />
    <MobileHeader />
    <div class="main">
      <div class="main__top">
        <div class="main__top__left">
          <h1 class="flex flex-wrap align-middle items-center gap-3">
            <NuxtLink v-if="backLink" :to="backLink" class="flex items-center">
              <UIcon name="i-heroicons-arrow-left-circle-16-solid" />
            </NuxtLink>

            {{ t(pageTitle) }}
          </h1>
        </div>

        <div class="main__top__right">
          <ProfileMenu />
        </div>
      </div>
      <slot />
    </div>
    <MobileMenu />
  </div>
</template>

<style lang="scss" scoped>
.bottom-right {
  position: fixed;
  right: 0;
  bottom: 0;
  width: 800px;
  height: 800px;
}

.layout {
  @apply md:py-8 h-full;

  &__bg {
    @apply hidden md:block fixed top-0 left-0 -z-10;
  }
  .main {
    @apply h-full w-full lg:pl-[v-bind("sidebarWidthLg")] md:pl-[v-bind("sidebarWidthMd")] px-6 md:pr-8 lg:pr-14 pb-28 md:pb-0;
  }
}

.main {
  @apply mt-3 lg:mt-7;

  &__top {
    @apply hidden md:flex justify-between items-center mb-7 lg:mb-11;
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
