const schema = initSchema("memberships", "0.0.1");

export default schema;

schema.dependencies = [
  { extension: "collectivo", version: "0.0.1" },
  { extension: "payments", version: "0.0.1" },
];

schema.collections = [
  {
    collection: "memberships",
    schema: {
      schema: "schema",
      name: "schema",
      comment: null,
    },
    meta: {
      sort: 100,
      icon: "switch_account",
      archive_field: "memberships_status",
      archive_value: "ended",
      unarchive_value: "draft",
      display_template: "{{memberships_user}} - {{memberships_type}}",
      translations: [
        {
          language: "en-US",
          translation: "Memberships",
          singular: "Membership",
          plural: "Memberships",
        },
        {
          language: "de-DE",
          translation: "Mitgliedschaften",
          singular: "Mitgliedschaft",
          plural: "Mitgliedschaften",
        },
      ],
    },
  },
  {
    collection: "memberships_types",
    schema: { name: "memberships_types" },
    meta: {
      sort: 10,
      group: "collectivo_settings",
      icon: "switch_account",
      display_template: "{{name}}",
      translations: [
        {
          language: "en-US",
          translation: "Member types",
          singular: "Member type",
          plural: "Member types",
        },
        {
          language: "de-DE",
          translation: "Mitgliedsarten",
          singular: "Mitgliedsart",
          plural: "Mitgliedsarten",
        },
      ],
    },
  },
];

schema.fields = [
  {
    collection: "memberships",
    field: "memberships_status",
    type: "string",
    meta: {
      sort: 10,
      interface: "select-dropdown",
      display: "labels",
      display_options: {
        choices: [
          {
            text: "$t:approved",
            value: "approved",
            foreground: "#FFFFFF",
            background: "#2CB3A5",
          },
          {
            text: "$t:applied",
            value: "applied",
            foreground: "#FFFFFF",
            background: "#aa4abc",
          },
          {
            text: "$t:in-cancellation",
            value: "in-cancellation",
            foreground: "#FFFFFF",
            background: "#d94c4c",
          },
          {
            text: "$t:in-exclusion",
            value: "in-exclusion",
            foreground: "#FFFFFF",
            background: "#d94c4c",
          },
          {
            text: "$t:ended",
            value: "ended",
            foreground: "#FFFFFF",
            background: "#d94c4c",
          },
        ],
      },
      width: "half",
      note: "$t:memberships-status-note",
      options: {
        choices: [
          { text: "$t:draft", value: "draft" },
          { text: "$t:applied", value: "applied" },
          { text: "$t:approved", value: "approved" },
          { text: "$t:in-cancellation", value: "in-cancellation" },
          { text: "$t:in-exclusion", value: "in-exclusion" },
          { text: "$t:ended", value: "ended" },
        ],
      },
    },
    schema: { is_nullable: false, default_value: "draft" },
  },
  {
    collection: "memberships",
    field: "memberships_date_applied",
    type: "date",
    meta: {
      interface: "datetime",
      width: "half",
      translations: [
        { language: "de-DE", translation: "Datum Beworben" },
        { language: "en-US", translation: "Date Applied" },
      ],
    },
  },
  {
    collection: "memberships",
    field: "memberships_date_approved",
    type: "date",
    meta: {
      interface: "datetime",
      width: "half",
      translations: [
        { language: "de-DE", translation: "Datum Angenommen" },
        { language: "en-US", translation: "Date Approved" },
      ],
    },
  },
  {
    collection: "memberships",
    field: "memberships_date_cancelled",
    type: "date",
    schema: {},
    meta: {
      interface: "datetime",
      width: "half",
      translations: [
        { language: "de-DE", translation: "Datum Ausgestiegen" },
        { language: "en-US", translation: "Date Cancelled" },
      ],
    },
  },
  {
    collection: "memberships",
    field: "memberships_date_excluded",
    type: "date",
    schema: {},
    meta: {
      interface: "datetime",
      width: "half",
      translations: [
        { language: "de-DE", translation: "Datum Ausgeschlossen" },
        { language: "en-US", translation: "Date Excluded" },
      ],
    },
  },
  {
    collection: "memberships",
    field: "memberships_date_ended",
    type: "date",
    schema: {},
    meta: {
      interface: "datetime",
      width: "half",
      translations: [
        { language: "de-DE", translation: "Datum Beendet" },
        { language: "en-US", translation: "Date Ended" },
      ],
    },
  },
  {
    collection: "memberships",
    field: "memberships_shares",
    type: "integer",
    schema: {
      is_nullable: false,
      default_value: 0,
    },
    meta: {
      interface: "input",
      width: "half",
      translations: [
        { language: "de-DE", translation: "Anteile" },
        { language: "en-US", translation: "Shares" },
      ],
    },
  },

  // Membership Types
  directusNameField("memberships_types"),
  directusDescriptionField("memberships_types"),

  // System fields for both collections
  ...directusSystemFields("memberships"),
  ...directusSystemFields("memberships_types"),
];

