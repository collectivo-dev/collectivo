const schema = initSchema("collectivo", "0.0.1");

export default schema;

schema.collections = [
  {
    collection: "collectivo_settings",
    meta: {
      icon: "settings",
      sort: 1000,
      singleton: true,
      translations: [
        {
          language: "en-US",
          translation: "Settings",
          singular: "Settings",
          plural: "Settings",
        },
        {
          language: "de-DE",
          translation: "Einstellungen",
          singular: "Einstellungen",
          plural: "Einstellungen",
        },
      ],
    },
  },
  {
    collection: "collectivo_project_settings",
    schema: { name: "schema", comment: null },
    meta: {
      icon: "settings",
      sort: 1,
      group: "collectivo_settings",
      singleton: true,
      translations: [
        {
          language: "en-US",
          translation: "Project settings",
          singular: "Project settings",
          plural: "Project settings",
        },
        {
          language: "de-DE",
          translation: "Projekteinstellungen",
          singular: "Projekteinstellungen",
          plural: "Projekteinstellungen",
        },
      ],
    },
  },
];

schema.fields = [
  ...directusSystemFields("collectivo_project_settings"),
  {
    field: "collectivo_project_name",
    collection: "collectivo_project_settings",
    type: "string",
    meta: {
      sort: 2,
      hidden: false,
      translations: [
        { language: "en-US", translation: "Project name" },
        { language: "de-DE", translation: "Projektname" },
      ],
    },
    schema: {
      default_value: "Collectivo",
    },
  },
  {
    field: "collectivo_project_description",
    collection: "collectivo_project_settings",
    type: "string",
    meta: {
      sort: 3,
      hidden: false,
      translations: [
        { language: "en-US", translation: "Project description" },
        { language: "de-DE", translation: "Projektbeschreibung" },
      ],
    },
  },
];

for (const action of ["read", "update"]) {
  schema.permissions.push({
    collection: "collectivo_project_settings",
    roleName: "collectivo_editor",
    action: action,
    fields: ["*"],
  });
}

for (const action of ["read"]) {
  for (const collection of ["collectivo_extensions", "directus_roles"]) {
    schema.permissions.push({
      collection: collection,
      roleName: "collectivo_editor",
      action: action,
      fields: ["*"],
    });
  }
}

const user_fields = ["first_name", "last_name", "email", "title"];

const editor_fields = [
  "first_name",
  "last_name",
  "email",
  "title",
  "description",
];

schema.roles = [
  {
    name: "collectivo_user",
    app_access: false,
    admin_access: false,
  },
  {
    name: "collectivo_editor",
    app_access: true,
    admin_access: false,
  },
  {
    name: "collectivo_admin",
    app_access: true,
    admin_access: true,
  },
];

for (const action of ["read"]) {
  for (const collection of ["directus_roles"]) {
    schema.permissions.push({
      collection: collection,
      roleName: "collectivo_editor",
      action: action,
      fields: ["*"],
    });
  }
}

schema.permissions.push(
  {
    collection: "directus_users",
    roleName: "collectivo_user",
    action: "read",
    permissions: { _and: [{ id: { _eq: "$CURRENT_USER" } }] },
    fields: ["id", ...user_fields],
  },
  {
    collection: "directus_users",
    roleName: "collectivo_user",
    action: "update",
    permissions: { _and: [{ id: { _eq: "$CURRENT_USER" } }] },
    fields: user_fields,
  },
);

for (const action of ["read", "update", "create", "delete"]) {
  schema.permissions.push({
    collection: "directus_users",
    roleName: "collectivo_editor",
    action: action,
    fields: editor_fields,
    permissions: { _and: [{ id: { _nnull: true } }] }, // all users
  });

  // Insights permissions for editors
  schema.permissions.push({
    collection: "directus_dashboards",
    roleName: "collectivo_editor",
    action: action,
    fields: ["*"],
  });

  schema.permissions.push({
    collection: "directus_panels",
    roleName: "collectivo_editor",
    action: action,
    fields: ["*"],
  });
}

schema.permissions.push({
  collection: "directus_flows",
  roleName: "collectivo_editor",
  action: "read",
  fields: ["*"],
});

schema.flows.push({
  flow: {
    name: "collectivo_assign_default_role_to_new_users",
    icon: "supervised_user_circle",
    color: null,
    description: null,
    status: "active",
    accountability: "all",
    trigger: "event",
    options: {
      type: "action",
      scope: ["items.create"],
      collections: ["directus_users"],
    },
  },
  firstOperation: "readRole",
  operations: [
    {
      operation: {
        name: "readRole",
        key: "readRole",
        type: "item-read",
        position_x: 3,
        position_y: 21,
        options: {
          collection: "directus_roles",
          query: { filter: { name: { _eq: "collectivo_user" } } },
        },
      },
      resolve: "assignRole",
    },
    {
      operation: {
        name: "assignRole",
        key: "assignRole",
        type: "item-update",
        position_x: 23,
        position_y: 21,
        options: {
          collection: "directus_users",
          key: ["{{$trigger.key}}"],
          payload: { role: "{{readRole[0].id}}" },
        },
      },
    },
  ],
});
