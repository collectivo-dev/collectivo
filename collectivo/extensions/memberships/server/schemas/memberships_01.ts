const schema = initSchema("memberships", "0.0.1");

export default schema;

export enum MembershipStatus {
  DRAFT = "draft",
  APPLIED = "applied",
  APPROVED = "approved",
  IN_CANCELLATION = "in-cancellation",
  IN_EXCLUSION = "in-exclusion",
  ENDED = "ended",
}

export const ACTIVE_MEMBERSHIP_STATUSES = [
  MembershipStatus.APPROVED,
  MembershipStatus.IN_CANCELLATION,
  MembershipStatus.IN_EXCLUSION,
];

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
      display_template:
        "{{memberships_user}} - {{memberships_type.memberships_name}}",
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
            value: MembershipStatus.APPROVED,
            foreground: "#FFFFFF",
            background: "#2CB3A5",
          },
          {
            text: "$t:applied",
            value: MembershipStatus.APPLIED,
            foreground: "#FFFFFF",
            background: "#aa4abc",
          },
          {
            text: "$t:in-cancellation",
            value: MembershipStatus.IN_CANCELLATION,
            foreground: "#FFFFFF",
            background: "#d94c4c",
          },
          {
            text: "$t:in-exclusion",
            value: MembershipStatus.IN_EXCLUSION,
            foreground: "#FFFFFF",
            background: "#d94c4c",
          },
          {
            text: "$t:ended",
            value: MembershipStatus.ENDED,
            foreground: "#FFFFFF",
            background: "#d94c4c",
          },
        ],
      },
      width: "half",
      note: "$t:memberships-status-note",
      options: {
        choices: [
          { text: "$t:draft", value: MembershipStatus.DRAFT },
          { text: "$t:applied", value: MembershipStatus.APPLIED },
          { text: "$t:approved", value: MembershipStatus.APPROVED },
          {
            text: "$t:in-cancellation",
            value: MembershipStatus.IN_CANCELLATION,
          },
          { text: "$t:in-exclusion", value: MembershipStatus.IN_EXCLUSION },
          { text: "$t:ended", value: MembershipStatus.ENDED },
        ],
      },
    },
    schema: { is_nullable: false, default_value: MembershipStatus.DRAFT },
  },
  {
    collection: "memberships",
    field: "memberships_type",
    type: "string",
    meta: {
      sort: 10,
      interface: "select-dropdown",
      display: "labels",
      display_options: {
        choices: [
          {
            text: "$t:Normal membership",
            value: "normal",
            foreground: "#FFFFFF",
            background: "#2CB3A5",
          },
        ],
      },
      width: "half",
      options: {
        choices: [{ text: "$t:Normal membership", value: "normal" }],
      },
      translations: [
        { language: "de-DE", translation: "Art" },
        { language: "en-US", translation: "Type" },
      ],
    },

    schema: { is_nullable: false, default_value: "normal" },
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

  ...directusSystemFields("memberships"),
];

