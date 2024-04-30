<script setup lang="ts">
import { DateTime } from "luxon";
import {
  getNextOccurrence,
  isShiftDurationModelActive,
} from "~/composables/shifts";
import { ItemStatus } from "@collectivo/collectivo/server/utils/directusFields";
import { getStatusColor } from "~/composables/colors";
import { isThereAFutureOccurrenceWithinThatAssignment } from "~/composables/assignments";

const props = defineProps({
  shiftAssignment: {
    type: Object as PropType<ShiftsAssignment>,
    required: true,
  },
});

const { shiftAssignment } = toRefs(props);

const route = useRoute();

const from = ref<DateTime>(DateTime.fromISO(shiftAssignment.value.shifts_from));
const to = ref<DateTime>();
updateDates();
watch(shiftAssignment, updateDates);

function updateDates() {
  from.value = DateTime.fromISO(shiftAssignment.value.shifts_from);

  to.value = shiftAssignment.value.shifts_to
    ? DateTime.fromISO(shiftAssignment.value.shifts_to)
    : undefined;
}

const nextOccurrence = getNextOccurrence(
  (props.shiftAssignment.shifts_slot as ShiftsSlot).shifts_shift as ShiftsShift,
);

const shiftName = (
  (props.shiftAssignment.shifts_slot as ShiftsSlot).shifts_shift as ShiftsShift
).shifts_name;

let title = `${shiftName}, no coming occurrence`;

if (nextOccurrence) {
  const weekday = nextOccurrence.start.toLocaleString(
    DateTime.DATE_MED_WITH_WEEKDAY,
  );

  const fromString = nextOccurrence.start.toLocaleString(DateTime.TIME_SIMPLE);

  const toString = nextOccurrence.end.toLocaleString(DateTime.TIME_SIMPLE);

  title = `${shiftName}, ${weekday} from ${fromString} to ${toString}`;
}

const assignmentUrl = "/shifts/assignment/" + props.shiftAssignment.id;
</script>

<template>
  <CollectivoCard
    :title="`${title}`"
    :color="getStatusColor(shiftAssignment.shifts_status)"
  >
    <template #content>
      <p>Assignee : {{ getAssigneeName([shiftAssignment]) }}</p>
      <p>
        <span
          >Assignment currently active :
          {{ isShiftDurationModelActive(shiftAssignment) }}</span
        >
        (<span v-if="from <= DateTime.now() && !to">permanent assignment</span>
        <span v-if="from > DateTime.now() && !to"
          >permanent assignment starting from
          {{ from.toLocaleString(DateTime.DATE_SHORT) }}</span
        >
        <span v-if="from <= DateTime.now() && to"
          >assigned until {{ to.toLocaleString(DateTime.DATE_SHORT) }}</span
        >
        <span v-if="from > DateTime.now() && to"
          >assigned from {{ from.toLocaleString(DateTime.DATE_SHORT) }} to
          {{ to.toLocaleString(DateTime.DATE_SHORT) }} </span
        >)
      </p>
      <p v-if="shiftAssignment.shifts_status != ItemStatus.PUBLISHED">
        Assignment status: {{ shiftAssignment.shifts_status }}
      </p>
      <p>
        Assigned to slot :
        {{ (props.shiftAssignment.shifts_slot as ShiftsSlot).shifts_name }}
      </p>
      <UAlert
        v-if="
          isShiftDurationModelActive(shiftAssignment) &&
          !isThereAFutureOccurrenceWithinThatAssignment(shiftAssignment)
        "
        title="Warning"
        description="This assignment is still shown because it is still active, but the next
        occurrence of that shift is not within the assignment. You are not
        expected to work the next shift occurrence."
        icon="i-heroicons-exclamation-triangle"
      />
      <NuxtLink v-if="route.path != assignmentUrl" :to="assignmentUrl"
        ><UButton
          :label="'More infos'"
          :icon="'i-heroicons-information-circle'"
      /></NuxtLink>
    </template>
  </CollectivoCard>
</template>
