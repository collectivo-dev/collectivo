import pkg from "../../package.json";
import payments_01 from "../schemas/payments_01";
import profile_01 from "../schemas/profile_01";
import examples from "../examples/examples";

// Register extension on startup
export default defineNitroPlugin(() => {
  registerExtension({
    name: "payments",
    description: pkg.description,
    version: pkg.version,
    schemas: [combineSchemas("payments", "0.0.1", [payments_01, profile_01])],
    examples: examples,
  });
});
