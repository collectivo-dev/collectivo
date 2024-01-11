<script setup lang="ts">
import { DateTime } from "luxon";

const toast = useToast();
setCollectivoTitle("Shift calendar");
const from = ref(DateTime.now().startOf("day").toJSDate());
const to = ref(DateTime.now().startOf("day").plus({ months: 1 }).toJSDate());

const shifts: Ref<CollectivoShift[]> = ref([]);

async function updateShifts() {
  console.log(from.value);

  getShiftOccurences(
    DateTime.fromISO(from.value.toISOString()),
    DateTime.fromISO(to.value.toISOString()),
  )
    .then((input) => {
      shifts.value = input;
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
      <li v-for="shift in shifts" :key="shift.id">
        {{ shift.shifts_name }} - {{ shift.shifts_from }}
      </li>
    </ul>
  </CollectivoContainer>
</template>
