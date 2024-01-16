<script setup lang="ts">
import { readItems } from "@directus/sdk";
import AssignmentCard from "~/components/AssignmentCard.vue";
import { getNextOccurence, isAssignmentActive } from "~/composables/shifts";
import { DateTime } from "luxon";

setCollectivoTitle("My shifts");
const directus = useDirectus();
const user = useCollectivoUser();
await user.value.load();

const assignments: CollectivoAssignment[] = await directus.request(
  readItems("shifts_assignments", {
    filter: { shifts_user: { _eq: user.value.data?.id } },
    fields: "*,shifts_slot.*,shifts_slot.shifts_shift.*",
  }),
);

assignments.sort((a, b) => {
  const nextA = getNextOccurence(a.shifts_slot.shifts_shift);
  const nextB = getNextOccurence(b.shifts_slot.shifts_shift);
  return nextA.start.toMillis() - nextB.start.toMillis();
});

const skillsUserLinks = await directus.request(
  readItems("shifts_skills_directus_users", {
    filter: { directus_users_id: { _eq: user.value.data?.id } },
    fields: "*.*",
  }),
);

const activeAndFutureAssignments: CollectivoAssignment[] = [];
const pastAssignments: CollectivoAssignment[] = [];

for (const assignment of assignments) {
  const from = DateTime.fromISO(assignment.shifts_from);

  if (isAssignmentActive(assignment) || from > DateTime.now()) {
    activeAndFutureAssignments.push(assignment);
  } else {
    pastAssignments.push(assignment);
  }
}
</script>

<template>
  <CollectivoContainer>
    <h2>Status</h2>
    <CollectivoCard>
      <template #content>
        <p>My type : {{ user.data["shifts_user_type"] }}</p>
        <p>
          <span>My skills: </span>
          <span v-if="!skillsUserLinks.length">None</span>
          <span v-for="(link, index) in skillsUserLinks" :key="link.id">
            <span v-if="index !== 0">, </span>
            <span>{{ link.shifts_skills_id.shifts_name }}</span>
          </span>
        </p>
      </template>
    </CollectivoCard>
  </CollectivoContainer>

  <CollectivoContainer>
    <h2>My current assignments</h2>
    <p v-if="!activeAndFutureAssignments.length">No current assignments</p>
    <AssignmentCard
      v-for="assignment in activeAndFutureAssignments"
      :key="assignment.id"
      :shift-assignment="assignment"
    >
    </AssignmentCard>
  </CollectivoContainer>

  <CollectivoContainer v-if="pastAssignments.length">
    <h2>My past assignments</h2>
    <AssignmentCard
      v-for="assignment in pastAssignments"
      :key="assignment.id"
      :shift-assignment="assignment"
    >
    </AssignmentCard>
  </CollectivoContainer>
</template>
