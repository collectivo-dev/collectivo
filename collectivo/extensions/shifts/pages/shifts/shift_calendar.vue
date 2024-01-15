<script setup lang="ts">
import { DateTime } from "luxon";
import { getAllShiftOccurrences } from "~/composables/shifts";

const toast = useToast();
setCollectivoTitle("Shift calendar");
const from = ref(DateTime.now().startOf("day").toJSDate());
const to = ref(DateTime.now().startOf("day").plus({ months: 1 }).toJSDate());

const shiftOccurrences: Ref<ShiftOccurrence[]> = ref([]);

async function updateShifts() {
  getAllShiftOccurrences(
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
    <p v-if="shiftOccurrences.length == 0">
      No shifts between {{ from }} and {{ to }}
    </p>
    <ul v-if="shiftOccurrences.length > 0">
      <ShiftOccurenceCard
        v-for="(shiftOccurrence, index) in shiftOccurrences"
        :key="index"
        :shift-occurrence="shiftOccurrence"
      />
    </ul>
  </CollectivoContainer>
</template>
