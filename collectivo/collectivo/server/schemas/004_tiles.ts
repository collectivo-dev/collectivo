const schema = initSchema("collectivo", "0.0.1");

export default schema;

schema.collections = [
  {
    collection: "collectivo_tiles",
    schema: { name: "collectivo_tiles" },
    meta: {
      icon: "dashboard",
      sort: 520,
      archive_field: "status",
      archive_value: "archived",
      sort_field: "sort",
      unarchive_value: "published",
      translations: [
        {
          language: "en-US",
          translation: "Tiles",
          singular: "Tile",
          plural: "Tiles",
        },
        {
          language: "de-DE",
          translation: "Kacheln",
          singular: "Kachel",
          plural: "Kacheln",
        },
      ],
    },
  },
  {
    collection: "collectivo_tiles_buttons",
    schema: { name: "collectivo_tiles_buttons" },
    meta: {
      hidden: true,
      display_template: "{{collectivo_label}}",
      sort_field: "sort",
      translations: [
        {
          language: "en-US",
          translation: "Tile Buttons",
          singular: "Tile Button",
          plural: "Tile Buttons",
        },
        {
          language: "de-DE",
          translation: "Kachel Buttons",
          singular: "Kachel Button",
          plural: "Kachel Buttons",
        },
      ],
    },
  },
];

schema.fields = [
  directusNameField("collectivo_tiles"),
  directusSortField("collectivo_tiles"),
  directusSortField("collectivo_tiles_buttons"),
  directusStatusField("collectivo_tiles"),
  ...directusSystemFields("collectivo_tiles"),
  {
    collection: "collectivo_tiles",
    field: "content",
    type: "text",
    schema: {},
    meta: {
      sort: 3,
      interface: "input-rich-text-md",
      options: {
        toolbar: [
          "heading",
          "bold",
          "italic",
          "strikethrough",
          "blockquote",
          "bullist",
          "numlist",
          "table",
          "code",
          "link",
          "empty",
        ],
        translations: [
          { language: "en-US", translation: "Content" },
          { language: "de-DE", translation: "Inhalt" },
        ],
      },
    },
  },
  {
    field: "collectivo_color",
    type: "string",
    schema: { default_value: "primary" },
    meta: {
      interface: "select-dropdown",
      special: null,
      options: {
        choices: [
          { text: "$t:primary", value: "primary" },
          { text: "$t:green", value: "green" },
          { text: "$t:orange", value: "orange" },
          { text: "$t:blue", value: "blue" },
          { text: "$t:pink", value: "pink" },
          { text: "$t:red", value: "red" },
        ],
      },
      translations: [
        { language: "en-US", translation: "Color" },
        { language: "de-DE", translation: "Farbe" },
      ],
    },
    collection: "collectivo_tiles",
  },

  // Button fields
  {
    field: "collectivo_label",
    collection: "collectivo_tiles_buttons",
    type: "string",
    meta: {
      sort: 2,
      required: true,
      translations: [
        { language: "en-US", translation: "Label" },
        { language: "de-DE", translation: "Label" },
      ],
    },
    schema: {},
  },
  {
    field: "collectivo_path",
    collection: "collectivo_tiles_buttons",
    type: "string",
    meta: {
      sort: 2,
      translations: [
        { language: "en-US", translation: "Path" },
        { language: "de-DE", translation: "Pfad" },
      ],
    },
    schema: {},
  },
  {
    field: "collectivo_is_external",
    collection: "collectivo_tiles_buttons",
    type: "boolean",
    meta: {
      sort: 2,
      required: true,
      translations: [
        { language: "en-US", translation: "Path is external" },
        { language: "de-DE", translation: "Pfad ist extern" },
      ],
    },
    schema: {
      default_value: true,
    },
  },
];

schema.createForeignKey("collectivo_tiles_buttons", "collectivo_tiles", {
  fieldKey: {
    field: "collectivo_tile",
    meta: {
      hidden: true,
    },
  },
  fieldAlias: {
    field: "collectivo_buttons",
    meta: {
      options: {
        enableSelect: false,
      },
      display: "related-values",
      display_options: {
        template: "{{collectivo_label}}",
      },
      translations: [
        { language: "en-US", translation: "Buttons" },
        { language: "de-DE", translation: "Buttons" },
      ],
    },
  },
  relation: {
    meta: {
      sort_field: "sort",
      one_deselect_action: "delete",
    },
    schema: {
      on_delete: "CASCADE",
      on_update: "NO ACTION",
    },
  },
});

for (const collection of ["collectivo_tiles", "collectivo_tiles_buttons"]) {
  schema.permissions = [
    {
      roleName: "collectivo_user",
      collection: collection,
      action: "read",
      fields: ["*"],
      permissions: {},
      validation: {},
    },
  ];

  for (const action of ["read", "update", "create", "delete"]) {
    schema.permissions.push({
      collection: collection,
      roleName: "collectivo_editor",
      action: action,
      fields: ["*"],
    });
  }
}
