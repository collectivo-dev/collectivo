<script setup lang="ts">
import { readItems } from "@directus/sdk";

const props = defineProps({
  shift: {
    type: Object as PropType<ShiftsShift>,
    required: true,
  },
  user: {
    type: Object as PropType<CollectivoUser>,
    required: true,
  },
});

const directus = useDirectus();
const assignments: Ref<ShiftsAssignment[]> = ref([]);
loadAssignments();

function loadAssignments() {
  directus
    .request(
      readItems("shifts_assignments", {
        filter: {
          shifts_user: { _eq: props.user },
          shifts_slot: { shifts_shift: { _eq: props.shift } },
        },
        fields: [
          "*",
          "shifts_slot",
          { shifts_slot: ["*", { shifts_shift: ["*"] }] },
        ],
      }),
    )
    .then((items: ShiftsAssignment[]) => {
      assignments.value = items;
    })
    .catch((error) => showShiftToast("Failed to load assignments", error));
}
</script>

<template>
  <CollectivoContainer>
    <h1>My assignments to this shift</h1>
    <p v-if="assignments.length == 0">You have no assignment to this shift</p>
    <ShiftsAssignmentCard
      v-for="(assignment, i) in assignments"
      :key="i"
      :shift-assignment="assignment"
    />
  </CollectivoContainer>
</template>
