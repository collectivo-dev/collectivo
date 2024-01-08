const schema = initSchema("payments", "0.0.1");

export default schema;

schema.collections = [
  {
    collection: "payments",
    meta: {
      sort: 100,
      icon: "payments",
    },
  },
  {
    collection: "payments_items",
    schema: {
      schema: "schema",
      name: "schema",
      comment: null,
    },
    meta: {
      group: "payments",
      sort: 100,
      icon: "bubble_chart",
      translations: [
        {
          language: "en-US",
          translation: "Items",
          singular: "Item",
          plural: "Item",
        },
        {
          language: "de-DE",
          translation: "Artikel",
          singular: "Artikel",
          plural: "Artikel",
        },
      ],
    },
  },
  {
    collection: "payments_invoices_entries",
    schema: {
      schema: "schema",
      name: "schema",
      comment: null,
    },
    meta: {
      group: "payments",
      hidden: true,
      sort: 100,
      icon: "receipt",
      translations: [
        {
          language: "en-US",
          translation: "Entries",
          singular: "Entry",
          plural: "Entries",
        },
        {
          language: "de-DE",
          translation: "Posten",
          singular: "Posten",
          plural: "Posten",
        },
      ],
    },
  },
  {
    collection: "payments_invoices_out",
    schema: {
      schema: "schema",
      name: "schema",
      comment: null,
    },
    meta: {
      group: "payments",
      sort: 100,
      icon: "receipt",
      translations: [
        {
          language: "en-US",
          translation: "Invoices Out",
          singular: "Invoice Out",
          plural: "Invoices Out",
        },
        {
          language: "de-DE",
          translation: "Ausgangsrechnungen",
          singular: "Ausgangsrechnung",
          plural: "Ausgangsrechnungen",
        },
      ],
    },
  },
];

