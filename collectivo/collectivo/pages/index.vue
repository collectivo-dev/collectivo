<script setup lang="ts">
definePageMeta({
  middleware: ["auth"],
});

setCollectivoTitle("Dashboard");

import { parse } from "marked";

const tiles = useCollectivoTiles();
tiles.value.load();
</script>

<template>
  <div class="gap-5 columns-1 md:columns-2 xl:columns-3 2xl:columns-4">
    <CollectivoCard
      v-for="tile in tiles.data"
      :key="tile.id"
      class="mb-5"
      :title="tile.tiles_name"
      :color="tile.tiles_color"
    >
      <template #content>
        <div v-if="tile.tiles_content" v-html="parse(tile.tiles_content)"></div>

        <div v-if="tile.tiles_buttons" class="flex flex-wrap gap-2 pt-3">
          <template v-for="button in tile.tiles_buttons" :key="button.id">
            <a
              v-if="button.tiles_is_external"
              :href="button.tiles_path"
              target="_blank"
            >
              <UButton
                :label="button.tiles_label"
                :color="tile.tiles_color"
                size="md"
                icon="i-heroicons-arrow-top-right-on-square-16-solid"
                trailing
              />
            </a>
            <NuxtLink v-else :to="button.tiles_path">
              <UButton
                :label="button.tiles_label"
                :color="tile.tiles_color"
                size="md"
              />
            </NuxtLink>
          </template>
        </div>
      </template>
    </CollectivoCard>
  </div>
</template>

<style lang="scss" scoped>
.dashboard {
  @apply mt-3;

  &__top {
    @apply hidden md:flex justify-between items-center mb-11;
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
