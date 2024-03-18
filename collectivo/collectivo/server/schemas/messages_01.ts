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
      display_template:
        "{{messages_template.messages_name}} ({{messages_template.messages_method}})",
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
      display_template: "{{messages_name}} ({{messages_method}})",
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
  {
    collection: "messages_campaigns",
    field: "messages_campaign_status",
    type: "string",
    meta: {
      sort: 10,
      required: true,
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
            text: "$t:partially_failed",
            value: "partially failed",
            foreground: "#FFFFFF",
            background: "#800000",
          },
          {
            text: "$t:completely_failed",
            value: "completely failed",
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
          { text: "$t:partially_failed", value: "partially failed" },
          { text: "$t:completely_failed", value: "completely failed" },
          { text: "$t:sent", value: "sent" },
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
    collection: "messages_messages",
    field: "messages_message_status",
    type: "string",
    meta: {
      sort: 10,
      required: true,
      interface: "select-dropdown",
      display: "labels",
      display_options: {
        choices: [
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
    schema: { is_nullable: false, default_value: "pending" },
  },
  {
    collection: "messages_templates",
    field: "messages_name",
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
    },
  },
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

schema.createForeignKey("messages_messages", "messages_campaigns", {
  fieldKey: {
    field: "messages_campaign",
    meta: {
      display: "raw",
      width: "half",
    },
  },
});

for (const coll of ["messages_campaigns", "messages_messages"]) {
  schema.createForeignKey(coll, "messages_templates", {
    fieldKey: {
      field: "messages_template",
      meta: {
        required: true,
        display: "related-values",
        display_options: {
          template: "{{messages_name}} ({{messages_method}})",
        },
      },
    },
  });
}

schema.createForeignKey("messages_messages", "directus_users", {
  m2oFieldType: "uuid",
  fieldKey: {
    field: "messages_recipient",
    meta: {
      required: true,
      options: {
        enableCreate: false,
        template: "{{first_name}} {{last_name}} ({{email}})))",
      },
      display: "related-values",
      display_options: { template: "{{first_name}} {{last_name}} ({{email}})" },
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
      display_options: {
        template:
          "{{directus_users_id.first_name}} {{directus_users_id.last_name}} ({{directus_users_id.email}})",
      },
    },
  },
  field2: true,
});

schema.flows = [
  {
    flow: {
      name: "messages_send_message",
      icon: "send",
      description:
        "Sends a message based on the provided data. The input must contain the following fields: recipient_id (directus user UID), template_id (integer, pointing to an entry of the messages_templates collection). The following inputs are optional: campaign_id (integer, pointing to an entry of the messages_campaigns collection).",
      status: "active",
      trigger: "operation",
      accountability: "all",
      options: {
        return: "$last",
      },
    },
    firstOperation: "create_message_record",
    operations: [
      {
        operation: {
          name: "Create message record",
          key: "create_message_record",
          type: "item-create",
          position_x: 19,
          position_y: 1,
          options: {
            collection: "messages_messages",
            payload: {
              messages_status: "pending",
              messages_template: "{{$trigger.template_id}}",
              messages_recipient: "{{$trigger.recipient_id}}",
              messages_campaign: "{{$trigger.campaign_id}}",
            },
          },
        },
        resolve: "read_template_data",
        reject: "populate_response_failure_create_message_record_failure",
      },
      {
        operation: {
          name: "Populate response failure",
          key: "populate_response_failure_create_message_record_failure",
          type: "transform",
          position_x: 37,
          position_y: 17,
          options: {
            json: {
              status: "failed",
            },
          },
        },
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
            key: "{{$trigger.template_id}}",
          },
        },
        resolve: "read_recipient_data",
        reject: "set_message_status_to_failed_read_template_data_failure",
      },
      {
        operation: {
          name: "Read recipient data",
          key: "read_recipient_data",
          type: "item-read",
          position_x: 55,
          position_y: 1,
          options: {
            collection: "directus_users",
            query: {
              fields: ["first_name", "last_name", "email"],
            },
            key: "{{$trigger.recipient_id}}",
          },
        },
        resolve: "render_message",
        reject: "set_message_status_to_failed_read_recipient_data_failure",
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
        reject: "set_message_status_to_failed_render_message_failure",
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
            to: ["{{read_recipient_data.email}}"],
          },
        },
        resolve: "set_message_status_to_sent",
        reject: "set_message_status_to_failed_send_email_failure",
      },
      {
        operation: {
          name: "Set message status to sent",
          key: "set_message_status_to_sent",
          type: "item-update",
          position_x: 109,
          position_y: 1,
          options: {
            collection: "messages_messages",
            payload: {
              messages_message_status: "sent",
            },
            key: "{{create_message_record[0]}}",
          },
        },
        resolve: "populate_response_sent",
      },
      {
        operation: {
          name: "Populate response sent",
          key: "populate_response_sent",
          type: "transform",
          position_x: 127,
          position_y: 1,
          options: {
            json: {
              status: "sent",
            },
          },
        },
      },
      ...addFailureHandlingOperationsForSendMessagesFlow(
        "set_message_status_to_failed_read_template_data_failure",
        55,
      ),
      ...addFailureHandlingOperationsForSendMessagesFlow(
        "set_message_status_to_failed_read_recipient_data_failure",
        73,
      ),
      ...addFailureHandlingOperationsForSendMessagesFlow(
        "set_message_status_to_failed_render_message_failure",
        91,
      ),
      ...addFailureHandlingOperationsForSendMessagesFlow(
        "set_message_status_to_failed_send_email_failure",
        109,
      ),
    ],
  },
  {
    flow: {
      name: "messages_execute_campaign",
      icon: "campaign",
      description: "Executes a campaign by sending the corresponding messages",
      status: "active",
      trigger: "operation",
      accountability: "all",
      options: {
        return: "$last",
      },
    },
    firstOperation: "read_campaign_data",
    operations: [
      {
        operation: {
          name: "read_campaign_data",
          key: "read_campaign_data",
          type: "item-read",
          position_x: 19,
          position_y: 1,
          options: {
            collection: "messages_campaigns",
            key: "{{$trigger.messages_campaign_id}}",
            query: {
              fields: [
                "id",
                "messages_campaign_status",
                "messages_template",
                "messages_recipients.directus_users_id",
              ],
            },
          },
        },
        resolve: "check_status_is_pending",
      },
      {
        operation: {
          name: "check_status_is_pending",
          key: "check_status_is_pending",
          type: "condition",
          position_x: 37,
          position_y: 1,
          options: {
            filter: {
              read_campaign_data: {
                messages_campaign_status: {
                  _eq: "pending",
                },
              },
            },
          },
        },
        resolve: "expand_campaign_to_individual_messages",
      },
      {
        operation: {
          name: "expand_campaign_to_individual_messages",
          key: "expand_campaign_to_individual_messages",
          type: "exec",
          position_x: 55,
          position_y: 1,
          options: {
            code: 'module.exports = async function(data) {\n    campaign = data["read_campaign_data"]\n\tmessagesToSend = [];\n    for (i in campaign.messages_recipients) {\n        recipient = campaign.messages_recipients[i]\n        messagesToSend.push({\n            "recipient_id": recipient.directus_users_id,\n            "template_id": campaign.messages_template,\n            "campaign_id": campaign.id,\n        });\n    }\n\treturn messagesToSend;\n}',
          },
        },
        resolve: "send_messages",
      },
      {
        operation: {
          name: "send_messages",
          key: "send_messages",
          type: "trigger",
          position_x: 73,
          position_y: 1,
          options: {
            payload: "{{$last}}",
          },
        },
        flowToTrigger: "messages_send_message",
        resolve: "determine_outcome",
      },
      {
        operation: {
          name: "Determine outcome",
          key: "determine_outcome",
          type: "exec",
          position_x: 91,
          position_y: 1,
          options: {
            code: 'module.exports = async function(data) {\n  if (data["$last"].every((output) => output.status == "sent")) {\n  \treturn "sent";\n  } else if (data["$last"].every((output) => output.status == "failed")) {\n    return "completely_failed";\n  } else {\n    return "partially_failed";\n  }\n}',
          },
        },
        resolve: "update_campaign_status",
      },
      {
        operation: {
          name: "update_campaign_status",
          key: "update_campaign_status",
          type: "item-update",
          position_x: 109,
          position_y: 1,
          options: {
            collection: "messages_campaigns",
            key: "{{$trigger.messages_campaign_id}}",
            payload: {
              messages_campaign_status: "{{$last}}",
            },
            permissions: "$full",
          },
        },
      },
    ],
  },
  {
    flow: {
      name: "messages_handle_campaign_changes",
      icon: "campaign",
      color: null,
      description:
        'Triggers the execute_campaign flow when a campaign is added or updated with with status "pending"',
      status: "active",
      trigger: "event",
      accountability: "all",
      options: {
        type: "action",
        scope: ["items.create", "items.update"],
        collections: ["messages_campaigns"],
      },
    },
    firstOperation: "create_modified_keys_array",
    operations: [
      {
        operation: {
          name: "create_modified_keys_array",
          key: "create_modified_keys_array",
          type: "exec",
          position_x: 19,
          position_y: 1,
          options: {
            code: 'module.exports = async function(data) {    \n\tmodified_keys = [];\n    if (data["$trigger"].key) {\n        modified_keys.push({"messages_campaign_id": data["$trigger"].key});\n    }\n    for (i in data["$trigger"].keys) {\n        modified_keys.push({"messages_campaign_id": data["$trigger"].keys[i]});\n    }\n    return modified_keys;\n}',
          },
        },
        resolve: "trigger_execute_campaign_flow",
      },
      {
        operation: {
          name: "Trigger execute campaign flow",
          key: "trigger_execute_campaign_flow",
          type: "trigger",
          position_x: 37,
          position_y: 1,
          options: {
            payload: "{{$last}}",
          },
        },
        flowToTrigger: "messages_execute_campaign",
      },
    ],
  },
];

