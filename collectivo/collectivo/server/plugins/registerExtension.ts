import pkg from "../../package.json";

import m001_extensions from "../schemas/001_extensions";
import m002_settings from "../schemas/002_settings";
import m003_tags from "../schemas/003_tags";
import m004_tiles from "../schemas/004_tiles";

import examples from "../examples/examples";

// Register extension on startup
export default defineNitroPlugin(() => {
  logger.info("Starting collectivo v" + pkg.version);

  registerExtension({
    name: "collectivo",
    version: pkg.version,
    schemas: [
      combineSchemas("collectivo", "0.0.1", [
        m001_extensions,
        m002_settings,
        m003_tags,
        m004_tiles,
      ]),
    ],
    examples: examples,
  });
});
