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
    label: "Shifts",
    icon: "i-heroicons-calendar-days-solid",
    to: "/shifts/profile",
    order: 90,
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
      default: ShiftUserType.INACTIVE,
      order: 810,
      choices: shiftUserTypeChoices,
    },
  ];

  user.value.fields.push(...profileInputs);
}
