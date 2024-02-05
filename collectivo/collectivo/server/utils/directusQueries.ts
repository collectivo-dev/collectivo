import {
  createCollection,
  createField,
  DirectusCollection,
  DirectusField,
  NestedPartial,
  updateCollection,
  updateField,
  DirectusRelation,
  createRelation,
  updateRelation,
  readRoles,
  DirectusPermission,
  createPermission,
  updatePermission,
  readPermissions,
  createRole,
  DirectusRole,
  DirectusTranslation,
  createTranslation,
  updateTranslation,
  readTranslations,
  readFlows,
  createFlow,
  updateFlow,
  readOperations,
  DirectusOperation,
  createOperation,
  updateOperation,
} from "@directus/sdk";
import { DirectusFlowWrapper } from "./schemas";

export async function createOrUpdateDirectusCollection(
  collection: NestedPartial<DirectusCollection<any>>,
  fields?: NestedPartial<DirectusField<any>>[],
  relations?: NestedPartial<DirectusRelation<any>>[],
) {
  if (!collection.collection) {
    throw new Error("Collection name is required");
  }

  const directus = await useDirectusAdmin();

  try {
    await directus.request(createCollection(collection));

    console.log(`Created collection "${collection.collection}"`);
  } catch (e) {
    try {
      await directus.request(
        updateCollection(collection.collection, collection),
      );

      console.log(`Updated collection "${collection.collection}"`);
    } catch (e2) {
      console.error(e);
      console.error(e2);
      throw new Error("Could not create or update collection");
    }
  }

  for (const field of fields ?? []) {
    field.collection = collection.collection;
    await createOrUpdateDirectusField(field);
  }

  for (const relation of relations ?? []) {
    relation.collection = collection.collection;
    await createOrUpdateDirectusRelation(relation);
  }
}

export async function updateDirectusCollection(
  collection: NestedPartial<DirectusCollection<any>>,
  fields?: NestedPartial<DirectusField<any>>[],
  relations?: NestedPartial<DirectusRelation<any>>[],
) {
  if (!collection.collection) {
    throw new Error("Collection name is required");
  }

  const directus = await useDirectusAdmin();

  try {
    await directus.request(updateCollection(collection.collection, collection));
    console.log(`Updated collection "${collection.collection}"`);
  } catch (e2) {
    console.error(e2);
    throw new Error("Could not create or update collection");
  }

  for (const field of fields ?? []) {
    field.collection = collection.collection;
    await createOrUpdateDirectusField(field);
  }

  for (const relation of relations ?? []) {
    relation.collection = collection.collection;
    await createOrUpdateDirectusRelation(relation);
  }
}

export async function createOrUpdateDirectusField(
  field: NestedPartial<DirectusField<any>>,
  extension?: string,
) {
  if (!field.field) {
    throw new Error("Field name is required");
  }

  if (!field.collection) {
    throw new Error("Field collection is required");
  }

  const directus = await useDirectusAdmin();

  try {
    const fieldDB = await directus.request(
      createField(field.collection, field),
    );

    console.log(`Created field "${field.field} in "${field.collection}"`);
  } catch (e) {
    try {
      await directus.request(updateField(field.collection, field.field, field));
      console.log(`Updated field "${field.field} in "${field.collection}""`);
    } catch (e2) {
      console.error(e);
      console.error(e2);
      throw new Error(`Could not create or update field ${field.field}`);
    }
  }
}

export async function createOrUpdateDirectusRelation(
  relation: NestedPartial<DirectusRelation<any>>,
  _extension?: string,
) {
  if (!relation.collection) {
    throw new Error("Relation collection is required");
  }

  if (!relation.field) {
    throw new Error("Relation name is required");
  }

  const directus = await useDirectusAdmin();

  try {
    await directus.request(createRelation(relation));
    console.log(`Created relation "${relation.field}"`);
  } catch (e) {
    try {
      await directus.request(
        updateRelation(relation.collection, relation.field, relation),
      );

      console.log(`Updated relation "${relation.field}"`);
    } catch (e2) {
      console.error(e);
      console.error(e2);
      throw new Error("Could not create or update relation");
    }
  }
}

// Return first role with given name
export async function getDirectusRoleByName(name: string) {
  const directus = await useDirectusAdmin();

  const roles = await directus.request(
    readRoles({
      filter: {
        name: { _eq: name },
      },
    }),
  );

  if (roles.length < 1) {
    throw new Error(`Could not find role "${name}"`);
  } else if (roles.length > 1) {
    logger.warn(`Found multiple roles with name "${name}"`);
  }

  return roles[0];
}

export async function createOrUpdateDirectusRole(
  role: NestedPartial<DirectusRole<any>>,
  _extension?: string,
) {
  if (!role.name) {
    throw new Error("Role name is required");
  }

  const directus = await useDirectusAdmin();
  // @ts-ignore
  let roleDb;

  try {
    roleDb = await getDirectusRoleByName(role.name);
  } catch (e) {
    await directus.request(createRole(role));
    console.log(`Created role "${role}"`);
  }
  // TODO: Updating role not possible yet
  // if (roleDb) {
  //   console.log(roleDb);
  //   console.log(role);
  //   await directus.request(updateRole(roleDb.ID, role));
  //   console.log(`Updated role "${role}"`);
  // }
}

