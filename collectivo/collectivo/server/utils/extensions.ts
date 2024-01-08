// Register extensions into nuxt memory and get registered extensions
import { ExtensionSchema } from "./schemas";
import { validateStrict, compareVersions } from "compare-versions";

// This object defines an extension
export interface ExtensionConfig {
  name: string;
  version: string;
  description?: string;
  schemas?: ExtensionSchema[];

  examples?: () => Promise<void>; // Always relates to latest schema
}

// Store for loaded extensions
const registeredExtensions: ExtensionConfig[] = [];

// Public function to get resistered extensions
export function getRegisteredExtensions() {
  return [...registeredExtensions];
}

// Public function to register a new extension
export function registerExtension(ext: ExtensionConfig) {
  try {
    loadExtension(ext);
  } catch (error) {
    logger.log({
      level: "error",
      message: `Error registering extension: ${ext.name} v${ext.version}`,
      error: error,
    });
  }
}

// To avoid name conflicts, the following extension names are forbidden
const FORBIDDEN_EXTENSION_NAMES = [
  "directus",
  "keycloak",
  "sort",
  "user",
  "users",
  "date",
  "email",
  "auth",
  "content",
  "profile",
  "files",
  "name",
  "notes",
  "version",
  "schema",
  "migration",
  "description",
  "status",
  "messages",
  "api",
  "use",
  "tiles",
  "type",
  "subtype",
  "tags",
  "extension",
  "extensions",
  "settings",
];

// Load extension and run setup and migration functions
function loadExtension(ext: ExtensionConfig) {
  // Check that extension name does not contain an underscore
  if (ext.name.includes("_")) {
    throw new Error(
      `Extension name '${ext.name}' should not contain underscores`,
    );
  }

  // Validate version string
  if (!validateStrict(ext.version)) {
    throw new Error(`Extension version '${ext.version}' is not valid`);
  }

  // Check forbidden names
  if (FORBIDDEN_EXTENSION_NAMES.includes(ext.name)) {
    throw new Error(`Extension name '${ext.name}' is forbidden`);
  }

  // Check if extension is already registered in this server instance
  if (registeredExtensions.find((f) => f.name === ext.name)) {
    throw new Error(`Extension setup already run: ${ext.name}`);
  }

  if (ext.schemas) {
    // Check that schema version has to be unique
    const versions = ext.schemas.map((m) => m.version);
    const uniqueVersions = [...new Set(versions)];

    if (uniqueVersions.length !== versions.length) {
      throw new Error(`Extension ${ext.name} schema versions are not unique`);
    }

    // Sort schemas based on version
    ext.schemas.sort((a, b) => compareVersions(a.version, b.version));

    // Check that latest schema is not above extension version
    const latestSchema = ext.schemas[ext.schemas.length - 1];

    if (compareVersions(latestSchema?.version || "0.0.0", ext.version) > 0) {
      throw new Error(
        `Extension ${ext.name} schema version cannot be higher then extension`,
      );
    }
  }

  // Add extension to server store
  registeredExtensions.push(ext);
}
