<script setup lang="ts">
import { DateTime } from "luxon";
import {
  getAllShiftOccurences,
  type ShiftOccurence,
} from "~/composables/shifts";

const toast = useToast();
setCollectivoTitle("Shift calendar");
const from = ref(DateTime.now().startOf("day").toJSDate());
const to = ref(DateTime.now().startOf("day").plus({ months: 1 }).toJSDate());

const shiftOccurrences: Ref<ShiftOccurence[]> = ref([]);

async function updateShifts() {
  getAllShiftOccurences(
    DateTime.fromISO(from.value.toISOString()),
    DateTime.fromISO(to.value.toISOString()),
  )
    .then((input) => {
      shiftOccurrences.value = input;
    })
    .catch((error) => {
      toast.add({
        title: "Error while loading the shifts",
        description: error.description,
        color: "red",
        icon: "i-mi-warning",
      });
    });
}

updateShifts();

watch(from, updateShifts);
watch(to, updateShifts);
</script>

<template>
  <CollectivoContainer>
    <label for="from">From</label>
    <CollectivoFormDate id="from" v-model="from" />
    <label for="to">to</label>
    <CollectivoFormDate id="to" v-model="to" />
  </CollectivoContainer>
  <CollectivoContainer>
    <ul>
      <li v-for="(shiftOccurrence, index) in shiftOccurrences" :key="index">
        {{ shiftOccurrence.shift.shifts_name }} - {{ shiftOccurrence.start }} -
        {{ shiftOccurrence.end }}
      </li>
    </ul>
  </CollectivoContainer>
</template>
