<script setup>
import FullCalendar from "@fullcalendar/vue3";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import listPlugin from "@fullcalendar/list";
import timeGridPlugin from "@fullcalendar/timegrid";
import luxonPlugin from "@fullcalendar/luxon3";
import { DateTime } from "luxon";

const viewType = ref("");
const innerWidth = ref("");

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
});

const calendarRef = ref(null);

const calendarComputed = () => {
  return calendarRef;
};

onMounted(() => {
  resize();
  registerTest();
  window.addEventListener("resize", resize);
});

const resize = async () => {
  const deviceWidth = window.matchMedia("(max-width: 767px)");
  const calendar = await calendarRef.value.getApi();

  if (deviceWidth.matches) {
    innerWidth.value = `${window.innerWidth}px`;
    calendar.changeView("listWeek");
    calendar.setHeight(585);
    viewType.value = "listWeek";
  } else {
    calendar.changeView("dayGridMonth");
    viewType.value = "";
  }
};

const registerTest = async () => {
  const calendar = await calendarRef.value.getApi();

  calendar.on("datesSet", (infos) => {
    getEvents(DateTime.fromJSDate(infos.start), DateTime.fromJSDate(infos.end));
  });

  await getEvents(
    DateTime.fromJSDate(calendar.view.activeStart),
    DateTime.fromJSDate(calendar.view.activeEnd),
  );
};

async function getEvents(from, to) {
  const occurrences = await getAllShiftOccurrences(from, to);

  const events = [];

  for (const [i, occurrence] of occurrences.entries()) {
    events.push({
      id: i,
      title: occurrence.shift.shifts_name,
      start: occurrence.start.toJSDate(),
      end: occurrence.end.toJSDate(),
      allDay: false,
    });
  }

  calendarOptions.value.events = events;
}
</script>

<template>
  <div id="dashboard-calendar" class="calendar">
    <CalendarHeader :calendar-ref="calendarComputed()" />
    <full-calendar ref="calendarRef" :options="calendarOptions">
      <template #eventContent="arg">
        <div
          :class="viewType === 'listWeek' ? 'list-week-view' : 'day-grid-view'"
        >
          {{ arg.event.title }}
        </div>
      </template>
    </full-calendar>
  </div>
</template>

<style lang="scss" scoped>
.calendar {
  @apply mt-10;
}
</style>
