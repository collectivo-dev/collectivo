<script setup lang="ts">
import FullCalendar from "@fullcalendar/vue3";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import listPlugin from "@fullcalendar/list";
import timeGridPlugin from "@fullcalendar/timegrid";
import luxonPlugin from "@fullcalendar/luxon3";
import { DateTime } from "luxon";

// import { DateTime, Settings } from "luxon";

// const { locale } = useI18n();

// watch(locale, (newLocale) => {
//   Settings.defaultLocale = newLocale;
// });

const props = defineProps({
  shiftType: {
    type: String,
    required: false,
  },
  adminMode: {
    type: Boolean,
    default: false,
  },
});

const assignmentCreationModalOpen = ref(false);
const selectedShiftOccurence = ref(null);

// The time is not necessarily UTC, times are saved without timezone,
// but UTC strings are used so that times are not changed
const calendarOptions = ref({
  timeZone: "UTC",
  plugins: [
    dayGridPlugin,
    listPlugin,
    timeGridPlugin,
    interactionPlugin,
    luxonPlugin,
  ],
  initialView: "dayGridMonth",
  headerToolbar: false,
  events: [],
  allDaySlot: false,
  displayEventTime: true,
  eventTimeFormat: {
    hour: "2-digit",
    minute: "2-digit",
    meridiem: false,
    hour12: false,
  },
  nowIndicator: true,
  eventClick: (info) => {
    selectedShiftOccurence.value = info.event.extendedProps.shiftOccurence;
    assignmentCreationModalOpen.value = true;
  },
});

const customSettings = ref({
  allowedShiftTypes: [
    {
      label: "Regular",
      value: "regular",
      icon: "i-heroicons-squares-plus",
    },
    {
      label: "One-time",
      value: "jumper",
      icon: "i-heroicons-stop",
    },
  ],
  selectedShiftType: props.shiftType,
});

const calendarRef = ref(null);

watch(
  () => customSettings.value.selectedShiftType,
  (value) => {
    registerEventUpdate();
  },
);

const calendarComputed = () => {
  return calendarRef;
};

onMounted(() => {
  registerEventUpdate();
});

const registerEventUpdate = async () => {
  const calendar = await calendarRef.value.getApi();

  calendar.on("datesSet", (infos) => {
    updateEvents(
      DateTime.fromJSDate(infos.start),
      DateTime.fromJSDate(infos.end),
    );
  });

  await updateEvents(
    DateTime.fromJSDate(calendar.view.activeStart),
    DateTime.fromJSDate(calendar.view.activeEnd),
  );
};

async function updateEvents(from, to) {
  const occurrences = await getShiftOccurrences(from, to, {
    shiftType: customSettings.value.selectedShiftType,
  });

  const events = [];

  for (const occurrence of occurrences) {
    events.push({
      title:
        occurrence.shift.shifts_name +
        " - " +
        (occurrence.slots - occurrence.openSlots.length) +
        "/" +
        occurrence.slots,
      start: occurrence.start.toJSDate(),
      end: occurrence.end.toJSDate(),
      allDay: false,
      shiftOccurence: occurrence,
    });
  }

  calendarOptions.value.events = events;
}
</script>

<template>
  <div id="dashboard-calendar" class="calendar">
    <ShiftsCalendarHeader
      v-model="customSettings"
      :calendar-ref="calendarComputed()"
    />
    <full-calendar ref="calendarRef" :options="calendarOptions" />
  </div>

  <ShiftsAssignmentPostModal
    v-if="assignmentCreationModalOpen && selectedShiftOccurence"
    v-model:is-open="assignmentCreationModalOpen"
    :shift-occurence="selectedShiftOccurence"
    :shift-type="customSettings.selectedShiftType"
  />
</template>

<style scoped>
:deep(.fc-event) {
  cursor: pointer;
}
</style>
