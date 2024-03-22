<script setup lang="ts">
import { readItem } from "@directus/sdk";
import { DateTime } from "luxon";
import { getNextOccurrences } from "~/composables/shifts";

const route = useRoute();
const directus = useDirectus();
const user = useCollectivoUser();
user.value.load();
const shift = ref<ShiftsShift>();

directus
  .request(readItem("shifts_shifts", route.params.id as string))
  .then((item) => {
    shift.value = item;
  })
  .catch((error) => showShiftToast("Shift data could not be loaded", error));

const nextOccurrences: Ref<ShiftOccurrence[]> = ref([]);
const shift_start = ref<DateTime>();
const shift_end = ref<DateTime>();

watch(shift, () => {
  if (!shift.value) return;
  setDetails(shift.value);
});

function setDetails(shift: CollectivoShift) {
  shift_start.value = DateTime.fromISO(shift.shifts_from);

  shift_end.value = shift_start.value.plus({
    minutes: shift.shifts_duration,
  });

  setCollectivoTitle(
    shift.shifts_name +
      ", " +
      shift_start.value.toLocaleString({ weekday: "long" }) +
      " from " +
      shift_start.value.toLocaleString(DateTime.TIME_SIMPLE) +
      " to " +
      shift_end.value.toLocaleString(DateTime.TIME_SIMPLE),
  );

  nextOccurrences.value = getNextOccurrences(shift, 5);
}
</script>

<template>
  <CollectivoContainer>
    <h1>Details</h1>
    <ul v-if="shift">
      <li>Is currently active : {{ isShiftDurationModelActive(shift) }}</li>
      <li v-if="shift_start">
        Started on: {{ shift_start.toLocaleString(DateTime.DATE_SHORT) }}
      </li>
      <li>
        Ends on :
        <span v-if="shift.shifts_to">{{
          DateTime.fromISO(shift.shifts_to)
        }}</span>
        <span v-else>never</span>
      </li>
    </ul>
  </CollectivoContainer>

  <ShiftsAssignmentList
    v-if="shift && user.data"
    :shift="shift"
    :user="user.data"
  />

  <CollectivoContainer>
    <h1>Future occurrences</h1>
    <p v-if="nextOccurrences.length == 0">
      There are no occurrences of this shift in the future.
    </p>
    <ShiftsOccurrenceCard
      v-for="(occurrence, i) in nextOccurrences"
      :key="i"
      :shift-occurrence="occurrence"
    >
    </ShiftsOccurrenceCard>
  </CollectivoContainer>
</template>