schema.createForeignKey("memberships", "directus_users", {
  fieldKey: {
    field: "memberships_user",
    type: "uuid",
    schema: {
      is_nullable: false,
    },
    meta: {
      interface: "select-dropdown-m2o",
      special: ["m2o"],
      width: "half",
      required: true,
      display: "related-values",
      display_options: {
        template: "{{first_name}} {{last_name}}",
      },
      translations: [
        { language: "de-DE", translation: "Person" },
        { language: "en-US", translation: "Person" },
      ],
    },
  },
});

schema.createForeignKey("memberships", "memberships_types", {
  fieldKey: {
    field: "memberships_type",
    schema: {
      is_nullable: false,
    },
    meta: {
      interface: "select-dropdown-m2o",
      special: ["m2o"],
      width: "half",
      required: true,
      display: "related-values",
      display_options: {
        template: "{{name}}",
      },
      translations: [
        { language: "de-DE", translation: "Typ" },
        { language: "en-US", translation: "Type" },
      ],
    },
  },
});

schema.createForeignKey("memberships_types", "payments_items", {
  fieldKey: {
    field: "memberships_shares_item",
    meta: {
      translations: [
        { language: "de-DE", translation: "Anteile Item" },
        { language: "en-US", translation: "Shares Item" },
      ],
    },
  },
});

// Add a relation to the payments extension
schema.fields.push(
  ...[
    {
      collection: "memberships",
      field: "memberships_invoices",
      type: "alias",
      meta: {
        interface: "list-o2m",
        special: ["o2m"],
        width: "half",
        translations: [
          { language: "de-DE", translation: "Rechnungen" },
          { language: "en-US", translation: "Invoices" },
        ],
      },
    },
    {
      collection: "payments_invoices_out",
      field: "memberships_membership",
      type: "integer",
      meta: {
        hidden: true,
      },
    },
  ],
);

schema.relations.push(
  ...[
    {
      collection: "payments_invoices_out",
      field: "memberships_membership",
      related_collection: "memberships",
      meta: {
        one_field: "memberships_invoices",
        sort_field: null,
        one_deselect_action: "nullify",
      },
      schema: { on_delete: "SET NULL" },
    },
  ],
);

// # Flows
schema.flows.push({
  flow: {
    name: "memberships_create_invoice_for_shares",
    icon: "receipt",
    status: "active",
    trigger: "event",
    accountability: "all",
    options: {
      type: "action",
      scope: ["items.create"],
      collections: ["memberships"],
    },
  },
  firstOperation: "updateMembership",
  operations: [
    {
      operation: {
        name: "updateMembership",
        key: "updateMembership",
        type: "item-update",
        position_x: 19,
        position_y: 1,
        options: {
          collection: "memberships",
          payload: {
            memberships_shares: "{{$trigger.payload.memberships_shares}}",
          },
          emitEvents: true,
          key: ["{{$trigger.key}}"],
        },
      },
    },
  ],
});

