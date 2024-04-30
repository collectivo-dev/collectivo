import { ShiftUserType } from "~/server/utils/ShiftUserType";

export default defineNuxtPlugin({
  name: "shifts-setup",
  setup() {
    addMenuItems();
    addProfileFields();
  },
});

function addMenuItems() {
  const menu = useCollectivoMenus();

  menu.value.main.push({
    label: "My shifts",
    icon: "i-heroicons-building-storefront",
    to: "/shifts/my_shifts",
    order: 90,
  });

  menu.value.main.push({
    label: "Shift calendar",
    icon: "i-heroicons-calendar-days",
    to: "/shifts/shift_calendar",
    order: 95,
  });
}

function addProfileFields() {
  const user = useCollectivoUser();

  const shiftUserTypeChoices = [];

  for (const type of Object.values(ShiftUserType)) {
    shiftUserTypeChoices.push({ value: type, label: type });
  }

  const profileInputs: CollectivoFormField[] = [
    {
      type: "section",
      order: 800,
      title: "Shifts",
    },
    {
      type: "select",
      key: "shifts_user_type",
      label: "Shift user type",
      default: ShiftUserType.TypeNotChosen,
      order: 810,
      choices: shiftUserTypeChoices,
    },
  ];

  user.value.fields.push(...profileInputs);
}
