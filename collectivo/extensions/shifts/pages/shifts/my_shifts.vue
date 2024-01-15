<script setup lang="ts">
import { readItems } from "@directus/sdk";
import AssignmentCard from "~/components/AssignmentCard.vue";

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
</script>

<template>
  <CollectivoContainer>
    <h2>Status</h2>
    <CollectivoCard>
      <template #content>
        <p>My type : TODO</p>
      </template>
    </CollectivoCard>
  </CollectivoContainer>

  <CollectivoContainer>
    <h2>My assignments</h2>
    <p v-if="!assignments.length">No assignments</p>
    <AssignmentCard
      v-for="assignment in assignments"
      :key="assignment.id"
      :shift-assignment="assignment"
    >
    </AssignmentCard>
  </CollectivoContainer>
</template>
