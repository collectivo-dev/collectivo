const schema = initSchema("collectivo", "0.0.1");

export default schema;

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
    collection: "collectivo_extensions",
    schema: { name: "schema", comment: null },
    meta: {
      sort: 90,
      group: "collectivo_settings",
      icon: "extension",
      translations: [
        {
          language: "en-US",
          translation: "Extensions",
          singular: "Extension",
          plural: "Extensions",
        },
        {
          language: "de-DE",
          translation: "Erweiterungen",
          singular: "Erweiterung",
          plural: "Erweiterungen",
        },
      ],
    },
  },
];

schema.fields = [
  {
    collection: "collectivo_extensions",
    field: "name",
    type: "string",
    schema: { is_unique: true, is_nullable: false },
    meta: {
      required: true,
      readonly: true,
      width: "half",
      sort: 1,
      translations: [
        { language: "en-US", translation: "Name" },
        { language: "de-DE", translation: "Name" },
      ],
    },
  },
  {
    collection: "collectivo_extensions",
    field: "status",
    type: "string",
    meta: {
      width: "half",
      readonly: true,
      sort: 2,
      options: {
        choices: [
          { text: "$t:active", value: "active" },
          { text: "$t:disabled", value: "disabled" },
        ],
      },
      interface: "select-dropdown",
      display: "labels",
      display_options: {
        choices: [
          {
            text: "$t:active",
            value: "active",
            foreground: "#FFFFFF",
            background: "#26A269",
          },
          {
            text: "$t:disabled",
            value: "disabled",
            foreground: "#18222F",
            background: "#D3DAE4",
          },
        ],
      },
      translations: [
        { language: "en-US", translation: "Status" },
        { language: "de-DE", translation: "Status" },
      ],
    },
    schema: { default_value: "active", is_nullable: false },
  },
  {
    collection: "collectivo_extensions",
    field: "version",
    type: "string",
    meta: {
      translations: [
        { language: "en-US", translation: "Version" },
        { language: "de-DE", translation: "Version" },
      ],
      required: true,
      readonly: true,
      sort: 4,
      note: "Semantic version of the extension (e.g. 1.0.0)",
    },
  },
  {
    collection: "collectivo_extensions",
    field: "schema_version",
    type: "string",
    meta: {
      translations: [
        { language: "en-US", translation: "Schema Version" },
        { language: "de-DE", translation: "Schema Version" },
      ],
      required: true,
      readonly: true,
      sort: 4,
      note: "Semantic version of the extension schema (e.g. 1.0.0)",
    },
  },
  {
    collection: "collectivo_extensions",
    field: "schema_is_latest",
    type: "string",
    meta: {
      translations: [
        { language: "en-US", translation: "Schema is latest" },
        { language: "de-DE", translation: "Schema ist aktuell" },
      ],
      required: true,
      readonly: true,
      sort: 4,
      note: "Whether the extension schema is up to date.",
    },
  },
];

for (const action of ["read"]) {
  for (const collection of [
    // "collectivo_settings",
    "collectivo_extensions",
    "directus_roles",
  ]) {
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

  "admin_divider",
  "role",
  "status",
];

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
    permissions: { _and: [{ id: { _nnull: true } }] }, // = all users
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
