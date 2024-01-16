// This function creates an empty schema for version 0.0.1 of the shifts extension
// A schema can be used to declaratively define the structure of the database
import { ShiftUserType } from "../utils/ShiftUserTypes";

const schema = initSchema("shifts", "0.0.1");

export default schema;

schema.collections = [
  {
    collection: "shifts_shifts",
    schema: {
      schema: "schema",
      name: "schema",
      comment: null,
    },
    meta: {},
  },
  {
    collection: "shifts_slots",
    schema: {
      schema: "schema",
      name: "schema",
      comment: null,
    },
    meta: {},
  },
  {
    collection: "shifts_skills",
    schema: {
      schema: "schema",
      name: "schema",
      comment: null,
    },
    meta: {},
  },
  {
    collection: "shifts_assignments",
    schema: {
      schema: "schema",
      name: "schema",
      comment: null,
    },
    meta: {},
  },
];

schema.fields = [
  ...directusSystemFields("shifts_shifts"),
  {
    collection: "shifts_shifts",
    field: "shifts_name",
    type: "string",
    schema: {},
    meta: {},
  },
  {
    collection: "shifts_shifts",
    field: "shifts_from",
    type: "dateTime",
    schema: { is_nullable: false },
    meta: {},
  },
  {
    collection: "shifts_shifts",
    field: "shifts_to",
    type: "dateTime",
    schema: { is_nullable: true },
    meta: {},
  },
  {
    collection: "shifts_shifts",
    field: "shifts_duration",
    type: "integer",
    schema: { is_nullable: false },
    meta: { note: "In minutes" },
  },
  {
    collection: "shifts_shifts",
    field: "shifts_repeats_every",
    type: "integer",
    schema: { is_nullable: true },
    meta: { note: "In days" },
  },
  ...directusSystemFields("shifts_slots"),
  {
    collection: "shifts_slots",
    field: "shifts_name",
    type: "string",
    schema: {},
    meta: {},
  },
  ...directusSystemFields("shifts_skills"),
  {
    collection: "shifts_skills",
    field: "shifts_name",
    type: "string",
    schema: {},
    meta: {},
  },
  ...directusSystemFields("shifts_assignments"),
  {
    collection: "shifts_assignments",
    field: "shifts_from",
    type: "date",
    schema: {},
    meta: {},
  },
  {
    collection: "shifts_assignments",
    field: "shifts_to",
    type: "date",
    schema: {},
    meta: {},
  },
  {
    collection: "directus_users",
    field: "shifts_group",
    type: "alias",
    meta: {
      order: 200,
      interface: "group-detail",
      special: ["alias", "no-data", "group"],
      options: { title: "$t:person", headerIcon: "account_circle" },
    },
  },
  {
    collection: "directus_users",
    field: "shifts_user_type",
    type: "string",
    meta: {
      group: "shifts_group",
      conditions: [
        {
          rule: {
            shifts_user_type: {
              _in: Object.values(ShiftUserType),
            },
          },
        },
      ],
    },
  },
];

schema.createO2MRelation("shifts_slots", "shifts_shifts", "shifts_shift");
schema.createM2MRelation("shifts_skills", "shifts_slots");
schema.createO2MRelation("shifts_assignments", "shifts_slots", "shifts_slot");

schema.createO2MRelation(
  "shifts_assignments",
  "directus_users",
  "shifts_user",
  {
    collectionManyFieldType: "uuid",
  },
);

schema.createM2MRelation("shifts_skills", "directus_users", {
  m2mFieldType2: "uuid",
});
