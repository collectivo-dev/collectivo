// This function creates an empty schema for version 0.0.1 of the shifts extension
// A schema can be used to declaratively define the structure of the database
import { ShiftUserType } from "../utils/ShiftUserType";
import { ShiftLogType } from "../utils/ShiftLogType";

const schema = initSchema("shifts", "0.0.1");

export default schema;

const shiftUserTypeDropdownChoices = [];

for (const type of Object.values(ShiftUserType)) {
  shiftUserTypeDropdownChoices.push({ text: type, value: type });
}

const shiftLogTypeDropdownChoices = [];

for (const type of Object.values(ShiftLogType)) {
  shiftLogTypeDropdownChoices.push({ text: type, value: type });
}

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
  {
    collection: "shifts_logs",
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
  directusStatusField("shifts_shifts", "shifts_status"),
  directusStatusField("shifts_slots", "shifts_status"),
  directusStatusField("shifts_assignments", "shifts_status"),
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
    schema: { is_nullable: false, default_value: ShiftUserType.TypeNotChosen },
    meta: {
      group: "shifts_group",
      interface: "select-dropdown",
      options: {
        choices: shiftUserTypeDropdownChoices,
      },
    },
  },
  {
    collection: "shifts_logs",
    field: "shifts_type",
    type: "string",
    schema: { is_nullable: false },
    meta: {
      interface: "select-dropdown",
      options: {
        choices: shiftLogTypeDropdownChoices,
      },
    },
  },
  {
    collection: "shifts_logs",
    field: "shifts_datetime",
    type: "dateTime",
    schema: { is_nullable: false },
    meta: {},
  },
];

schema.createForeignKey("shifts_slots", "shifts_shifts", {
  fieldKey: { field: "shifts_shift" },
  fieldAlias: { field: "shifts_slots" },
});

schema.createM2MRelation("shifts_skills", "shifts_slots", {
  field1: { field: "shifts_slots", type: "alias" },
  field2: { field: "shifts_skills", type: "alias" },
});

schema.createForeignKey("shifts_assignments", "shifts_slots", {
  fieldKey: { field: "shifts_slot" },
  fieldAlias: { field: "shifts_assignments" },
});

schema.createForeignKey("shifts_logs", "shifts_assignments", {
  fieldKey: { field: "shifts_assignment" },
});

schema.createForeignKey("shifts_logs", "directus_users", {
  m2oFieldType: "uuid",
  fieldKey: { field: "shifts_user" },
});

schema.createForeignKey("shifts_assignments", "directus_users", {
  m2oFieldType: "uuid",
  fieldKey: { field: "shifts_user" },
});

schema.createM2MRelation("shifts_skills", "directus_users", {
  m2mFieldType2: "uuid",
});

schema.createNuxtHook(
  {
    name: "update_score_on_shift_cycle_start",
    status: "active",
    accountability: "all",
    trigger: "schedule",
    options: {
      type: "action",
      interval: "0 3 * * *",
      cron: "0 3 * * *",
    },
  },
  "api/updateScoreOnShiftCycleStart",
);
