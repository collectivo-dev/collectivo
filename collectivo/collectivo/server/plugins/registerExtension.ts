import pkg from "../../package.json";

import settings_01 from "../schemas/settings_01";
import extensions_01 from "../schemas/extensions_01";
import tags_01 from "../schemas/tags_01";
import tiles_01 from "../schemas/tiles_01";
import messages_01 from "../schemas/messages_01";

import examples from "../examples/examples";

const schema_0_0_1 = combineSchemas("collectivo", "0.0.1", [
  settings_01,
  extensions_01,
  tags_01,
  tiles_01,
  messages_01,
]);

// Register extension on startup
export default defineNitroPlugin(() => {
  logger.info("Starting collectivo v" + pkg.version);

  registerExtension({
    name: "collectivo",
    version: pkg.version,
    schemas: [schema_0_0_1],
    examples: examples,
  });
});
