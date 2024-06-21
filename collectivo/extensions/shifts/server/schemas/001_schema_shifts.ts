// This function creates an empty schema for version 0.0.1 of the shifts extension
// A schema can be used to declaratively define the structure of the database
import { ShiftUserType } from "../utils/ShiftUserType";
import { ShiftLogType } from "../utils/ShiftLogType";

const schema = initSchema("shifts", "0.0.1");

export default schema;

const shiftUserTypeDropdownChoices = [];

for (const type of Object.values(ShiftUserType)) {
  shiftUserTypeDropdownChoices.push({
    text: "$t:" + type.toLowerCase(),
    value: type,
  });
}

const shiftLogTypeDropdownChoices = [];

for (const type of Object.values(ShiftLogType)) {
  shiftLogTypeDropdownChoices.push({
    text: "$t:" + type.toLowerCase(),
    value: type,
  });
}

schema.collections = [
  {
    collection: "collectivo_shifts_group",
    meta: {
      sort: 800,
      translations: [
        {
          language: "en-US",
          translation: "Shifts",
          singular: "Shift",
          plural: "Shifts",
        },
        {
          language: "de-DE",
          translation: "Schichten",
          singular: "Schicht",
          plural: "Schichten",
        },
      ],
    },
  },
  {
    collection: "shifts_shifts",
    schema: {
      schema: "schema",
      name: "schema",
      comment: null,
    },
    meta: {
      group: "collectivo_shifts_group",
    },
  },
  {
    collection: "shifts_slots",
    schema: {
      schema: "schema",
      name: "schema",
      comment: null,
    },
    meta: {
      group: "collectivo_shifts_group",
    },
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
    meta: {
      group: "collectivo_shifts_group",
    },
  },
  {
    collection: "shifts_absences",
    schema: {
      schema: "schema",
      name: "schema",
      comment: null,
    },
    meta: {
      group: "collectivo_shifts_group",
    },
  },
  {
    collection: "shifts_logs",
    schema: {
      schema: "schema",
      name: "schema",
      comment: null,
    },
    meta: {
      group: "collectivo_shifts_group",
    },
  },
];

schema.fields = [
  ...directusSystemFields("shifts_shifts"),
  directusStatusField("shifts_shifts", "shifts_status"),
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
    type: "date",
    schema: { is_nullable: false },
    meta: {},
  },
  {
    collection: "shifts_shifts",
    field: "shifts_to",
    type: "date",
    schema: { is_nullable: true },
    meta: {},
  },
  {
    collection: "shifts_shifts",
    field: "shifts_from_time",
    type: "time",
    schema: { is_nullable: true },
    meta: {},
  },
  {
    collection: "shifts_shifts",
    field: "shifts_to_time",
    type: "time",
    schema: { is_nullable: true },
    meta: {},
  },
  {
    collection: "shifts_shifts",
    field: "shifts_repeats_every",
    type: "integer",
    schema: { is_nullable: true },
    meta: { note: "In days" },
  },
  {
    collection: "shifts_shifts",
    type: "text",
    meta: {
      interface: "input-rich-text-md",
      special: null,
      options: {
        toolbar: [
          "heading",
          "bold",
          "italic",
          "strikethrough",
          "blockquote",
          "bullist",
          "numlist",
          "table",
          "code",
          "link",
          "empty",
        ],
      },
    },
    field: "shifts_description",
  },
  {
    collection: "shifts_shifts",
    type: "text",
    meta: {
      interface: "input-rich-text-md",
      special: null,
      options: {
        toolbar: [
          "heading",
          "bold",
          "italic",
          "strikethrough",
          "blockquote",
          "bullist",
          "numlist",
          "table",
          "code",
          "link",
          "empty",
        ],
      },
    },
    field: "shifts_notes_internal",
  },
  {
    collection: "shifts_shifts",
    type: "integer",
    meta: { interface: "input", special: null, required: true },
    field: "shifts_score",
    schema: { default_value: "1" },
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
  // ABSENCES
  ...directusSystemFields("shifts_absences"),
  {
    collection: "shifts_absences",
    field: "shifts_from",
    type: "date",
    schema: {},
    meta: {},
  },
  {
    collection: "shifts_absences",
    field: "shifts_to",
    type: "date",
    schema: {},
    meta: {},
  },
  // DIRECTUS_USERS
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
    schema: { is_nullable: true, default_value: ShiftUserType.INACTIVE },
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
      required: true,
      interface: "select-dropdown",
      options: {
        choices: shiftLogTypeDropdownChoices,
      },
    },
  },
  {
    collection: "shifts_logs",
    field: "shifts_date",
    type: "date",
    schema: { is_nullable: false },
    meta: { required: true },
  },
  {
    collection: "shifts_logs",
    field: "shifts_date",
    type: "date",
    schema: { is_nullable: false },
    meta: { required: true },
  },
  {
    collection: "shifts_logs",
    type: "integer",
    meta: { interface: "input", special: null, required: true },
    field: "shifts_score",
    schema: { default_value: "0" },
  },
  {
    collection: "shifts_logs",
    type: "text",
    meta: { interface: "input-multiline", special: null },
    field: "shifts_note",
  },
  ...directusSystemFields("shifts_logs"),
];