function addFailureHandlingOperationsForSendMessagesFlow(
  operationKey: string,
  positionX: number,
) {
  return [
    {
      operation: {
        name: "Set message status to failed",
        key: operationKey,
        type: "item-update",
        position_x: positionX,
        position_y: 17,
        options: {
          collection: "messages_messages",
          key: "{{create_message_record[0]}}",
          payload: {
            messages_message_status: "failed",
          },
        },
      },
      resolve: "populate_response_failure_" + operationKey,
    },
    {
      operation: {
        name: "Populate response failure",
        key: "populate_response_failure_" + operationKey,
        type: "transform",
        position_x: positionX + 18,
        position_y: 33,
        options: {
          json: {
            status: "failed",
          },
        },
      },
    },
  ];
}

for (const action of ["read", "delete"]) {
  schema.permissions.push({
    collection: "messages_messages",
    roleName: "collectivo_editor",
    action: action,
    fields: ["*"],
  });
}

for (const action of ["read", "delete"]) {
  schema.permissions.push({
    collection: "messages_campaigns",
    roleName: "collectivo_editor",
    action: action,
    fields: ["*"],
  });
}

schema.permissions.push({
  collection: "messages_campaigns",
  roleName: "collectivo_editor",
  action: "update",
  permissions: { _and: [{ messages_campaign_status: { _eq: "draft" } }] },
  validation: {
    _and: [
      {
        _or: [
          { messages_campaign_status: { _eq: "draft" } },
          { messages_campaign_status: { _eq: "pending" } },
        ],
      },
    ],
  },
  fields: ["*"],
});

schema.permissions.push({
  collection: "messages_campaigns",
  roleName: "collectivo_editor",
  action: "create",
  validation: {
    _and: [
      {
        _or: [
          { messages_campaign_status: { _eq: "draft" } },
          { messages_campaign_status: { _eq: "pending" } },
        ],
      },
    ],
  },
  fields: ["*"],
});

for (const action of ["read", "update", "create", "delete"]) {
  for (const collection of [
    "messages",
    "messages_templates",
    "messages_campaigns_directus_users",
  ]) {
    schema.permissions.push({
      collection: collection,
      roleName: "collectivo_editor",
      action: action,
      fields: ["*"],
    });
  }
}

for (const action of ["read", "update", "create"]) {
  schema.permissions.push({
    collection: "directus_users",
    roleName: "collectivo_editor",
    action: action,
    fields: ["messages_campaigns"],
  });
}
