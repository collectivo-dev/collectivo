<script setup lang="ts">
import { DateTime } from "luxon";
import { getNextOccurrences } from "~/composables/shifts";
import {
  getOccurrenceType,
  OccurrenceType,
} from "~/composables/occurrenceType";

const props = defineProps({
  shiftsSlot: { type: Object as PropType<ShiftsSlot>, required: true },
  assignments: { type: Object as PropType<ShiftsAssignment[]>, required: true },
  userId: { type: String, required: true },
  from: { type: Object as PropType<DateTime>, required: false },
  to: { type: Object as PropType<DateTime>, required: false },
});

const occurrences = getNextOccurrences(
  props.shiftsSlot.shifts_shift as ShiftsShift,
  10,
);

function getOccurrenceColor(occurrence: ShiftOccurrence) {
  switch (
    getOccurrenceType(
      occurrence,
      props.assignments,
      props.userId,
      props.from,
      props.to,
    )
  ) {
    case OccurrenceType.NOT_ASSIGNED:
      return "gray";
    case OccurrenceType.ASSIGNED_TO_CURRENT_USER_FROM_ALREADY_EXISTING_ASSIGNMENT:
      return "blue";
    case OccurrenceType.ASSIGNED_TO_ANOTHER_USER:
      return "gray";
    case OccurrenceType.ASSIGNED_TO_CURRENT_USER_FROM_NEW_ASSIGNMENT:
      return "green";
    case OccurrenceType.ASSIGNED_TO_ANOTHER_USER_INSIDE_NEW_ASSIGNMENT:
      return "red";
  }
}

function getOccurrenceText(occurrence: ShiftOccurrence) {
  switch (
    getOccurrenceType(
      occurrence,
      props.assignments,
      props.userId,
      props.from,
      props.to,
    )
  ) {
    case OccurrenceType.NOT_ASSIGNED:
      return "Not assigned";
    case OccurrenceType.ASSIGNED_TO_CURRENT_USER_FROM_ALREADY_EXISTING_ASSIGNMENT:
      return "Already assigned to you";
    case OccurrenceType.ASSIGNED_TO_ANOTHER_USER:
      return (
        "Assigned to " + getAssigneeName(props.assignments, occurrence.start)
      );
    case OccurrenceType.ASSIGNED_TO_CURRENT_USER_FROM_NEW_ASSIGNMENT:
      return "Would be assigned to you";
    case OccurrenceType.ASSIGNED_TO_ANOTHER_USER_INSIDE_NEW_ASSIGNMENT:
      return (
        "Already assigned to " +
        getAssigneeName(props.assignments, occurrence.start)
      );
  }
}
</script>

<template>
  <ul>
    <li v-for="occurrence in occurrences" :key="occurrence.start.toMillis()">
      <CollectivoCard
        :title="occurrence.start.toLocaleString(DateTime.DATE_MED_WITH_WEEKDAY)"
        :color="getOccurrenceColor(occurrence)"
      >
        <template #content>
          {{ getOccurrenceText(occurrence) }}
        </template>
      </CollectivoCard>
    </li>
  </ul>
</template>

<style scoped lang="scss"></style>
