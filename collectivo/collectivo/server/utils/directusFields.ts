import { DirectusField, NestedPartial } from "@directus/sdk";

type PartialField = NestedPartial<DirectusField<any>>;

export function directusStatusField(
  collection: string,
  fieldName: string,
  field?: PartialField,
) {
  return {
    collection: collection,
    field: fieldName,
    type: "string",
    ...field,
    meta: {
      width: "full",
      options: {
        choices: [
          { text: "$t:published", value: "published" },
          { text: "$t:draft", value: "draft" },
          { text: "$t:archived", value: "archived" },
        ],
      },
      sort: 10,
      interface: "select-dropdown",
      display: "labels",
      display_options: {
        showAsDot: true,
        choices: [
          {
            text: "$t:published",
            value: "published",
            foreground: "#FFFFFF",
            background: "var(--primary)",
          },
          {
            text: "$t:draft",
            value: "draft",
            foreground: "#18222F",
            background: "#D3DAE4",
          },
          {
            text: "$t:archived",
            value: "archived",
            foreground: "#FFFFFF",
            background: "var(--warning)",
          },
        ],
      },
      ...field?.meta,
    },
    schema: { default_value: "draft", is_nullable: false },
  };
}

export function directusSystemFields(collection: string) {
  return [
    {
      collection: collection,
      field: "user_created",
      type: "uuid",
      meta: {
        special: ["user-created"],
        interface: "select-dropdown-m2o",
        options: {
          template: "{{avatar.$thumbnail}} {{first_name}} {{last_name}}",
        },
        display: "user",
        readonly: true,
        hidden: true,
        width: "half",
      },
      schema: {},
    },
    {
      collection: collection,
      field: "date_created",
      type: "timestamp",
      meta: {
        special: ["date-created"],
        interface: "datetime",
        readonly: true,
        hidden: true,
        width: "half",
        display: "datetime",
        display_options: { relative: true },
      },
      schema: {},
    },
    {
      collection: collection,
      field: "user_updated",
      type: "uuid",
      meta: {
        special: ["user-updated"],
        interface: "select-dropdown-m2o",
        options: {
          template: "{{avatar.$thumbnail}} {{first_name}} {{last_name}}",
        },
        display: "user",
        readonly: true,
        hidden: true,
        width: "half",
      },
      schema: {},
    },
    {
      collection: collection,
      field: "date_updated",
      type: "timestamp",
      meta: {
        special: ["date-updated"],
        interface: "datetime",
        readonly: true,
        hidden: true,
        width: "half",
        display: "datetime",
        display_options: { relative: true },
      },
      schema: {},
    },
  ];
}

export function directusSortField(collection: string) {
  return {
    collection: collection,
    field: "sort",
    type: "integer",
    meta: { interface: "input", hidden: true },
    schema: {},
  };
}
