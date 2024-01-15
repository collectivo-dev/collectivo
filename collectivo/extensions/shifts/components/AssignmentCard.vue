<script setup lang="ts">
import { DateTime } from "luxon";
import { getNextOccurence } from "~/composables/shifts";

const props = defineProps(["shiftAssignment"]);
const shiftAssignment: CollectivoAssignment = props.shiftAssignment;
const from = DateTime.fromISO(shiftAssignment.shifts_from);

const to = shiftAssignment.shifts_to
  ? DateTime.fromISO(shiftAssignment.shifts_to)
  : null;

const nextOccurrence = getNextOccurence(
  shiftAssignment.shifts_slot.shifts_shift,
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
      <span>Assignment</span>
      <ul>
        <li v-if="from > DateTime.now()">
          starts from {{ from.toLocaleString(DateTime.DATE_SHORT) }}
        </li>
        <li v-if="to">ends {{ to.toLocaleString(DateTime.DATE_SHORT) }}</li>
        <li v-if="from <= DateTime.now() && !to">is permanent</li>
      </ul>
    </template>
  </CollectivoCard>
</template>
