import { DirectusField, NestedPartial } from "@directus/sdk";

export function directusNameField(
  collection: string,
  meta?: any,
): NestedPartial<DirectusField<any>> {
  return {
    collection: collection,
    field: "name",
    type: "string",
    schema: {
      is_nullable: false,
      is_unique: true,
    },
    meta: {
      sort: 1,
      required: true,
      translations: [
        { language: "en-US", translation: "Name" },
        { language: "de-DE", translation: "Name" },
      ],
      ...meta,
    },
  };
}

export function directusDescriptionField(collection: string, meta?: any) {
  return {
    collection: collection,
    field: "description",
    type: "text",
    schema: {},
    meta: { interface: "input-multiline", sort: 1, ...meta },
  };
}

export function directusNotesField(collection: string, meta?: any) {
  return {
    collection: collection,
    field: "notes",
    type: "text",
    schema: {},
    meta: {
      interface: "input-rich-text-md",
      ...meta,
    },
  };
}

export function directusStatusField(collection: string, meta?: any) {
  return {
    collection: collection,
    field: "status",
    type: "string",
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
      ...meta,
    },
    schema: { default_value: "draft", is_nullable: false },
  };
}

export function directusSystemFields(collection: string, meta?: any) {
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
        ...meta,
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
        ...meta,
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
        ...meta,
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
        ...meta,
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
