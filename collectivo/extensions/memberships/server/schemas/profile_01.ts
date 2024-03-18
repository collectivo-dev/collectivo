const schema = initSchema("memberships", "0.0.1");

export default schema;

schema.collections = [];

schema.fields = [
  // Groups
  {
    collection: "directus_users",
    field: "memberships_profile_group",
    type: "alias",
    meta: {
      order: 200,
      interface: "group-detail",
      special: ["alias", "no-data", "group"],
      options: { title: "$t:person", headerIcon: "account_circle" },
      translations: [
        { language: "de-DE", translation: "Profil" },
        { language: "en-US", translation: "Profile" },
      ],
    },
  },
  {
    collection: "directus_users",
    field: "memberships_organization_group",
    type: "alias",
    meta: {
      order: 300,
      interface: "group-detail",
      special: ["alias", "no-data", "group"],
      options: { title: "$t:organization", headerIcon: "store" },
      translations: [
        { language: "de-DE", translation: "Organisation" },
        { language: "en-US", translation: "Organization" },
      ],
      conditions: [
        // @ts-ignore
        {
          name: "Hide if not organization",
          rule: { _and: [{ memberships_is_organization: { _eq: false } }] },
          hidden: true,
        },
      ],
    },
  },
  {
    collection: "directus_users",
    field: "memberships_address_group",
    type: "alias",
    meta: {
      order: 400,
      interface: "group-detail",
      special: ["alias", "no-data", "group"],
      options: { title: "$t:address", headerIcon: "house" },
      translations: [
        { language: "de-DE", translation: "Adresse" },
        { language: "en-US", translation: "Address" },
      ],
    },
  },

  // Profile fields
  {
    collection: "directus_users",
    field: "memberships_phone",
    type: "string",
    meta: {
      group: "memberships_profile_group",
      interface: "input",
      width: "half",
      translations: [
        { language: "de-DE", translation: "Telefon" },
        { language: "en-US", translation: "Phone" },
      ],
    },
  },
  {
    field: "memberships_birthday",
    type: "date",
    meta: {
      group: "memberships_profile_group",
      interface: "datetime",
      width: "half",
      translations: [
        { language: "de-DE", translation: "Geburtstag" },
        { language: "en-US", translation: "Birthday" },
      ],
    },
    collection: "directus_users",
  },
  {
    collection: "directus_users",
    field: "memberships_occupation",
    type: "string",
    meta: {
      group: "memberships_profile_group",
      interface: "input",
      width: "half",
      translations: [
        { language: "de-DE", translation: "Beruf" },
        { language: "en-US", translation: "Occupation" },
      ],
    },
  },
  {
    collection: "directus_users",
    field: "memberships_gender",
    type: "string",
    meta: {
      group: "memberships_profile_group",
      interface: "select-dropdown",
      display: "labels",
      width: "half",
      options: {
        choices: [
          { text: "$t:female", value: "female" },
          { text: "$t:male", value: "male" },
          { text: "$t:diverse", value: "diverse" },
          { text: "$t:inter", value: "inter" },
          { text: "$t:open", value: "open" },
          { text: "$t:no-answer", value: "no-answer" },
        ],
      },
      translations: [
        { language: "de-DE", translation: "Geschlecht" },
        { language: "en-US", translation: "Gender" },
      ],
    },
  },
  {
    collection: "directus_users",
    field: "memberships_person_type",
    type: "string",
    meta: {
      group: "memberships_profile_group",
      interface: "select-dropdown",
      display: "labels",
      width: "half",
      options: {
        choices: [
          { text: "$t:natural", value: "natural" },
          { text: "$t:legal", value: "legal" },
        ],
      },
      translations: [
        { language: "de-DE", translation: "Art der Person" },
        { language: "en-US", translation: "Person Type" },
      ],
    },
  },

  // Profile fields
  {
    collection: "directus_users",
    field: "memberships_street",
    type: "string",
    meta: {
      group: "memberships_address_group",
      sort: 1,
      interface: "input",
      width: "half",
      translations: [
        { language: "de-DE", translation: "Straße" },
        { language: "en-US", translation: "Street" },
      ],
    },
  },
  {
    collection: "directus_users",
    field: "memberships_streetnumber",
    type: "string",
    meta: {
      group: "memberships_address_group",
      sort: 2,
      interface: "input",
      width: "half",
      translations: [
        { language: "de-DE", translation: "Nummer" },
        { language: "en-US", translation: "Number" },
      ],
    },
  },
  {
    collection: "directus_users",
    field: "memberships_stair",
    type: "string",
    meta: {
      group: "memberships_address_group",
      sort: 3,
      interface: "input",
      width: "half",
      translations: [
        { language: "de-DE", translation: "Stiege" },
        { language: "en-US", translation: "Stair" },
      ],
    },
  },
  {
    collection: "directus_users",
    field: "memberships_door",
    type: "string",
    meta: {
      group: "memberships_address_group",
      sort: 4,
      interface: "input",
      width: "half",
      translations: [
        { language: "de-DE", translation: "Tür" },
        { language: "en-US", translation: "Door" },
      ],
    },
  },
  {
    collection: "directus_users",
    field: "memberships_postcode",
    type: "string",
    meta: {
      group: "memberships_address_group",
      sort: 5,
      interface: "input",
      width: "half",
      translations: [
        { language: "de-DE", translation: "Postleitzahl" },
        { language: "en-US", translation: "Postcode" },
      ],
    },
  },
  {
    collection: "directus_users",
    field: "memberships_city",
    type: "string",
    meta: {
      group: "memberships_address_group",
      sort: 6,
      interface: "input",
      width: "half",
      translations: [
        { language: "de-DE", translation: "Stadt" },
        { language: "en-US", translation: "City" },
      ],
      options: {
        iconRight: "location_city",
      },
    },
  },
  {
    collection: "directus_users",
    field: "memberships_country",
    type: "string",
    meta: {
      group: "memberships_address_group",
      sort: 7,
      interface: "input",
      width: "half",
      translations: [
        { language: "de-DE", translation: "Land" },
        { language: "en-US", translation: "Country" },
      ],
      options: {
        iconRight: "globe_asia",
      },
    },
  },

  // Organization fields
  {
    collection: "directus_users",
    field: "memberships_organization_name",
    type: "string",
    meta: {
      group: "memberships_organization_group",
      interface: "input",
      width: "half",
      translations: [
        { language: "de-DE", translation: "Organisation Name" },
        { language: "en-US", translation: "Organization Name" },
      ],
    },
  },
  {
    collection: "directus_users",
    field: "memberships_organization_id",
    type: "string",
    meta: {
      group: "memberships_organization_group",
      interface: "input",
      width: "half",
      translations: [
        { language: "de-DE", translation: "Organisation ID" },
        { language: "en-US", translation: "Organization ID" },
      ],
    },
  },
  {
    collection: "directus_users",
    field: "memberships_organization_type",
    type: "string",
    meta: {
      group: "memberships_organization_group",
      interface: "input",
      width: "half",
      translations: [
        { language: "de-DE", translation: "Organisation Typ" },
        { language: "en-US", translation: "Organization Type" },
      ],
    },
  },
];

