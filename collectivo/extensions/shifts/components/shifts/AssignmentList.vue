<script setup lang="ts">
import { readItems } from "@directus/sdk";
import showShiftToast from "~/composables/toast";

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
const { shift } = toRefs(props);

watch(shift, loadAssignments);

function loadAssignments() {
  directus
    .request(
      readItems("shifts_assignments", {
        filter: {
          shifts_user: {
            id: {
              _eq: props.user.id,
            },
          },
          shifts_slot: { shifts_shift: { id: { _eq: props.shift.id } } },
        },
        fields: [
          "*",
          { shifts_slot: ["*", { shifts_shift: ["*"] }] },
          { shifts_user: ["first_name", "last_name"] },
        ],
      }),
    )
    .then((items) => {
      assignments.value = items as ShiftsAssignment[];
    })
    .catch((error) =>
      showShiftToast("Failed to load assignments", error, "error"),
    );
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
