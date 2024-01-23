<script setup lang="ts">
import { readItems } from "@directus/sdk";
import type { CollectivoShift } from "~/composables/types";

const props = defineProps({
  shift: {
    type: Object as PropType<CollectivoShift>,
    required: true,
  },
  user: {
    type: Object as PropType<CollectivoUser>,
    required: true,
  },
});

const directus = useDirectus();
const assignments: Ref<CollectivoAssignment[]> = ref([]);
loadAssignments();

function loadAssignments() {
  directus
    .request(
      readItems("shifts_assignments", {
        filter: {
          shifts_user: props.user.id,
          shifts_slot: { shifts_shift: props.shift.id },
        },
        fields: "*,shifts_slot.*,shifts_slot.shifts_shift.*",
      }),
    )
    .then((items: CollectivoAssignment[]) => {
      assignments.value = items;
    })
    .catch((error) => showShiftToast("Failed to load assignments", error));
}
</script>

<template>
  <CollectivoContainer>
    <h1>My assignments to this shift</h1>
    <p v-if="assignments.length == 0">You have no assignment to this shift</p>
    <AssignmentCard
      v-for="(assignment, i) in assignments"
      :key="i"
      :shift-assignment="assignment"
    />
  </CollectivoContainer>
</template>
