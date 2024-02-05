import {
  DirectusFlow,
  DirectusOperation,
  DirectusPermission,
} from "@directus/sdk";
import {
  DirectusCollection,
  DirectusField,
  DirectusRelation,
  DirectusRole,
  NestedPartial,
} from "@directus/sdk";

// Create a new schema
// This defines the database structure of an extension
// A schema relates to a specific version of an extension
// Non-breaking schemas will be skipped if there is a newer version
// Migrations can be called before and after the schema is applied
export function initSchema(extension: string, version: string) {
  return new ExtensionSchema(extension, version);
}

export interface ExtensionDependency {
  extension: string;
  version: string;
}

export interface DirectusOperationWrapper {
  operation: Partial<DirectusOperation<any>>;
  reject?: string;
  resolve?: string;
}

export interface DirectusFlowWrapper {
  flow: Partial<DirectusFlow<any>>;
  firstOperation?: string;
  operations?: DirectusOperationWrapper[];
}

export class ExtensionSchema {
  extension: string;
  version: string;
  dependencies: ExtensionDependency[];
  run_before: () => Promise<void>;
  run_after: () => Promise<void>;

  collections: NestedPartial<DirectusCollection<any>>[];
  fields: NestedPartial<DirectusField<any>>[];
  relations: NestedPartial<DirectusRelation<any>>[];
  roles: NestedPartial<DirectusRole<any>>[];
  permissions: Partial<DirectusPermission<any>>[];
  flows: DirectusFlowWrapper[];
  translations: any[];

  constructor(extension: string, version: string) {
    this.extension = extension;
    this.version = version;
    this.dependencies = [];
    this.collections = [];
    this.fields = [];
    this.relations = [];
    this.roles = [];
    this.permissions = [];
    this.flows = [];
    this.translations = [];

    this.run_before = () => Promise.resolve();
    this.run_after = () => Promise.resolve();
  }

  createM2MRelation = (
    collection1: string,
    collection2: string,
    settings?: directusM2MSettings,
  ) => {
    createM2MRelation(this, collection1, collection2, settings);
  };

  createM2ARelation = (
    aliasFieldName: string,
    MCollection: string,
    ACollections: string[],
    aliasField?: NestedPartial<DirectusField<any>>,
  ) => {
    createM2ARelation(
      this,
      aliasFieldName,
      MCollection,
      ACollections,
      aliasField,
    );
  };

  createForeignKey = (
    CollectionKey: string,
    CollectionAlias: string,
    settings?: directusO2MSettings,
  ) => {
    createForeignKey(this, CollectionKey, CollectionAlias, settings);
  };

  createO2MRelation = () => {
    throw new Error(
      "schema.createO2MRelation deprecated. pls use createForeignKey",
    );
  };

  apply = async () => {
    for (const collection of this.collections) {
      await createOrUpdateDirectusCollection(collection, [], []);
    }

    for (const field of this.fields) {
      if (!field.collection) {
        throw new Error("Field collection is required");
      }

      await createOrUpdateDirectusField(field, this.extension);
    }

    for (const relation of this.relations) {
      await createOrUpdateDirectusRelation(relation, this.extension);
    }

    for (const role of this.roles) {
      await createOrUpdateDirectusRole(role, this.extension);
    }

    for (const flow of this.flows) {
      await createOrUpdateDirectusFlow(flow);
    }

    for (const permission of this.permissions) {
      await createOrUpdateDirectusPermission(permission, this.extension);
    }

    for (const translation of this.translations) {
      await createOrUpdateDirectusTranslation(translation);
    }
  };

  rollBack = async () => {
    throw new Error("schema.rollBack not implemented");
  };
}

export function combineSchemas(
  extension: string,
  version: string,
  schemas: ExtensionSchema[],
) {
  const combinedSchema = initSchema(extension, version);

  for (const schema of schemas) {
    combinedSchema.dependencies.push(...schema.dependencies);
    combinedSchema.collections.push(...schema.collections);
    combinedSchema.fields.push(...schema.fields);
    combinedSchema.roles.push(...schema.roles);
    combinedSchema.relations.push(...schema.relations);
    combinedSchema.permissions.push(...schema.permissions);
    combinedSchema.flows.push(...schema.flows);
    combinedSchema.translations.push(...schema.translations);
  }

  return combinedSchema;
}

// Schema functions

// Settings to create M2M relations
// Field 2 is optional, but if it exists, it will be created in Collection 2
// M2M Field type is "integer" by default, but some collections are "uuid"
interface directusM2MSettings {
  field1?: NestedPartial<DirectusField<any>>;
  field2?: NestedPartial<DirectusField<any>> | boolean;
  relation1?: NestedPartial<DirectusRelation<any>>;
  relation2?: NestedPartial<DirectusRelation<any>>;
  m2mFieldType1?: string;
  m2mFieldType2?: string;
}

