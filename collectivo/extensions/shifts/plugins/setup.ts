export default defineNuxtPlugin(() => {
  const menu = useCollectivoMenus();

  menu.value.main.push({
    label: "My shifts",
    icon: "i-system-uicons-calendar-days",
    to: "/shifts/my_shifts",
    order: 90,
  });

  menu.value.main.push({
    label: "Shift calendar",
    icon: "i-system-uicons-calendar-month",
    to: "/shifts/shift_calendar",
    order: 95,
  });
});
