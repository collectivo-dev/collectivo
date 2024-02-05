export default defineNuxtPlugin(() => {
  const menu = useCollectivoMenus();
  const user = useCollectivoUser();
  const runtimeConfig = useRuntimeConfig();

  const items: CollectivoMenuItem[] = [
    {
      label: "Home",
      icon: "i-system-uicons-grid",
      to: "/",
      order: 0,
    },
    {
      label: "Profile",
      icon: "i-system-uicons-user-male-circle",
      to: "/profile",
      order: 0,
    },
    {
      label: "Studio",
      icon: "i-system-uicons-cubes",
      to: runtimeConfig.public.directusUrl,
      external: true,
      hideOnMobile: true,
      order: 99,
      filter: async (_item) => {
        await user.value.load();
        return user.value.data?.role?.app_access ?? false;
      },
    },
  ];

  const publicItems: CollectivoMenuItem[] = [
    {
      label: "Login",
      icon: "i-system-uicons-enter",
      click: user.value.login,
      order: 100,
      filter: (_item) => {
        return true;
      },
    },
  ];

  menu.value.main.push(...items);
  menu.value.public.push(...publicItems);

  const profileInputs: CollectivoFormField[] = [
    {
      type: "section",
      order: 100,
      title: "Account details",
    },
    {
      label: "First name",
      key: "first_name",
      type: "text",
      order: 101,
      disabled: true,
    },
    {
      label: "Last name",
      key: "last_name",
      type: "text",
      order: 102,
      disabled: true,
    },
    {
      label: "Email",
      key: "email",
      type: "text",
      order: 103,
      disabled: true,
    },
  ];

  user.value.fields = Object.assign(profileInputs, user.value.fields);
});
