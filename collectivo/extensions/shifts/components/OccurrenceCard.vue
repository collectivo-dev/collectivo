<script setup lang="ts">
import { DateTime } from "luxon";
import { defineProps, toRefs } from "vue";

const props = defineProps(["shiftOccurrence"]);
const { shiftOccurrence } = toRefs(props);

const date = shiftOccurrence.value.start.toLocaleString(
  DateTime.DATE_MED_WITH_WEEKDAY,
);

const start_time = shiftOccurrence.value.start.toLocaleString(
  DateTime.TIME_SIMPLE,
);

const end_time = shiftOccurrence.value.end.toLocaleString(DateTime.TIME_SIMPLE);
</script>

<template>
  <CollectivoCard
    :title="`${shiftOccurrence.shift.shifts_name} on ${date} from ${start_time} to ${end_time}`"
  >
    <template #content>
      <p>WIP</p>
    </template>
  </CollectivoCard>
</template>
