<script setup lang="ts">
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
  <UDropdown
    :items="user.isAuthenticated ? topRightMenuItems : topRightMenuNoAuthItems"
    :popper="{ placement: 'bottom-start' }"
  >
    <UIcon class="icon" name="i-heroicons-bars-3-16-solid" />

    <template #item="{ item }">
      <span>{{ t(item.label) }}</span>
    </template>
  </UDropdown>
</template>

<style lang="scss" scoped>
.icon {
  @apply w-7 h-7;
}
</style>