export async function createOrUpdateDirectusFlow(flow: DirectusFlowWrapper) {
  const directus = await useDirectusAdmin();
  let flowId: string;

  // See if flow already exists
  const flowsDb = await directus.request(
    readFlows({
      filter: {
        name: { _eq: flow.flow.name },
      },
    }),
  );

  // Create flow if it doesn't exist
  if (flowsDb.length === 0) {
    flowId = (await directus.request(createFlow(flow.flow))).id;
  }

  // Update flow if it exists
  else {
    flowId = flowsDb[0].id;
    await directus.request(updateFlow(flowId, flow.flow));
  }

  // Add operation to flow
  const operationIds: Record<string, string> = {};

  for (const operation of flow.operations ?? []) {
    operation.operation.flow = flowId;

    const operationId = await createOrUpdateDirectusOperation(
      operation.operation,
    );

    if (operation.operation.key) {
      operationIds[operation.operation.key] = operationId;
    }
  }

  // Connect operations to another
  if (flow.firstOperation) {
    flow.flow.operation = operationIds[flow.firstOperation];
    await directus.request(updateFlow(flowId, flow.flow));
  }

  for (const operation of flow.operations ?? []) {
    if (!operation.operation.key) {
      continue;
    }

    if (operation.reject) {
      const payload = { reject: operationIds[operation.reject] };

      await directus.request(
        updateOperation(operationIds[operation.operation.key], payload),
      );
    }

    if (operation.resolve) {
      const payload = { resolve: operationIds[operation.resolve] };

      await directus.request(
        updateOperation(operationIds[operation.operation.key], payload),
      );
    }
  }
}

export async function createOrUpdateDirectusOperation(
  operation: Partial<DirectusOperation<any>>,
): Promise<string> {
  const directus = await useDirectusAdmin();

  // See if operation already exists
  const operationsDb = await directus.request(
    readOperations({
      filter: {
        key: { _eq: operation.key },
        flow: { _eq: operation.flow },
      },
    }),
  );

  // Create operation if it doesn't exist
  if (operationsDb.length === 0) {
    return (await directus.request(createOperation(operation))).id;
  }

  // Update operation if it exists
  else {
    const operationId = operationsDb[0].id;
    await directus.request(updateOperation(operationId, operation));
    return operationId;
  }
}

export async function createOrUpdateDirectusTranslation(
  translation: NestedPartial<DirectusTranslation<any>>,
) {
  const directus = await useDirectusAdmin();

  const tr = await directus.request(
    readTranslations({
      filter: {
        language: { _eq: translation.language },
        key: { _eq: translation.key },
      },
    }),
  );

  if (tr.length === 0) {
    await directus.request(createTranslation(translation));
  } else {
    await directus.request(
      updateTranslation(tr[0].id, { value: translation.value }),
    );
  }
}

export async function createOrUpdateDirectusPermission(
  permission: Partial<DirectusPermission<any>>,
  _extension: string,
) {
  const directus = await useDirectusAdmin();

  // Add role id to permission based on RoleName
  if (permission.roleName) {
    const role = await getDirectusRoleByName(permission.roleName);
    permission.role = role.id;
  } else if (!permission.role) {
    throw new Error("role or roleName is required");
  }

  // Try to get permission
  const permissionsDB = await directus.request(
    readPermissions({
      filter: {
        role: { _eq: permission.role },
        action: { _eq: permission.action },
        collection: { _eq: permission.collection },
      },
    }),
  );

  if (permissionsDB.length > 1) {
    logger.warn(
      `Found multiple permissions for role "${permission.roleName}" with action "${permission.action}" on collection "${permission.collection}"`,
    );
  }

  if (permissionsDB.length == 0) {
    await directus.request(createPermission(permission));
    console.log("Created permission " + permission.roleName);
  } else {
    const permissionDB = permissionsDB[0];

    // Merge fields
    if (permission.override) {
      // todo: override fields
      console.warn("Override not implemented yet");
    } else if (permissionDB.fields == "*") {
      permission.fields = ["*"];
    } else if (permissionDB.fields[0] !== "*") {
      if (typeof permission.fields == "string") {
        permission.fields = [permission.fields];
      }

      permission.fields = [
        ...(permissionDB.fields ?? []),
        ...(permission.fields ?? []),
      ];
    }

    await directus.request(updatePermission(permissionDB.id, permission));
  }
}

// // Remove old fields
// if (fieldsToRemove) {
//   for (const field of fieldsToRemove) {
//     try {
//       await directus.request(deleteField(collection.collection, field));
//       console.log(`Deleted field "${field}"`);
//     } catch (e) {
//       console.error(e);
//       throw new Error("Could not delete field");
//     }
//   }
// }
