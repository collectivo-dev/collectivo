<script setup lang="ts">
import { readItems } from "@directus/sdk";
import { DateTime } from "luxon";
import showShiftToast from "~/composables/toast";

const config = useRuntimeConfig();

const { t } = useI18n();
setCollectivoTitle(t("Shifts"));

const directus = useDirectus();
const user = useCollectivoUser();
const activeAssignments: Ref<ShiftsAssignmentRules[]> = ref([]);
const skillsLoading = ref(true);
const skillsUserLinks = ref<ShiftsSkillUserLink[]>([]);
const skillNames = ref<string[]>([]);
const score = ref("loading...");
const isActive = ref(false);
const isExempt = ref(false);

async function loadData() {
  await user.value.load();
  isActive.value = user.value.data?.shifts_user_type != "INACTIVE";
  isExempt.value = user.value.data?.shifts_user_type == "EXEMPT";

  if (!user.value.data) {
    return;
  }

  activeAssignments.value = await getActiveAssignments(user.value.data!);

  directus
    .request(
      readItems("shifts_skills_directus_users", {
        filter: { directus_users_id: { _eq: user.value.data.id } },
        fields: ["*", { shifts_skills: ["*"] }, { directus_users: ["*"] }],
      }),
    )
    .then((items) => {
      skillsUserLinks.value.push(...items);
      getUserSkillNames();
    })
    .catch((error) => showShiftToast("Failed to load skills", error, "error"));

  getUserScore(user.value.data, DateTime.now())
    .then((item) => {
      score.value = item.toString();
    })
    .catch((error) => showShiftToast("Failed to load score", error, "error"));
}

loadData();

function getUserSkillNames() {
  if (skillsUserLinks.value.length === 0) {
    skillsLoading.value = false;
    return;
  }

  directus
    .request(
      readItems("shifts_skills", {
        filter: {
          id: {
            _in: skillsUserLinks.value.map((link) => link.shifts_skills_id),
          },
        },
        fields: ["shifts_name"],
      }),
    )
    .then((skills) => {
      skillNames.value = skills.map((skill) => skill.shifts_name);
    })
    .catch((error) => showShiftToast("Failed to load skills", error, "error"))
    .finally(() => (skillsLoading.value = false));
}
</script>

<template>
  <CollectivoContainer v-if="user.data">
    <div>
      <p>
        {{ t("Type") }}: {{ t("t:" + user.data["shifts_user_type"] ?? "") }}
      </p>
      <p>
        <span>{{ t("Skills") }}: </span>
        <span v-if="skillsLoading">loading...</span>
        <span v-else>
          <span v-if="!skillNames.length">{{ t("None") }}</span>
          <span v-for="(skillName, index) in skillNames" :key="skillName">
            <span v-if="index !== 0">, </span>
            <span>{{ skillName }}</span>
          </span>
        </span>
      </p>
      <p>
        {{ t("Status") }}:
        <span v-if="!isActive" class="font-bold text-orange-500">
          {{ t("Choose shift type") }}
        </span>
        <span v-else-if="isExempt" class="font-bold text-green-500">
          {{ t("t:shift_status_exempt") }}
        </span>
        <span v-else-if="Number(score) == 1" class="font-bold text-green-500">
          {{ score }} {{ t("shift") }} {{ t("ahead") }}
        </span>
        <span v-else-if="Number(score) >= 0" class="font-bold text-green-500">
          {{ score }} {{ t("shifts") }} {{ t("ahead") }}
        </span>
        <span v-else>
          {{ -Number(score) }} {{ t("shifts") }} {{ t("to catch up") }}
        </span>
        <span> </span>
      </p>
    </div>
  </CollectivoContainer>

  <div v-if="isActive" class="flex flex-wrap pb-6 gap-5">
    <NuxtLink to="/shifts/signup"
      ><UButton size="lg" icon="i-heroicons-plus-circle">{{
        t("Sign up for a shift")
      }}</UButton></NuxtLink
    >
    <a :href="`mailto:${config.public.collectivoContactEmail}`">
      <UButton
        size="lg"
        :label="t('Request change')"
        :icon="'i-heroicons-pencil-square'"
      />
    </a>
  </div>
  <div v-else>
    <ShiftsSetShiftType></ShiftsSetShiftType>
  </div>

  <h2>{{ t("My shifts") }}</h2>
  <p v-if="!activeAssignments.length">
    {{ t("No upcoming shifts") }}
  </p>
  <div class="flex flex-col gap-4 my-4">
    <ShiftsAssignmentCard
      v-for="assignment in activeAssignments"
      :key="assignment.assignment.id"
      :shift-assignment="assignment"
    >
    </ShiftsAssignmentCard>
  </div>
</template>

<i18n lang="yaml">
de:
  "Request change": "Änderung beantragen"
  "t:shift_status_good": "Gut!"
  "t:shift_status_bad": "Du musst Schichten nachholen"
  "t:shift_status_exempt": "Du bist von Schichten befreit"
  "Choose shift type": "Schichttyp wählen"
  "Shifts": "Schichten"
  "My shifts": "Meine Schichten"
  "Upcoming shifts": "Kommende Schichten"
  "No upcoming shifts": "Keine kommenden Schichten"
  "shifts": "Schichten"
  "shift": "Schicht"
  "ahead": "voraus"
  "to catch up": "nachzuholen"
  "Skills": "Fähigkeiten"
  "Sign up for a shift": "Neue Schicht eintragen"
  "t:REGULAR": "Regulär"
  "t:JUMPER": "Springer*in"
  "t:EXEMPT": "Befreit"
  "t:INACTIVE": "Nicht aktiv"
  "None": "Keine"
  "My activities": "Meine Aktivitäten"
</i18n>