function createM2MRelation(
  schema: ExtensionSchema,
  collection1: string,
  collection2: string,
  settings?: directusM2MSettings,
) {
  // Prepare inputs
  const field1 = settings?.field1 || {};

  const field2 =
    settings?.field2 && typeof settings?.field2 !== "boolean"
      ? settings?.field2
      : {};

  const relation1 = settings?.relation1 || {};
  const relation2 = settings?.relation2 || {};

  const field1Name = settings?.field1?.field || collection2;
  const field2Name = field2 ? field2.field || collection1 : null;
  const m2mCollectionName = `${collection1}_${collection2}`;

  // Create alias field in Collection 1
  schema.fields.push({
    collection: collection1,
    field: field1Name,
    type: "alias",
    ...field1,
    meta: {
      interface: "list-m2m",
      special: ["m2m"],
      ...field1?.meta,
    },
  });

  // Optional: Create alias field in collection2
  if (field2Name) {
    schema.fields.push({
      collection: collection2,
      field: field2Name,
      type: "alias",
      ...field2,
      meta: {
        interface: "list-m2m",
        special: ["m2m"],
        ...field2.meta,
      },
    });
  }

  schema.collections.push({
    collection: m2mCollectionName,
    meta: { hidden: true, icon: "import_export" },
    schema: { name: m2mCollectionName },
  });

  schema.fields.push({
    collection: m2mCollectionName,
    field: `${collection1}_id`,
    type: settings?.m2mFieldType1 ? settings?.m2mFieldType1 : "integer",
    meta: { hidden: true },
  });

  schema.fields.push({
    collection: m2mCollectionName,
    field: `${collection2}_id`,
    type: settings?.m2mFieldType2 ? settings?.m2mFieldType2 : "integer",
    schema: {},
    meta: { hidden: true },
  });

  schema.relations.push({
    collection: m2mCollectionName,
    field: `${collection1}_id`,
    related_collection: collection1,
    ...relation1,
    meta: {
      one_field: field1Name,
      sort_field: null,
      one_deselect_action: "nullify",
      junction_field: `${collection2}_id`,
      ...relation1?.meta,
    },
    schema: { on_delete: "SET NULL", ...relation1?.schema },
  });

  schema.relations.push({
    collection: m2mCollectionName,
    field: `${collection2}_id`,
    related_collection: collection2,
    ...relation2,
    meta: {
      one_field: field2Name,
      sort_field: null,
      one_deselect_action: "nullify",
      junction_field: `${collection1}_id`,
      ...relation2?.meta,
    },
    schema: { on_delete: "SET NULL", ...relation2?.schema },
  });
}

interface directusO2MSettings {
  fieldKey?: NestedPartial<DirectusField<any>>;
  fieldAlias?: NestedPartial<DirectusField<any>>;
  relation?: NestedPartial<DirectusRelation<any>>;
}

// CollectionOne has the Alias Field - Can have many of CollectionAlias
// CollectionAlias has the Foreign Key - Can have one of CollectionOne
export async function createForeignKey(
  schema: ExtensionSchema,
  CollectionKey: string,
  CollectionAlias: string,
  settings?: directusO2MSettings,
) {
  const fieldKeyName = settings?.fieldKey?.field || CollectionAlias;
  const fieldKey = settings?.fieldKey || {};

  schema.fields.push({
    collection: CollectionKey,
    field: fieldKeyName,
    type: "integer",
    schema: {},
    ...fieldKey,
    meta: {
      interface: "select-dropdown-m2o",
      ...fieldKey?.meta,
    },
  });

  const relation = {
    collection: CollectionKey,
    field: fieldKeyName,
    related_collection: CollectionAlias,
    ...settings?.relation,
    meta: {
      sort_field: null,
      ...settings?.relation?.meta,
    },
    schema: { on_delete: "SET NULL", ...settings?.relation?.schema },
  };

  if (settings?.fieldAlias) {
    const fieldAliasName = settings?.fieldAlias?.field || CollectionKey;
    const fieldAlias = settings?.fieldAlias || {};

    schema.fields.push({
      collection: CollectionAlias,
      field: fieldAliasName,
      type: "alias",
      ...fieldAlias,
      meta: {
        interface: "list-o2m",
        special: ["o2m"],
        ...fieldAlias?.meta,
      },
    });

    relation.meta.one_field = fieldAliasName;
  }

  schema.relations.push(relation);
}

export async function createM2ARelation(
  schema: ExtensionSchema,
  aliasFieldName: string,
  MCollection: string,
  ACollections: string[],
  aliasField?: NestedPartial<DirectusField<any>>,
) {
  const m2aCollection = `${MCollection}_${aliasFieldName}`;
  const m2aCollectionIdFieldName = `${MCollection}_id`;

  const field = aliasField || {
    field: aliasFieldName,
    type: "alias",
    meta: { interface: "list-m2a", special: ["m2a"] },
    collection: MCollection,
  };

  schema.fields.push(field);

  schema.collections.push({
    collection: m2aCollection,
    meta: { hidden: true, icon: "import_export" },
    schema: { schema: m2aCollection, name: m2aCollection, comment: null },
  });

  schema.fields.push({
    collection: m2aCollection,
    field: m2aCollectionIdFieldName,
    type: "integer",
  });

  schema.fields.push({
    collection: m2aCollection,
    field: "item",
    type: "string",
    schema: {},
  });

  schema.fields.push({
    collection: m2aCollection,
    field: "collection",
    type: "string",
    schema: {},
  });

  schema.relations.push({
    collection: m2aCollection,
    field: "item",
    meta: {
      one_field: null,
      sort_field: null,
      one_deselect_action: "nullify",
      // @ts-ignore
      one_allowed_collections: ACollections,
      one_collection_field: "collection",
      junction_field: m2aCollectionIdFieldName,
    },
  });

  schema.relations.push({
    collection: m2aCollection,
    field: m2aCollectionIdFieldName,
    related_collection: MCollection,
    meta: {
      one_field: aliasFieldName,
      sort_field: null,
      one_deselect_action: "nullify",
      junction_field: "item",
    },
    schema: { on_delete: "SET NULL" },
  });
}
