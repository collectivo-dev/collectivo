import pkg from "../../package.json";
import memberships_01 from "../schemas/memberships_01";
import profile_01 from "../schemas/profile_01";
import examples from "../examples/examples";

const schema_0_0_1 = combineSchemas("memberships", "0.0.1", [
  memberships_01,
  profile_01,
]);

// Register extension on startup
export default defineNitroPlugin(() => {
  registerExtension({
    name: "memberships",
    description: pkg.description,
    version: pkg.version,
    schemas: [schema_0_0_1],
    examples: examples,
  });
});