const shifts_within_slots_template = "{{shifts_name}} {{shifts_from}} ({{id}})";

const slots_within_shifts_template = "{{shifts_name}} ({{id}})";

schema.createForeignKey("shifts_slots", "shifts_shifts", {
  fieldKey: {
    field: "shifts_shift",
    meta: {
      display: "related-values",
      display_options: {
        template: shifts_within_slots_template,
      },
      interface: "select-dropdown-m2o",
      options: {
        template: shifts_within_slots_template,
      },
    },
  },
  fieldAlias: {
    field: "shifts_slots",
    meta: {
      display_options: {
        template: slots_within_shifts_template,
      },
      options: {
        template: slots_within_shifts_template,
      },
    },
  },
});

const slots_within_skills_template =
  "{{shifts_slots_id.shifts_name}} ({{shifts_slots_id.id}})";

const skills_within_slots_template =
  "{{shifts_skills_id.shifts_name}} ({{shifts_skills_id.id}})";

schema.createM2MRelation("shifts_skills", "shifts_slots", {
  field1: {
    field: "shifts_slots",
    type: "alias",
    meta: {
      display_options: {
        template: slots_within_skills_template,
      },
      options: {
        template: slots_within_skills_template,
      },
    },
  },
  field2: {
    field: "shifts_skills",
    type: "alias",
    meta: {
      display_options: {
        template: skills_within_slots_template,
      },
      options: {
        template: skills_within_slots_template,
      },
    },
  },
});

const slots_within_assignments_template =
  "{{shifts_name}} ({{id}}) -- Shift:{{shifts_shift.shifts_name}} ({{shifts_shift.id}})";

schema.createForeignKey("shifts_assignments", "shifts_slots", {
  fieldKey: {
    field: "shifts_slot",
    meta: {
      display: "related-values",
      display_options: {
        template: slots_within_assignments_template,
      },
      interface: "select-dropdown-m2o",
      options: {
        template: slots_within_assignments_template,
      },
    },
  },
  fieldAlias: { field: "shifts_assignments" },
});

schema.createForeignKey("shifts_absences", "shifts_assignments", {
  fieldKey: {
    field: "shifts_assignment",
    meta: { note: "If empty, this absence is valid for all assignments." },
  },
  fieldAlias: { field: "shifts_absences" },
});

const assignments_within_logs_template =
  "{{shifts_user.first_name}} {{shifts_user.last_name}} ({{id}}) -- {{shifts_slot}}";

schema.createForeignKey("shifts_logs", "shifts_assignments", {
  fieldKey: {
    field: "shifts_assignment",
    meta: {
      display: "related-values",
      display_options: {
        template: assignments_within_logs_template,
      },
      interface: "select-dropdown-m2o",
      options: {
        template: assignments_within_logs_template,
      },
    },
  },
});

schema.createForeignKey("shifts_logs", "directus_users", {
  m2oFieldType: "uuid",
  fieldKey: { field: "shifts_user", meta: { required: true } },
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
