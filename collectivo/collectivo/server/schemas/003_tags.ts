const schema = initSchema("collectivo", "0.0.1");

export default schema;

const collection = "collectivo_tags";

schema.collections = [
  {
    collection: collection,
    schema: { name: collection },
    meta: {
      icon: "sell",
      sort: 510,
      archive_field: "status",
      archive_value: "archived",
      unarchive_value: "published",
      display_template: "{{name}}",
      translations: [
        {
          language: "en-US",
          translation: "Tags",
          singular: "Tag",
          plural: "Tags",
        },
        {
          language: "de-DE",
          translation: "Tags",
          singular: "Tag",
          plural: "Tags",
        },
      ],
    },
  },
];

schema.fields = [
  directusNameField(collection),
  directusStatusField(collection),
  ...directusSystemFields(collection),
  {
    collection: collection,
    field: "description",
    type: "text",
    schema: {},
    meta: { interface: "input-multiline", sort: 20 },
  },
  {
    collection: "directus_users",
    field: "collectivo_tags_divider",
    type: "alias",
    meta: {
      interface: "presentation-divider",
      sort: 100,
      special: ["alias", "no-data"],
      options: { title: "Tags", icon: "sell" },
    },
  },
];

schema.createM2MRelation("collectivo_tags", "directus_users", {
  m2mFieldType2: "uuid",
  field1: {
    field: "directus_users",
    type: "alias",
    meta: {
      special: ["m2m"],
      sort: 30,
      interface: "list-m2m",
      translations: [
        { language: "en-US", translation: "Users" },
        { language: "de-DE", translation: "Benutzer*innen" },
      ],
      display: "related-values",
      display_options: {
        template:
          "{{directus_users_id.first_name}} {{directus_users_id.last_name}}",
      },
    },
  },
  field2: {
    meta: {
      sort: 101,
    },
  },
});

for (const action of ["read", "update", "create", "delete"]) {
  for (const collection of [
    "collectivo_tags",
    "collectivo_tags_directus_users",
  ]) {
    schema.permissions.push({
      collection: collection,
      roleName: "collectivo_editor",
      action: action,
      fields: ["*"],
    });
  }
}
