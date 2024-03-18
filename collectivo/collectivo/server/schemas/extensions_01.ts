const schema = initSchema("collectivo", "0.0.1");

export default schema;

schema.collections = [
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
  ...directusSystemFields("collectivo_extensions"),
  {
    collection: "collectivo_extensions",
    field: "extensions_name",
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
    field: "extensions_status",
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
    field: "extensions_version",
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
    field: "extensions_schema_version",
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
    field: "extensions_schema_is_latest",
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
  for (const collection of ["collectivo_extensions"]) {
    schema.permissions.push({
      collection: collection,
      roleName: "collectivo_editor",
      action: action,
      fields: ["*"],
    });
  }
}
