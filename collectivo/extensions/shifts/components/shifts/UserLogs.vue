<script setup lang="ts">
import { getUserLogs, getUserScore } from "~/composables/shift_logs";
import { ShiftLogType } from "~/server/utils/ShiftLogType";

// getUserLogs(user.value.data, DateTime.now(), 10)
// .then((items) => {
//   logs.value.push(...items);
// })
// .catch((error) => showShiftToast("Failed to load logs", error, "error"));
</script>

<template>
  <h2>My activities</h2>
  <!-- <CollectivoContainer v-if="logs.length" class="my-4">
    <ul>
      <li v-for="log in logs" :key="log.id">
        <strong>
          <span v-if="log.shifts_type == ShiftLogType.ATTENDED"
            >+1 - Shift attended</span
          >
          <span v-if="log.shifts_type == ShiftLogType.MISSED"
            >-2 - Shift missed</span
          >
          <span v-if="log.shifts_type == ShiftLogType.CYCLE"
            >-1 - Four weeks have passed</span
          >
          <span v-if="log.shifts_type == ShiftLogType.CYCLE_DEACTIVATED"
            >Shift cycle paused</span
          >
          <span v-if="log.shifts_type == ShiftLogType.CYCLE_ACTIVATED"
            >Shift cycle activated</span
          >
        </strong>
        <span>
          ({{
            DateTime.fromISO(log.shifts_date).toLocaleString(DateTime.DATE_MED)
          }})</span
        >
      </li>
    </ul>
  </CollectivoContainer> -->
</template>
