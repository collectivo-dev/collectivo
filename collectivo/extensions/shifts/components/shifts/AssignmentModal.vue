<script setup lang="ts">
import { createItem, readItems, updateItem } from "@directus/sdk";
import showShiftToast from "~/composables/toast";
import { DateTime } from "luxon";
import { ItemStatus } from "@collectivo/collectivo/server/utils/directusFields";
import OccurrencesPreview from "~/components/shifts/Assignment/OccurrencesPreview.vue";
import { fromToOverlaps, getNextOccurrences } from "~/composables/shifts";
import {
  getOccurrenceType,
  OccurrenceType,
} from "~/composables/occurrenceType";
import { capAssignmentToFirstAndLastIncludedOccurrence } from "~/composables/assignments";

const props = defineProps({
  shiftsSlot: {
    type: Object as PropType<ShiftsSlot>,
    required: true,
  },
  assignment: {
    type: Object as PropType<ShiftsAssignment>,
    required: false,
  },
});

const { shiftsSlot } = toRefs(props);

const isOpen = defineModel("isOpen", { required: true, type: Boolean });

const emit = defineEmits<{
  assignmentCreated: [assignment: ShiftsAssignment];
  assignmentUpdated: [assignment: ShiftsAssignment];
}>();

const directus = useDirectus();
const user = useCollectivoUser();
user.value.load();
const loading = ref(false);
const from = ref<DateTime>();
const to = ref<DateTime>();
const showForm = ref(true);
const assignments = ref<ShiftsAssignment[]>([]);

if (props.assignment) {
  from.value = DateTime.fromISO(props.assignment.shifts_from);

  if (props.assignment.shifts_to) {
    to.value = DateTime.fromISO(props.assignment.shifts_to);
  }
}

loadAssignments();
watch(shiftsSlot, loadAssignments);