schema.flows.push({
  flow: {
    name: "memberships_update_invoice_for_shares",
    icon: "receipt",
    status: "active",
    trigger: "event",
    accountability: "all",
    options: {
      type: "filter",
      scope: ["items.update"],
      collections: ["memberships"],
    },
  },
  firstOperation: "checkHasShares",
  operations: [
    {
      operation: {
        name: "checkHasShares",
        key: "checkHasShares",
        type: "exec",
        position_x: 19,
        position_y: 1,
        options: {
          code: 'module.exports = async function(data) {\n\tconsole.log("prepareInvoice")\n\tconsole.log(data["$trigger"])\n\tif (!("memberships_shares" in data["$trigger"].payload)) {\n\t\tthrow new Error("No shares in payload")\n    }\n\treturn {}\n}',
        },
      },
      resolve: "checkIsBulk",
      reject: "endFlowWithoutBlocking",
    },
    {
      operation: {
        name: "endFlowWithoutBlocking",
        key: "endFlowWithoutBlocking",
        type: "exec",
        position_x: 3,
        position_y: 20,
        options: {
          code: 'module.exports = async function(data) {\n\t// Do nothing, just to let the reject path pass without blocking\n    console.log("has no shares")\n\treturn {};\n}',
        },
      },
    },
    {
      operation: {
        name: "checkIsBulk",
        key: "checkIsBulk",
        type: "exec",
        position_x: 37,
        position_y: 1,
        options: {
          code: 'module.exports = async function(data) {\n\tif (data["$trigger"].keys.length != 1) {\n\t\tconsole.log("multiple keys in payload")\n    \tthrow new Error("Memberships invoice flow: Cannot bulk edit shares")\n\t}\n\treturn {}\n}',
        },
      },
      resolve: "readMembership",
    },
    {
      operation: {
        name: "readMembership",
        key: "readMembership",
        type: "item-read",
        position_x: 20,
        position_y: 20,
        options: {
          collection: "memberships",
          key: ["{{$trigger.keys[0]}}"],
          permissions: "$full",
          query: {
            fields: [
              "memberships_user",
              "memberships_type.memberships_shares_item.*",
            ],
          },
        },
      },
      resolve: "readSharesEntries",
    },
    {
      operation: {
        name: "readSharesEntries",
        key: "readSharesEntries",
        type: "item-read",
        position_x: 37,
        position_y: 20,
        options: {
          collection: "payments_invoices_entries",
          query: {
            filter: {
              payments_invoice: {
                memberships_membership: "{{$trigger.keys[0]}}",
              },
              payments_item:
                "{{readMembership.memberships_type.memberships_shares_item.id}}",
            },
          },
        },
      },
      resolve: "calcShares",
    },
    {
      operation: {
        name: "calcShares",
        key: "calcShares",
        type: "exec",
        position_x: 3,
        position_y: 38,
        options: {
          code: 'module.exports = async function(data) {\n\tconsole.log("calcShares")\n    let sharesInvoiced = 0\n    console.log(data["readSharesEntries"])\n    for (i in data["readSharesEntries"]) {\n        entry = data["readSharesEntries"][i]\n        console.log("entry", entry)\n    \tsharesInvoiced = sharesInvoiced + entry.payments_quantity\n\t}\n\tsharesTotal = data["$trigger"].payload.memberships_shares\n\tsharesToBeInvoiced = sharesTotal - sharesInvoiced\n\tconsole.log("sharesToBeInvoiced", sharesToBeInvoiced)\n\treturn {sharesToBeInvoiced};\n}',
        },
      },
      resolve: "createInvoice",
    },
    {
      operation: {
        name: "createInvoice",
        key: "createInvoice",
        type: "item-create",
        position_x: 21,
        position_y: 38,
        options: {
          collection: "payments_invoices_out",
          permissions: "$full",
          payload: {
            payments_recipient_user: "{{readMembership.memberships_user}}",
            payments_status: "pending",
            memberships_membership: "{{$trigger.keys[0]}}",
          },
        },
      },
      resolve: "createInvoiceEntries",
    },
    {
      operation: {
        name: "createInvoiceEntries",
        key: "createInvoiceEntries",
        type: "item-create",
        position_x: 41,
        position_y: 38,
        options: {
          collection: "payments_invoices_entries",
          permissions: "$full",
          payload: {
            payments_invoice: "{{createInvoice[0]}}",
            payments_item:
              "{{readMembership.memberships_type.memberships_shares_item.id}}",
            payments_quantity: "{{calcShares.sharesToBeInvoiced}}",
            payments_price:
              "{{readMembership.memberships_type.memberships_shares_item.payments_price}}",
          },
        },
      },
    },
  ],
});

// ----------------------------------------------------------------------------
// Permissions ----------------------------------------------------------------
// ----------------------------------------------------------------------------

schema.permissions = [
  {
    collection: "memberships",
    roleName: "collectivo_editor",
    action: "read",
    fields: ["*"],
  },
  {
    collection: "memberships",
    roleName: "collectivo_editor",
    action: "update",
    fields: ["*"],
  },
  {
    collection: "memberships_types",
    roleName: "collectivo_editor",
    action: "read",
    fields: ["*"],
  },
];

// ----------------------------------------------------------------------------
// Translations ---------------------------------------------------------------
// ----------------------------------------------------------------------------

schema.translations = [
  { language: "de-DE", key: "applied", value: "Beworben" },
  { language: "de-DE", key: "approved", value: "Aufgenommen" },
  {
    language: "de-DE",
    key: "in-cancellation",
    value: "Im Ausstieg",
  },
  {
    language: "de-DE",
    key: "in-exclusion",
    value: "Im Ausschluss",
  },
  { language: "de-DE", key: "ended", value: "Beendet" },

  { language: "en-US", key: "applied", value: "Applied" },
  { language: "en-US", key: "approved", value: "Approved" },
  {
    language: "en-US",
    key: "in-cancellation",
    value: "In cancellation",
  },
  {
    language: "en-US",
    key: "in-exclusion",
    value: "In exclusion",
  },
  { language: "en-US", key: "ended", value: "Ended" },

  {
    language: "de-DE",
    key: "memberships-status-note",
    value:
      "Bezeichnet den Lebenszyklus einer Mitgliedschaft von der Bewerbung bis zum Ende. Der Ausstieg erfolgt durch das Mitglied, der Ausschluss durch die Organisation. Während des Ausstiegs- oder Ausschlussverfahrens sind die Mitgliedschaften weiterhin aktiv. Wenn dieser Vorgang abgeschlossen ist, sollte der Status auf 'Beendet' gesetzt werden.",
  },
  {
    language: "en-US",
    key: "memberships-status-note",
    value:
      "Signifies the lifecycle of a membership from applied to ended. Cancellation is initiated by the member, exclusion is initiated by the organisation. During the process of cancellation or exclusion, memberships are still active. When this process is finished, the status should be set to 'Ended'.",
  },
];
