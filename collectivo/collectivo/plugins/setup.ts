import CustomVue from "~/components/collectivo/forms/Custom.vue";

export default defineNuxtPlugin(() => {
  const menu = useCollectivoMenus();
  const forms = useCollectivoForms();
  const profile = useCollectivoUser();
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
      filter: (_item) => {
        return true;
      },
    },
  ];

  const publicItems: CollectivoMenuItem[] = [
    {
      label: "Register",
      icon: "i-system-uicons-document-stack",
      to: "/forms/registration",
      public: true,
      order: 1,
      filter: (_item) => {
        return true;
      },
    },
    {
      label: "Login",
      icon: "i-system-uicons-enter",
      click: requireAuth,
      public: true,
      order: 2,
      filter: (_item) => {
        return true;
      },
    },
  ];

  menu.value.main.push(...items);
  menu.value.public.push(...publicItems);

  const profileInputs: CollectivoUserInput[] = [
    {
      label: "First Name",
      key: "first_name",
      disabled: true,
      order: 1,
    },
    {
      label: "Last Name",
      key: "last_name",
      disabled: true,
      order: 2,
    },
    {
      label: "Email",
      key: "email",
      order: 3,
    },
  ];

  profile.value.inputs.push(...profileInputs);

  // Mockup form data to be replaced later
  const test_form: CollectivoForm = {
    key: "test_form",
    title: "Test Form Title",
    description: "Test Form Description",
    public: true,
    fields: {
      section: {
        type: "section",
        content: "This is a section",
      },
      description: {
        type: "description",
        content: "This is a description",
      },
      text: {
        type: "text",
        required: true,
        label: "Text",
      },
      email: {
        type: "email",
        required: true,
        label: "Email",
        icon: "i-system-uicons-mail",
      },
      password: {
        type: "password",
        required: true,
        label: "Password",
      },
      date: {
        type: "date",
        label: "Date",
      },
      show_conditional: {
        type: "toggle",
        label: "Show conditional",
      },
      number: {
        type: "number",
        label: "Number",
        validators: [
          {
            type: "min",
            value: 5,
          },
          {
            type: "max",
            value: 10,
          },
        ],
      },
      select: {
        type: "select-radio",
        label: "Select",
        choices: [
          {
            key: "1",
            value: "1",
          },
          {
            key: "2",
            value: "2",
          },
          {
            key: "3",
            value: "3",
          },
        ],
      },
      multiselect: {
        type: "multiselect-checkbox",
        label: "Multiselect",
        choices: [
          {
            key: "1",
            value: "1",
          },
          {
            key: "2",
            value: "2",
          },
          {
            key: "3",
            value: "3",
          },
        ],
      },
      clear: {
        type: "clear",
      },
      conditional_text: {
        type: "text",
        label: "Conditional Text",
        required: true,
        conditions: [
          {
            key: "show_conditional",
            value: true,
          },
        ],
        validators: [
          {
            type: "min",
            value: 5,
          },
          {
            type: "max",
            value: 10,
          },
        ],
      },
      custom: {
        type: "custom",
        component: CustomVue,
      },
    },
  };

  forms.value[test_form.key] = test_form;
});
