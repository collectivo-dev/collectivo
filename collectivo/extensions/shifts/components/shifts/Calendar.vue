<script setup>
import FullCalendar from "@fullcalendar/vue3";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import listPlugin from "@fullcalendar/list";
import timeGridPlugin from "@fullcalendar/timegrid";
import luxonPlugin from "@fullcalendar/luxon3";
import { DateTime } from "luxon";

const calendarOptions = ref({
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
    navigateTo("/shifts/shift/" + info.event.extendedProps.shiftId);
  },
});

const calendarRef = ref(null);

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
  const occurrences = await getAllShiftOccurrences(from, to);

  const events = [];

  for (const occurrence of occurrences) {
    events.push({
      title: occurrence.shift.shifts_name,
      start: occurrence.start.toJSDate(),
      end: occurrence.end.toJSDate(),
      allDay: false,
      shiftId: occurrence.shift.id,
    });
  }

  console.log(events[0].shiftId);

  calendarOptions.value.events = events;
}
</script>

<template>
  <div id="dashboard-calendar" class="calendar">
    <ShiftsCalendarHeader :calendar-ref="calendarComputed()" />
    <full-calendar ref="calendarRef" :options="calendarOptions" />
  </div>
</template>
