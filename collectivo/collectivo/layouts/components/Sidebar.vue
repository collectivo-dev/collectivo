<script setup lang="ts">
import Logo from "./Logo.vue";
import MenuItem from "./MenuItem.vue";
import pkg from "../../package.json";

const menus = useCollectivoMenus();
const user = useCollectivoUser();

const mainMenuItems = Object.values(menus.value.main).sort(
  (a, b) => (a.order ?? 100) - (b.order ?? 100),
);

const publicMenuItems = Object.values(menus.value.public).sort(
  (a, b) => (a.order ?? 100) - (b.order ?? 100),
);
</script>

<template>
  <div class="sidebar">
    <div class="sidebar__inner">
      <div class="sidebar__inner__list">
        <div class="sidebar__inner__list__item">
          <div class="sidebar__inner__list__item__top">
            <Logo />
            <div
              v-for="(item, i) in user.isAuthenticated
                ? mainMenuItems
                : publicMenuItems"
              :key="i"
            >
              <MenuItem
                v-if="user.isAuthenticated || !user.isAuthenticated"
                :item="item"
              />
            </div>
          </div>
          <div class="sidebar__inner__list__item__bottom">
            <div class="about">
              <span>Collectivo v{{ pkg.version }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.about {
  @apply flex items-center justify-center text-xs;
  letter-spacing: 0.24px;
}
.sidebar {
  @apply hidden md:block md:w-[100px] lg:w-[124px] rounded-xl bg-white shadow-sidebar px-3 py-4 fixed h-[calc(100vh-60px)] ml-8 overflow-y-auto;

  &__inner {
    @apply h-full;
    &__list {
      @apply h-full;
      &__item {
        @apply flex flex-col h-full;

        &__top {
          @apply flex-1;
        }

        &__bottom {
          .avatar-image-wrapper {
            @apply md:h-10 md:w-10 lg:h-[54px] lg:w-[54px] rounded-full overflow-hidden ml-auto mr-auto mt-6;

            .avatar-image {
              @apply object-cover h-full w-full cursor-pointer;
            }
          }
        }
      }
    }
  }
}
</style>
