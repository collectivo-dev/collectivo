<script setup lang="ts">
import { readItem } from "@directus/sdk";
import type { CollectivoShift, ShiftOccurrence } from "~/composables/types";
import { DateTime } from "luxon";
import { getNextOccurrences } from "~/composables/shifts";

const route = useRoute();
const directus = useDirectus();
const user = useCollectivoUser();
user.value.load();

const toast = useToast();
const shift: Ref<CollectivoShift> = ref(null);

directus
  .request(readItem("shifts_shifts", route.params.id))
  .then((item: CollectivoShift) => {
    shift.value = item;
  })
  .catch((error) => {
    toast.add({
      title: "Shift data could not be loaded",
      description: error,
      icon: "i-mi-warning",
      color: "red",
    });
  });

const nextOccurrences: Ref<ShiftOccurrence[]> = ref([]);
const shift_start: Ref<DateTime> = ref(null);
const shift_end: Ref<DateTime> = ref(null);

watch(shift, () => {
  if (!shift.value) return;
  setDetails();
});

function setDetails() {
  shift_start.value = DateTime.fromISO(shift.value.shifts_from);

  shift_end.value = shift_start.value.plus({
    minutes: shift.value.shifts_duration,
  });

  setCollectivoTitle(
    shift.value.shifts_name +
      ", " +
      shift_start.value.toLocaleString({ weekday: "long" }) +
      " from " +
      shift_start.value.toLocaleString(DateTime.TIME_SIMPLE) +
      " to " +
      shift_end.value.toLocaleString(DateTime.TIME_SIMPLE),
  );

  nextOccurrences.value = getNextOccurrences(shift.value, 5);
}
</script>

<template>
  <CollectivoContainer>
    <h1>Details</h1>
    <ul v-if="shift">
      <li>Is currently active : {{ isShiftDurationModelActive(shift) }}</li>
      <li>Started on: {{ shift_start.toLocaleString(DateTime.DATE_SHORT) }}</li>
      <li>
        Ends on :
        <span v-if="shift.shifts_to">{{
          DateTime.fromISO(shift.shifts_to)
        }}</span>
        <span v-else>never</span>
      </li>
    </ul>
  </CollectivoContainer>

  <AssignmentList v-if="shift && user.data" :shift="shift" :user="user.data" />

  <CollectivoContainer>
    <h1>Future occurrences</h1>
    <p v-if="nextOccurrences.length == 0">
      There are no occurrences of this shift in the future.
    </p>
    <OccurrenceCard
      v-for="(occurrence, i) in nextOccurrences"
      :key="i"
      :shift-occurrence="occurrence"
    >
    </OccurrenceCard>
  </CollectivoContainer>
</template>
