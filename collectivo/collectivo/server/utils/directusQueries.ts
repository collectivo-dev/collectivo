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
  readItems,
  createItem,
  DirectusTranslation,
  createTranslation,
  updateTranslation,
  readTranslations,
} from "@directus/sdk";

async function addItemtoExtension(
  extension: string,
  collection: string,
  item: any,
) {
  const directus = await useDirectusAdmin();
  const extsDb = await directus.request(readItems("collectivo_extensions"));
  const extDb = extsDb.find((ext) => ext.name === extension);

  if (!extDb) {
    throw new Error(`Could not find extension "${extension}"`);
  }

  await directus.request(
    createItem("collectivo_extensions_items", {
      collection: collection,
      item: item,
      collectivo_extensions_id: extDb.id,
    }),
  );
}

export async function createOrUpdateDirectusCollection(
  collection: NestedPartial<DirectusCollection<any>>,
  fields?: NestedPartial<DirectusField<any>>[],
  relations?: NestedPartial<DirectusRelation<any>>[],
  extension?: string,
) {
  if (!collection.collection) {
    throw new Error("Collection name is required");
  }

  const directus = await useDirectusAdmin();

  try {
    await directus.request(createCollection(collection));

    if (extension) {
      await addItemtoExtension(
        extension,
        "directus_collections",
        collection.collection,
      );
    }

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

    if (extension) {
      await addItemtoExtension(extension, "directus_fields", fieldDB.id);
    }

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
  permission: NestedPartial<DirectusPermission<any>>,
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
    // @ts-ignore
    if (permission.override) {
      // todo: override fields
      console.warn("Override not implemented yet");
    } else if (permissionDB.fields == "*") {
      permission.fields = "*";
    } else if (
      permission.fields != "*" &&
      // @ts-ignore
      permissionDB.fields != ["*"]
    ) {
      if (typeof permission.fields == "string") {
        // @ts-ignore
        permission.fields = [permission.fields];
      }

      // console.log(permissionDB.fields, permission.fields);

      // @ts-ignore
      permission.fields = [
        ...(permissionDB.fields ?? []),
        // @ts-ignore
        ...permission.fields,
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
