<script setup lang="ts">
import { readItems } from "@directus/sdk";
import {
  getNextOccurrence,
  isShiftDurationModelActive,
} from "~/composables/shifts";
import { DateTime } from "luxon";
import { getUserLogs, getUserScore } from "~/composables/shift_logs";
import { ShiftLogType } from "~/server/utils/ShiftLogType";
import showShiftToast from "~/composables/toast";
import { ItemStatus } from "@collectivo/collectivo/server/utils/directusFields";
import { isThereAFutureOccurrenceWithinThatAssignment } from "~/composables/assignments";

setCollectivoTitle("My shifts");
const directus = useDirectus();
const user = useCollectivoUser();

const activeAndFutureAssignments: Ref<ShiftsAssignment[]> = ref([]);
const pastAssignments: Ref<ShiftsAssignment[]> = ref([]);
const skillsLoading = ref(true);
const skillsUserLinks = ref<ShiftsSkillUserLink[]>([]);
const skillNames = ref<string[]>([]);
const score = ref("loading...");
const logs = ref<ShiftsLog[]>([]);

user.value
  .load()
  .then((userStore) => {
    loadAssignments(userStore.data!);
    loadUserShiftDetails(userStore.data!);
  })
  .catch((error) => showShiftToast("Failed to load user data", error, "error"));

function loadAssignments(user: CollectivoUser) {
  directus
    .request(
      readItems("shifts_assignments", {
        filter: {
          shifts_user: { id: { _eq: user.id } },
        },
        fields: [
          "*",
          { shifts_slot: ["*", { shifts_shift: ["*"] }] },
          { shifts_user: ["first_name", "last_name"] },
        ],
      }),
    )
    .then((items) => {
      const assignments = items as ShiftsAssignment[];

      assignments.sort((a, b) => {
        const nextA = getNextOccurrence(
          (a.shifts_slot as ShiftsSlot).shifts_shift as ShiftsShift,
        );

        const nextB = getNextOccurrence(
          (b.shifts_slot as ShiftsSlot).shifts_shift as ShiftsShift,
        );

        if (!nextA && !nextB) return 0;
        if (!nextA) return 1;
        if (!nextB) return -1;
        return nextA.start.toMillis() - nextB.start.toMillis();
      });

      for (const assignment of assignments) {
        const from = DateTime.fromISO(assignment.shifts_from);

        if (
          (isShiftDurationModelActive(assignment) || from > DateTime.now()) &&
          assignment.shifts_status == ItemStatus.PUBLISHED &&
          isThereAFutureOccurrenceWithinThatAssignment(assignment)
        ) {
          activeAndFutureAssignments.value.push(assignment);
        } else {
          pastAssignments.value.push(assignment);
        }
      }
    })
    .catch((error) =>
      showShiftToast("Failed to load assignments", error, "error"),
    );
}

function loadUserShiftDetails(user: CollectivoUser) {
  directus
    .request(
      readItems("shifts_skills_directus_users", {
        filter: { directus_users_id: { _eq: user.id } },
        fields: ["*", { shifts_skills: ["*"] }, { directus_users: ["*"] }],
      }),
    )
    .then((items) => {
      skillsUserLinks.value.push(...items);
      getUserSkillNames();
    })
    .catch((error) => showShiftToast("Failed to load skills", error, "error"));

  getUserScore(user, DateTime.now())
    .then((item) => {
      score.value = item.toString();
    })
    .catch((error) => showShiftToast("Failed to load score", error, "error"));

  getUserLogs(user, DateTime.now(), 10)
    .then((items) => {
      logs.value.push(...items);
    })
    .catch((error) => showShiftToast("Failed to load logs", error, "error"));
}

function getUserSkillNames() {
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
  <CollectivoContainer>
    <h2>Status</h2>
    <CollectivoCard>
      <template #content>
        <div v-if="user.data">
          <p>My type : {{ user.data["shifts_user_type"] }}</p>
          <p>
            <span>My skills: </span>
            <span v-if="skillsLoading">loading...</span>
            <span v-else>
              <span v-if="!skillNames.length">None</span>
              <span v-for="(skillName, index) in skillNames" :key="skillName">
                <span v-if="index !== 0">, </span>
                <span>{{ skillName }}</span>
              </span>
            </span>
          </p>
          <p>
            <span>My score: {{ score }}</span>
          </p>
        </div>
      </template>
    </CollectivoCard>
  </CollectivoContainer>

  <CollectivoContainer>
    <h2>My current assignments</h2>
    <p v-if="!activeAndFutureAssignments.length">No current assignments</p>
    <ShiftsAssignmentCard
      v-for="assignment in activeAndFutureAssignments"
      :key="assignment.id"
      :shift-assignment="assignment"
    >
    </ShiftsAssignmentCard>
  </CollectivoContainer>

  <CollectivoContainer v-if="pastAssignments.length">
    <h2>My past assignments</h2>
    <ShiftsAssignmentCard
      v-for="assignment in pastAssignments"
      :key="assignment.id"
      :shift-assignment="assignment"
    >
    </ShiftsAssignmentCard>
  </CollectivoContainer>

  <CollectivoContainer v-if="logs.length">
    <h2>Last score updates</h2>
    <ul>
      <li v-for="log in logs" :key="log.id">
        <strong>
          <span v-if="log.shifts_type == ShiftLogType.ATTENDED">+1</span>
          <span v-if="log.shifts_type == ShiftLogType.MISSED">-2</span>
          <span v-if="log.shifts_type == ShiftLogType.CYCLE">-1</span>
        </strong>
        <span>
          ({{
            DateTime.fromISO(log.shifts_datetime).toLocaleString(
              DateTime.DATETIME_MED_WITH_WEEKDAY,
            )
          }})</span
        >
      </li>
    </ul>
  </CollectivoContainer>
</template>