function loadAssignments() {
  directus
    .request(
      readItems("shifts_assignments", {
        filter: {
          shifts_slot: { id: { _eq: shiftsSlot.value.id } },
        },
        fields: [
          "*",
          { shifts_slot: ["*", { shifts_shift: ["*"] }] },
          { shifts_user: ["*"] },
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

async function onCheck(formData: Record<string, unknown>) {
  from.value = DateTime.fromJSDate(<Date>formData.from);

  to.value = formData.to ? DateTime.fromJSDate(<Date>formData.to) : undefined;

  showForm.value = false;
}

async function onCreate() {
  if (!user.value.data) {
    showShiftToast("User data not loaded", null, "error");
    return;
  }

  loading.value = true;

  const assignment: ShiftsAssignment = {
    shifts_slot: shiftsSlot.value,
    shifts_user: user.value.data.id,
    shifts_status: ItemStatus.PUBLISHED,
    shifts_from: from.value!.toISO()!,
    shifts_to: to.value?.toISO() ?? undefined,
  };

  capAssignmentToFirstAndLastIncludedOccurrence(assignment);

  assignment.shifts_slot = shiftsSlot.value.id;

  directus
    .request(createItem("shifts_assignments", assignment))
    .then((updatedAssignment) => {
      showShiftToast("Assignment created", "", "success");
      emit("assignmentCreated", updatedAssignment as ShiftsAssignment);
    })
    .catch((error) =>
      showShiftToast("Failed to create assignment", error, "error"),
    )
    .finally(() => {
      loading.value = false;
      isOpen.value = false;
      reset();
    });
}

async function onUpdate() {
  if (!user.value.data) {
    showShiftToast("User data not loaded", null, "error");
    return;
  }

  loading.value = true;

  if (!props.assignment) {
    throw new Error(
      "Assignment must be set in order to update it. Did you mean to create a new assignment?",
    );
  }

  const assignment = props.assignment;
  assignment.shifts_from = from.value!.toISO() as string;
  assignment.shifts_to = to.value ? (to.value.toISO() as string) : undefined;

  capAssignmentToFirstAndLastIncludedOccurrence(assignment);

  directus
    .request(
      updateItem("shifts_assignments", assignment.id!, {
        shifts_from: assignment.shifts_from,
        shifts_to: assignment.shifts_to,
      }),
    )
    .then((updatedAssignment) => {
      showShiftToast("Assignment updated", "", "success");
      emit("assignmentUpdated", updatedAssignment as ShiftsAssignment);
    })
    .catch((error) =>
      showShiftToast("Failed to update assignment", error, "error"),
    )
    .finally(() => {
      loading.value = false;
      isOpen.value = false;
      reset();
    });
}

let title = "";
updateTitle();
watch(shiftsSlot, updateTitle);

function updateTitle() {
  if (!shiftsSlot.value) return;
  const shift = shiftsSlot.value.shifts_shift as ShiftsShift;
  const from = DateTime.fromISO(shift.shifts_from);

  title =
    (props.assignment ? "Update" : "Create") +
    ` assignment for ${shift.shifts_name} : ${shiftsSlot.value.shifts_name}, ${from.weekdayLong}`;
}

function reset() {
  from.value = undefined;
  to.value = undefined;
  showForm.value = true;
}

function atLeastOneNewOccurrence() {
  if (!user.value.data) return false;

  const occurrences = getNextOccurrences(
    props.shiftsSlot.shifts_shift as ShiftsShift,
    to.value ? Infinity : 100,
    from.value,
    to.value,
  );

  let filteredAssignments = assignments.value;

  if (props.assignment) {
    filteredAssignments = filteredAssignments.filter((assignment) => {
      return assignment.id != props.assignment!.id;
    });
  }

  for (const occurrence of occurrences) {
    if (
      getOccurrenceType(
        occurrence,
        filteredAssignments,
        user.value.data.id,
        from.value,
        to.value,
      ) == OccurrenceType.ASSIGNED_TO_CURRENT_USER_FROM_NEW_ASSIGNMENT
    )
      return true;
  }

  return false;
}

function overlapWithOtherAssignment() {
  if (!from.value) return true;

  for (const assignment of assignments.value) {
    if (props.assignment && props.assignment.id == assignment.id) continue;

    if (
      fromToOverlaps(
        from.value,
        DateTime.fromISO(assignment.shifts_from),
        to.value,
        assignment.shifts_to
          ? DateTime.fromISO(assignment.shifts_to)
          : undefined,
        true,
      )
    ) {
      return true;
    }
  }

  return false;
}

function confirmButtonEnabled() {
  return atLeastOneNewOccurrence() && !overlapWithOtherAssignment();
}
</script>

<template>
  <UModal v-model="isOpen" @close="reset">
    <CollectivoCard :title="title">
      <template #content>
        <ShiftsAssignmentForm
          v-if="showForm"
          :submit="onCheck"
          :from="from"
          :to="to"
        />
        <div v-if="!showForm">
          <UDivider label="Confirm" />
          <p>From: {{ from ? formatDate(from) : "" }}</p>
          <p>To : {{ to ? formatDate(to) : "permanent" }}</p>
          <UTooltip :prevent="confirmButtonEnabled()">
            <template #text>
              <span v-if="overlapWithOtherAssignment()">
                The date interval you specified overlaps with another
                assignment.
              </span>
              <span v-if="!atLeastOneNewOccurrence()">
                The date interval you specified does not include any new shift
                occurrence.
              </span>
            </template>
            <UButton
              label="Confirm"
              icon="i-heroicons-check"
              :loading="loading"
              :disabled="!confirmButtonEnabled()"
              @click="assignment ? onUpdate() : onCreate()"
            />
          </UTooltip>
          <UButton
            label="Update request"
            icon="i-heroicons-pencil"
            :loading="loading"
            @click="
              () => {
                showForm = true;
              }
            "
          />
        </div>
        <UDivider label="Upcoming occurrences" />
        <OccurrencesPreview
          :user-id="user.data!.id"
          :shifts-slot="shiftsSlot"
          :assignments="assignments"
          :from="from"
          :to="to"
        />
      </template>
    </CollectivoCard>
  </UModal>
</template>