schema.fields = [
  ...directusSystemFields("payments_items"),
  directusNameField("payments_items"),

  // Invoices out
  ...directusSystemFields("payments_invoices_out"),
  ...directusSystemFields("payments_invoices_entries"),
  {
    collection: "payments_invoices_out",
    field: "payments_entries",
    type: "alias",
    meta: {
      interface: "list-o2m",
      special: ["o2m"],
      options: {
        enableSelect: false,
        template:
          "{{payments_item.name}}:{{payments_quantity}}*{{payments_price}}",
      },
      display: "related-values",
      display_options: {
        template:
          "{{payments_item.name}}: {{payments_quantity}}*{{payments_price}}",
      },
      translations: [
        { language: "de-DE", translation: "Posten" },
        { language: "en-US", translation: "Entries" },
      ],
    },
  },
  {
    collection: "payments_invoices_out",
    field: "payments_status",
    type: "string",
    meta: {
      sort: 10,
      interface: "select-dropdown",
      display: "labels",
      display_options: {
        choices: [
          {
            text: "$t:draft",
            value: "draft",
            foreground: "#FFFFFF",
            background: "#666666",
          },
          {
            text: "$t:pending",
            value: "pending",
            foreground: "#FFFFFF",
            background: "#CC6600",
          },
          {
            text: "$t:failed",
            value: "failed",
            foreground: "#FFFFFF",
            background: "#800000",
          },
          {
            text: "$t:cancelled",
            value: "cancelled",
            foreground: "#FFFFFF",
            background: "#8000FF",
          },
          {
            text: "$t:paid",
            value: "paid",
            foreground: "#FFFFFF",
            background: "#008000",
          },
        ],
      },
      width: "half",
      options: {
        choices: [
          { text: "$t:draft", value: "draft" },
          { text: "$t:pending", value: "pending" },
          { text: "$t:failed", value: "failed" },
          { text: "$t:cancelled", value: "cancelled" },
          { text: "$t:paid", value: "paid" },
        ],
      },
      translations: [
        { language: "de-DE", translation: "Status" },
        { language: "en-US", translation: "Status" },
      ],
    },
    schema: { is_nullable: false, default_value: "draft" },
  },
  {
    collection: "payments_invoices_out",
    field: "payments_recipient_user",
    type: "uuid",
    schema: {},
    meta: {
      interface: "select-dropdown-m2o",
      special: ["m2o"],
      width: "half",
      display: "related-values",
      display_options: {
        template: "{{first_name}} {{last_name}}",
      },
      translations: [
        { language: "de-DE", translation: "Empfänger*in" },
        { language: "en-US", translation: "Recipient" },
      ],
    },
  },
  {
    collection: "payments_invoices_out",
    field: "payments_date_issued",
    type: "date",
    meta: {
      interface: "datetime",
      width: "half",
      translations: [
        { language: "de-DE", translation: "Datum Ausgestellt" },
        { language: "en-US", translation: "Date Issued" },
      ],
    },
  },
  {
    collection: "payments_invoices_out",
    field: "payments_date_paid",
    type: "date",
    meta: {
      interface: "datetime",
      width: "half",
      translations: [
        { language: "de-DE", translation: "Datum Bezahlt" },
        { language: "en-US", translation: "Date Paid" },
      ],
    },
  },

  // Invoice entries
  {
    collection: "payments_invoices_entries",
    field: "payments_invoice",
    type: "integer",
    schema: {},
    meta: { interface: "select-dropdown-m2o", hidden: true },
  },
  {
    collection: "payments_invoices_entries",
    field: "payments_item",
    type: "integer",
    meta: {
      interface: "select-dropdown-m2o",
      special: ["m2o"],
      display: "related-values",
      display_options: {
        template: "{{name}}",
      },
      options: {
        enableSelect: true,
        template: "{{name}}",
      },
      width: "half",
      translations: [
        { language: "de-DE", translation: "Artikel" },
        { language: "en-US", translation: "Item" },
      ],
    },
  },
  {
    collection: "payments_invoices_entries",
    field: "payments_quantity",
    type: "integer",
    meta: {
      interface: "input",
      required: true,
      width: "half",
      translations: [
        { language: "de-DE", translation: "Menge" },
        { language: "en-US", translation: "Quantity" },
      ],
    },
  },
  {
    collection: "payments_invoices_entries",
    field: "payments_price",
    type: "integer", // prices always in cents
    meta: {
      interface: "input",
      required: true,
      width: "half",
      translations: [
        { language: "de-DE", translation: "Preis" },
        { language: "en-US", translation: "Price" },
      ],
    },
  },
];

schema.translations = [
  { language: "de-DE", key: "pending", value: "Ausstehend" },
  { language: "de-DE", key: "failed", value: "Fehlgeschlagen" },
  { language: "de-DE", key: "cancelled", value: "Abgebrochen" },
  { language: "de-DE", key: "paid", value: "Bezahlt" },
  { language: "en-US", key: "pending", value: "Pending" },
  { language: "en-US", key: "failed", value: "Failed" },
  { language: "en-US", key: "cancelled", value: "Cancelled" },
  { language: "en-US", key: "paid", value: "Paid" },
];

schema.relations = [
  {
    collection: "payments_invoices_out",
    field: "payments_recipient_user",
    related_collection: "directus_users",
    meta: { sort_field: null },
    schema: { on_delete: "SET NULL" },
  },
  {
    collection: "payments_invoices_entries",
    field: "payments_item",
    related_collection: "payments_items",
    meta: { sort_field: null },
    schema: { on_delete: "NO ACTION" }, // Cannot delete items that have been used in invoices
  },
  {
    collection: "payments_invoices_entries",
    field: "payments_invoice",
    related_collection: "payments_invoices_out",
    meta: {
      one_field: "payments_entries",
      sort_field: null,
      one_deselect_action: "delete",
    },
    schema: { on_delete: "CASCADE" },
  },
];

schema.permissions = [];
