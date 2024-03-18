// Run pending migrations for a set of extensions, based on current state in db
export default defineEventHandler(async (event) => {
  // Protect route with API Token
  verifyCollectivoApiToken(event);

  try {
    await refreshDirectus();
  } catch (e) {
    logger.error("Failed to connect to Directus", e);
  }

  // Read parameters
  const query = getQuery(event) as { [key: string]: string };
  const extension = query["extension"];
  const version = query["version"];
  const isolated = parseBoolean(query["isolated"]);
  const examples = parseBoolean(query["examples"]);

  // Get extension configs
  const exts = getRegisteredExtensions();

  // Case 1: Apply all schemas
  if (!extension && !version) {
    migrateAll(exts, examples);
    let response = "Applying schema (all extensions, latest";

    if (examples) {
      response += " , incl. example data";
    }

    response += "). Please check the nuxt logs for details.";
    return {
      detail: response,
    };
  }

  // Case 2: Apply all example data
  if (!extension && !version && isolated && examples) {
    for (const ext of exts) {
      if (ext.examples) {
        await ext.examples();
      }
    }

    return {
      detail: "Creating example data for all extensions",
    };
  }

  // Case 3: Focus on a isolated extension
  const ext = exts.find((f: ExtensionConfig) => f.name === extension);

  if (!ext) {
    throw createError({
      statusCode: 400,
      statusMessage: "Cannot find extension with name " + extension,
    });
  }

  // Case 3-1: Apply example data
  if (!version && isolated && examples) {
    if (ext.examples) {
      await ext.examples();
    }

    return {
      detail: "Creating example data for extension " + extension,
    };
  }

  // Case 3-2: Apply a isolated schema individually
  if (isolated && version) {
    migrateCustom(ext, version, examples);
    return {
      detail: `Applying schema ${version} of ${ext.name} individually`,
    };
  }

  // Case 3-3: Migrate extension to specified version
  migrateExtension(ext, version, examples);
  return {
    detail: "Running migrations for extension " + extension,
  };
});