schema.createForeignKey("memberships", "directus_users", {
  fieldKey: {
    field: "memberships_user",
    type: "uuid",
    schema: {
      is_nullable: false,
      is_unique: true,
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
  fieldAlias: {
    field: "memberships",
    type: "alias",
    meta: {
      special: ["o2m"],
      interface: "list-o2m",
      display: "related-values",
      options: {
        layout: "list",
        enableCreate: false,
        enableSelect: false,
        enableLink: true,
      },
      translations: [
        { language: "de-DE", translation: "Mitgliedschaften" },
        { language: "en-US", translation: "Memberships" },
      ],
    },
    collection: "directus_users",
  },
});

// ----------------------------------------------------------------------------
// Flows ----------------------------------------------------------------------
// ----------------------------------------------------------------------------

schema.flows.push({
  flow: {
    name: "memberships_send_messages",
    icon: "conveyor_belt",
    status: "active",
    accountability: "all",
    trigger: "manual",
    options: {
      collections: ["memberships"],
      requireConfirmation: true,
      fields: [
        {
          field: "template",
          name: "Template",
          type: "json",
          meta: {
            interface: "collection-item-dropdown",
            options: {
              selectedCollection: "messages_templates",
              template: "{{name}}",
            },
            required: true,
          },
        },
      ],
      confirmationDescription: "Please choose a template",
    },
  },
  firstOperation: "readMemberships",
  operations: [
    {
      operation: {
        name: "readMemberships",
        key: "readMemberships",
        type: "item-read",
        position_x: 1,
        position_y: 17,
        options: {
          collection: "memberships",
          query: {
            fields: ["memberships_user"],
            filter: { id: { _in: "{{$trigger.body.keys}}" } },
          },
        },
      },
      resolve: "prepareRecipients",
    },
    {
      operation: {
        name: "prepareRecipients",
        key: "prepareRecipients",
        type: "exec",
        position_x: 17,
        position_y: 17,
        options: {
          code: 'module.exports = async function(data) {\n\tconst recipients = []\n    for (i in data["readMemberships"]) {\n \trecipients.push(\n            {\n                messages_campaigns_id: "+",\n           \t\tdirectus_users_id: { id: data["readMemberships"][i].memberships_user }\n            }\n        )\n    }\n\treturn { recipients };\n}',
        },
      },
      resolve: "createCampaign",
    },
    {
      operation: {
        name: "createCampaign",
        key: "createCampaign",
        type: "item-create",
        position_x: 35,
        position_y: 17,
        options: {
          collection: "messages_campaigns",
          permissions: "$full",
          emitEvents: true,
          payload: {
            messages_recipients: "{{prepareRecipients.recipients}}",
            messages_template: "{{$trigger.body.template.key}}",
          },
        },
      },
    },
  ],
});

// ----------------------------------------------------------------------------
// Permissions ----------------------------------------------------------------
// ----------------------------------------------------------------------------

for (const action of ["create", "read", "update", "delete"]) {
  schema.permissions.push({
    collection: "memberships",
    roleName: "collectivo_editor",
    action: action,
    fields: ["*"],
  });
}

schema.permissions.push({
  collection: "directus_users",
  roleName: "collectivo_user",
  action: "read",
  fields: ["memberships"],
});

schema.permissions.push({
  collection: "directus_users",
  roleName: "collectivo_editor",
  action: "read",
  fields: ["memberships"],
});

schema.permissions.push({
  collection: "memberships",
  roleName: "collectivo_user",
  permissions: { _and: [{ memberships_user: { _eq: "$CURRENT_USER" } }] },
  action: "read",
  fields: ["*"],
});

// ----------------------------------------------------------------------------
// Translations ---------------------------------------------------------------
// ----------------------------------------------------------------------------

schema.translations = [
  { language: "de-DE", key: MembershipStatus.APPLIED, value: "Beworben" },
  { language: "de-DE", key: MembershipStatus.APPROVED, value: "Aufgenommen" },
  {
    language: "de-DE",
    key: MembershipStatus.IN_CANCELLATION,
    value: "Im Ausstieg",
  },
  {
    language: "de-DE",
    key: MembershipStatus.IN_EXCLUSION,
    value: "Im Ausschluss",
  },
  { language: "de-DE", key: MembershipStatus.ENDED, value: "Beendet" },

  { language: "en-US", key: MembershipStatus.APPLIED, value: "Applied" },
  { language: "en-US", key: MembershipStatus.APPROVED, value: "Approved" },
  {
    language: "en-US",
    key: MembershipStatus.IN_CANCELLATION,
    value: "In cancellation",
  },
  {
    language: "en-US",
    key: MembershipStatus.IN_EXCLUSION,
    value: "In exclusion",
  },
  { language: "en-US", key: MembershipStatus.ENDED, value: "Ended" },

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
