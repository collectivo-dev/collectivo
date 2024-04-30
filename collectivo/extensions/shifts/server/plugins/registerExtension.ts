import pkg from "../../package.json";
import s001_schema_shifts from "../schemas/001_schema_shifts";
import examples from "../examples/examples";

// Register extension on startup
export default defineNitroPlugin(() => {
  registerExtension({
    name: "shifts",
    description: pkg.description,
    version: pkg.version,
    schemas: [s001_schema_shifts],
    examples: examples,
  });
});
