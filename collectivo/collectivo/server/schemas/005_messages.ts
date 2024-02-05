const schema = initSchema("collectivo", "0.0.1");

export default schema;

schema.collections = [
  {
    collection: "messages",
    meta: {
      sort: 500,
      icon: "mail",
      translations: [
        {
          language: "en-US",
          translation: "Messages",
          singular: "Message",
          plural: "Messages",
        },
        {
          language: "de-DE",
          translation: "Nachrichten",
          singular: "Nachricht",
          plural: "Nachrichten",
        },
      ],
    },
  },
  {
    collection: "messages_campaigns",
    schema: {
      name: "schema",
      comment: null,
    },
    meta: {
      sort: 90,
      group: "messages",
      icon: "campaign",
      display_template: "{{messages_template.name}}",
      translations: [
        {
          language: "en-US",
          translation: "Campaigns",
          singular: "Campaign",
          plural: "Campaigns",
        },
        {
          language: "de-DE",
          translation: "Kampagnen",
          singular: "Kampagne",
          plural: "Kampagnen",
        },
      ],
    },
  },
  {
    collection: "messages_messages",
    schema: {
      name: "schema",
      comment: null,
    },
    meta: {
      sort: 90,
      icon: "conveyor_belt",
      group: "messages",
      translations: [
        {
          language: "en-US",
          translation: "Messages",
          singular: "Message",
          plural: "Messages",
        },
        {
          language: "de-DE",
          translation: "Aufzeichnungen",
          singular: "Aufzeichnung",
          plural: "Aufzeichnungen",
        },
      ],
    },
  },
  {
    collection: "messages_templates",
    schema: {
      name: "schema",
      comment: null,
    },
    meta: {
      sort: 90,
      icon: "sticky_note_2",
      group: "messages",
      display_template: "{{name}}",
      translations: [
        {
          language: "en-US",
          translation: "Templates",
          singular: "Template",
          plural: "Templates",
        },
        {
          language: "de-DE",
          translation: "Vorlagen",
          singular: "Vorlage",
          plural: "Vorlagen",
        },
      ],
    },
  },
];

schema.fields = [
  ...directusSystemFields("messages_campaigns"),
  ...directusSystemFields("messages_messages"),
  ...directusSystemFields("messages_templates"),
  directusNameField("messages_templates", { width: "half" }),
  messageStatusField("messages_messages"),
  messageStatusField("messages_campaigns"),
  {
    collection: "messages_templates",
    field: "messages_method",
    type: "string",
    schema: {},
    meta: {
      interface: "select-dropdown",
      options: { choices: [{ text: "Email", value: "email" }] },
      sort: 2,
      width: "half",
      translations: [
        { language: "en-US", translation: "Method" },
        { language: "de-DE", translation: "Methode" },
      ],
      note: "The method that should be used to deliver the message.",
      required: true,
      default: "email",
    },
  },
  {
    collection: "messages_templates",
    field: "messages_subject",
    type: "string",
    meta: {
      sort: 10,
      required: true,
      translations: [
        { language: "en-US", translation: "Subject" },
        { language: "de-DE", translation: "Betreff" },
      ],
    },
  },

  {
    collection: "messages_templates",
    field: "messages_content",
    type: "text",
    schema: {},
    meta: {
      interface: "input-multiline",
      sort: 11,
      translations: [
        { language: "en-US", translation: "Content" },
        { language: "de-DE", translation: "Inhalt" },
      ],
    },
  },
];

for (const coll of ["messages_campaigns", "messages_messages"]) {
  schema.createForeignKey(coll, "messages_templates", {
    fieldKey: {
      field: "messages_template",
      meta: {
        required: true,
        display: "related-values",
        display_options: { template: "{{name}} ({{messages_method}})" },
        width: "half",
      },
    },
  });
}

schema.createForeignKey("messages_messages", "messages_campaigns", {
  fieldKey: {
    field: "messages_campaign",
    meta: {
      display: "raw",
      width: "half",
    },
  },
});

schema.createM2MRelation("messages_campaigns", "directus_users", {
  m2mFieldType2: "uuid",
  field1: {
    field: "messages_recipients",
    meta: {
      options: {
        enableCreate: false,
        fields: [
          "directus_users_id.first_name",
          "directus_users_id.last_name",
          "directus_users_id.email",
        ],
        layout: "table",
      },
      display: "related-values",
      display_options: { template: "{{directus_users_id.email}}" },
    },
  },
  field2: true,
});

// @ts-ignore
const operation = {
  id: "???",
  flow: "???",
  name: "Send email",
  key: "send_email",
  type: "mail",
  options: {
    body: "{{ template.messages_content }}",
    subject: "{{ template.messages_subject }}",
    to: ["{{ recipient.email }}"],
  },
};

