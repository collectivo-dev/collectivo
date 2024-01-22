<script setup lang="ts">
import { DateTime } from "luxon";
import {
  getNextOccurrence,
  isNextOccurrenceWithinAssignment,
  isShiftDurationModelActive,
} from "~/composables/shifts";

const props = defineProps({
  shiftAssignment: {
    type: Object as PropType<CollectivoAssignment>,
    required: true,
  },
});

const from: DateTime = DateTime.fromISO(props.shiftAssignment.shifts_from);

const to = props.shiftAssignment.shifts_to
  ? DateTime.fromISO(props.shiftAssignment.shifts_to)
  : null;

const nextOccurrence = getNextOccurrence(
  props.shiftAssignment.shifts_slot.shifts_shift,
);
</script>

<template>
  <CollectivoCard
    :title="`${
      shiftAssignment.shifts_slot.shifts_shift.shifts_name
    }, ${nextOccurrence.start.toLocaleString(
      DateTime.DATE_MED_WITH_WEEKDAY,
    )} from ${nextOccurrence.start.toLocaleString(
      DateTime.TIME_SIMPLE,
    )} to ${nextOccurrence.end.toLocaleString(DateTime.TIME_SIMPLE)}`"
  >
    <template #content>
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
      <UAlert
        v-if="
          isShiftDurationModelActive(shiftAssignment) &&
          !isNextOccurrenceWithinAssignment(shiftAssignment)
        "
        title="Warning"
        description="This assignment is still shown because it is still active, but the next
        occurrence of that shift is not within the assignment. You are not
        expected to work the next shift occurrence."
        icon="i-system-uicons-warning-triangle"
      />
    </template>
  </CollectivoCard>
</template>
