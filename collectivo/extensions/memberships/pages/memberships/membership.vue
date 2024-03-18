<script setup lang="ts">
import { readItems } from "@directus/sdk";

definePageMeta({
  middleware: ["auth"],
});

const { t } = useI18n();
setCollectivoTitle("Profile");
const profileMenu = useCollectivoMenus().value.profile;
const user = useCollectivoUser();
const directus = useDirectus();
const memberships: Ref<MembershipsMembership[]> = ref([]);
const loaded = ref(false);

async function getMemberships() {
  await user.value.load();

  memberships.value = await directus.request(
    readItems("memberships", {
      fields: [
        "id",
        "memberships_type.memberships_name",
        "memberships_shares",
        "memberships_status",
      ],
      filter: {
        memberships_user: {
          _eq: user.value.data?.id,
        },
      },
    }),
  );

  loaded.value = true;
}

getMemberships();
</script>

<template>
  <CollectivoMenuTabs :items="profileMenu" />

  <div v-if="loaded">
    <div v-if="memberships.length == 0">
      {{ t("No memberships found") }}
    </div>
    <div v-else>
      <CollectivoContainer
        v-for="membership in memberships"
        :key="membership.id"
      >
        <div class="flex flex-col">
          <div>{{ t("ID") }}: {{ membership.id }}</div>
          <div>
            {{ t("Type") }}:
            {{ membership.memberships_type.memberships_name }}
          </div>
          <div>
            {{ t("Status") }}: {{ t(membership.memberships_status ?? "") }}
          </div>
          <div>{{ t("Shares") }}: {{ membership.memberships_shares }}</div>
        </div>
      </CollectivoContainer>
    </div>
  </div>
</template>

<i18n lang="json">
{
  "de": {
    "applied": "Beantragt",
    "approved": "Angenommen",
    "ended": "Beendet",
    "No memberships found": "Keine Mitgliedschaften gefunden"
  }
}
</i18n>
