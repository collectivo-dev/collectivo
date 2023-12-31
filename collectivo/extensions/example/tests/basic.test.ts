import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";
import { setup, $fetch } from "@nuxt/test-utils";

describe("example", async () => {
  await setup({
    rootDir: fileURLToPath(new URL("..", import.meta.url)),
    server: true,
  });

  it("Renders Hello Nuxt", async () => {
    expect(await $fetch("/test/")).toMatch("Hello Nuxt!");
  });
});
