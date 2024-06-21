<script setup lang="ts">
import { updateUser } from "@directus/sdk";

const directus = useDirectus();
const user = useCollectivoUser();
const { t } = useI18n();
const setShiftTypeLoading = ref(false);

async function setShiftType(type: string) {
  if (!user.value.data) return;

  setShiftTypeLoading.value = true;

  await directus.request(
    updateUser(user.value.data!.id, {
      shifts_user_type: type,
    }),
  );

  reloadNuxtApp();
}
</script>

<template>
  <CollectivoContainer>
    <h2>{{ t("Choose shift type") }}</h2>
    <div class="flex flex-wrap gap-4 mt-4">
      <UButton
        size="lg"
        :loading="setShiftTypeLoading"
        @click="setShiftType('REGULAR')"
        >{{ t("t:REGULAR") }}
      </UButton>
      <UButton
        size="lg"
        :loading="setShiftTypeLoading"
        @click="setShiftType('JUMPER')"
        >{{ t("t:JUMPER") }}
      </UButton>
    </div>
  </CollectivoContainer>
</template>