schema.flows = [
  {
    flow: {
      name: "messages_create_messages_from_campaign",
      icon: "conveyor_belt",
      description: "Creates the individual messages to execute a campaign",
      status: "active",
      trigger: "event",
      accountability: "all",
      options: {
        type: "action",
        scope: ["items.create"],
        collections: ["messages_campaigns"],
      },
    },
    firstOperation: "messages_expaned_campaign_to_messages",
    operations: [
      {
        operation: {
          name: "messages_expaned_campaign_to_messages",
          key: "messages_expaned_campaign_to_messages",
          type: "exec",
          position_x: 19,
          position_y: 1,
          options: {
            code: 'module.exports = async function(data) {\n    campaign = data["$trigger"].payload;\n\tmessagesToCreate = [];\n    for (i in data["$trigger"].payload.messages_recipients.create) {\n        recipient = data["$trigger"].payload.messages_recipients.create[i]\n        messagesToCreate.push({\n            "messages_campaign": data["$trigger"].key,\n            "recipient": recipient.directus_users_id.id\n        });\n    }\n\treturn {messagesToCreate};\n}',
          },
        },
        resolve: "messages_store_individual_messages_in_messages",
      },
      {
        operation: {
          name: "messages_store_individual_messages_in_messages",
          key: "messages_store_individual_messages_in_messages",
          type: "item-create",
          position_x: 37,
          position_y: 1,
          options: {
            collection: "messages_messages",
            emitEvents: true,
            payload: "{{$last.messagesToCreate}}",
          },
        },
      },
    ],
  },
  {
    flow: {
      name: "messages_send_email_message",
      icon: "outgoing_mail",
      color: null,
      description: "Send a message by email",
      status: "active",
      trigger: "event",
      accountability: "all",
      options: {
        type: "action",
        scope: ["items.create"],
        collections: ["messages_messages"],
      },
    },
    firstOperation: "read_campaign_data",
    operations: [
      {
        operation: {
          name: "Read campaign data",
          key: "read_campaign_data",
          type: "item-read",
          position_x: 19,
          position_y: 1,
          options: {
            collection: "messages_campaigns",
            key: "{{$trigger.payload.messages_campaign}}",
            query: null,
          },
        },
        resolve: "read_template_data",
        reject: "",
      },
      {
        operation: {
          name: "Read template data",
          key: "read_template_data",
          type: "item-read",
          position_x: 37,
          position_y: 1,
          options: {
            collection: "messages_templates",
            key: "{{read_campaign_data.messages_template}}",
          },
        },
        resolve: "read_recipient_data",
        reject: "",
      },
      {
        operation: {
          name: "Read recipient data",
          key: "read_recipient_data",
          type: "item-read",
          position_x: 55,
          position_y: 1,
          options: {
            query: {
              fields: ["first_name", "last_name", "email"],
            },
            collection: "directus_users",
            key: "{{$trigger.payload.recipient}}",
          },
        },
        resolve: "render_message",
        reject: "",
      },
      {
        operation: {
          name: "Render message",
          key: "render_message",
          type: "exec",
          position_x: 73,
          position_y: 1,
          options: {
            code: 'module.exports = async function(data) {\n    template = data["read_template_data"].messages_content;\n    first_name = data["read_recipient_data"].first_name;\n    last_name = data["read_recipient_data"].last_name;\n    \n    rendered_message = template;\n    \n    rendered_message = rendered_message.replaceAll("{"+"{recipient_first_name}}", first_name);\n    rendered_message = rendered_message.replaceAll("{"+"{recipient_last_name}}", last_name);\n    \n\treturn {rendered_message};\n}',
          },
        },
        resolve: "send_email",
        reject: "",
      },
      {
        operation: {
          name: "Send email",
          key: "send_email",
          type: "mail",
          position_x: 91,
          position_y: 1,
          options: {
            subject: "{{read_template_data.messages_subject}}",
            body: "{{render_message.rendered_message}}",
            to: "{{read_recipient_data.email}}",
          },
        },
        resolve: "",
        reject: "",
      },
    ],
  },
];

function messageStatusField(collection: string) {
  return {
    collection: collection,
    field: "messages_status",
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
            text: "$t:sent",
            value: "sent",
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
          { text: "$t:sent", value: "sent" },
        ],
      },
      translations: [
        { language: "de-DE", translation: "Status" },
        { language: "en-US", translation: "Status" },
      ],
    },
    schema: { is_nullable: false, default_value: "draft" },
  };
}