schema.relations = [];

const editor_fields = [
  "memberships_profile_group",
  "memberships_occupation",
  "memberships_gender",
  "memberships_birthday",
  "memberships_phone",
  "memberships_person_type",

  "memberships_organization_group",
  "memberships_organization_name",
  "memberships_organization_id",
  "memberships_organization_type",

  "memberships_address_group",
  "memberships_street",
  "memberships_streetnumber",
  "memberships_stair",
  "memberships_door",
  "memberships_postcode",
  "memberships_city",
  "memberships_country",
];

const user_fields = [
  "memberships_profile_group",
  "memberships_occupation",
  "memberships_gender",
  "memberships_birthday",
  "memberships_phone",
  "memberships_person_type",

  "memberships_organization_group",
  "memberships_organization_name",
  "memberships_organization_id",
  "memberships_organization_type",

  "memberships_address_group",
  "memberships_street",
  "memberships_streetnumber",
  "memberships_stair",
  "memberships_door",
  "memberships_postcode",
  "memberships_city",
  "memberships_country",
];

schema.permissions = [
  {
    collection: "directus_users",
    roleName: "collectivo_editor",
    action: "read",
    fields: user_fields,
  },
  {
    collection: "directus_users",
    roleName: "collectivo_editor",
    action: "update",
    fields: editor_fields,
  },
  {
    collection: "directus_users",
    roleName: "collectivo_user",
    action: "read",
    fields: user_fields,
  },
  {
    collection: "directus_users",
    roleName: "collectivo_user",
    action: "update",
    fields: user_fields,
  },
];
