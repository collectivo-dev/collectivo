<script setup>
import FullCalendar from "@fullcalendar/vue3";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import listPlugin from "@fullcalendar/list";
import timeGridPlugin from "@fullcalendar/timegrid";

const viewType = ref("");
const innerWidth = ref("");

const calendarOptions = ref({
  plugins: [dayGridPlugin, listPlugin, timeGridPlugin, interactionPlugin],
  initialView: "dayGridMonth",
  headerToolbar: false,
  fixedWeekCount: false,
  // contentHeight: 'auto',
  views: {
    dayGrid: {
      dayMaxEventRows: 2,
    },
  },
  events: [
    {
      id: 1,
      title: "Team Meeting",
      start: "2024-01-08",
    },
    {
      id: 2,
      title: "Marketing strategy",
      start: "2024-01-08",
    },
    {
      id: 3,
      title: "Web development",
      start: "2024-01-15",
      backgroundColor: "#FFF7E3",
      textColor: "#D36D29",
    },
    {
      id: 4,
      title: "Team Meeting",
      start: "2024-01-15",
      textColor: "#D36D29",
      backgroundColor: "#FFF7E3",
    },
    {
      id: 5,
      title: "Public relation",
      start: "2024-01-11",
      backgroundColor: "#EAFFF8",
      textColor: "#2CB3A5",
    },
    {
      id: 6,
      title: "Team Meeting",
      start: "2024-01-11",
      backgroundColor: "#EAFFF8",
      textColor: "#2CB3A5",
    },

    {
      id: 7,
      title: "Team Meeting",
      start: "2024-01-21",
    },
    {
      id: 8,
      title: "Marketing strategy",
      start: "2024-01-21",
    },
    {
      id: 9,
      title: "Team Meeting",
      start: "2024-01-20",
      backgroundColor: "#EAFFF8",
      textColor: "#2CB3A5",
    },
    {
      id: 10,
      title: "Marketing strategy",
      start: "2024-01-12",
      backgroundColor: "#EAFFF8",
      textColor: "#2CB3A5",
    },
  ],
});

const calendarRef = ref(null);

const calendarComputed = () => {
  return calendarRef;
};

onMounted(() => {
  resize();
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
</script>

<template>
  <div id="dashboard-calendar" class="calendar">
    <ShiftsCalendarHeader :calendar-ref="calendarComputed()" />
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
