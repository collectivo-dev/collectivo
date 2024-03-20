<script setup lang="ts">
import { DateTime } from "luxon";
import type { ShiftOccurrence } from "~/composables/types";

const props = defineProps({
  shiftOccurrence: {
    type: Object as PropType<ShiftOccurrence>,
    required: true,
  },
});

const date = props.shiftOccurrence.start.toLocaleString(
  DateTime.DATE_MED_WITH_WEEKDAY,
);

const start_time = props.shiftOccurrence.start.toLocaleString(
  DateTime.TIME_SIMPLE,
);

const end_time = props.shiftOccurrence.end.toLocaleString(DateTime.TIME_SIMPLE);
</script>

<template>
  <CollectivoCard
    :title="`${props.shiftOccurrence.shift.shifts_name} on ${date} from ${start_time} to ${end_time}`"
  >
    <template #content>
      <p>WIP</p>
    </template>
  </CollectivoCard>
</template>
