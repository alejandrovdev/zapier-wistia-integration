import { describe, expect, it } from "vitest";
import zapier, { type Bundle, type ZObject } from "zapier-platform-core";
import App from "../index.js";

const appTester = zapier.createAppTester(App);

if (!App.authentication?.test) {
  throw new Error("App.authentication.test is not defined");
}

const authTest = App.authentication.test as (
  z: ZObject,
  bundle: Bundle,
) => unknown;

describe("custom auth", () => {
  it("passes authentication and returns json", async () => {
    const bundle = {
      authData: {
        apiToken: process.env.authData_apiToken,
      },
    };

    const response = await appTester(authTest, bundle);
    expect((response as { data: unknown }).data).toHaveProperty("name");
  });

  it("fails on bad auth", async () => {
    const bundle = {
      authData: {
        apiToken: "bad",
      },
    };

    try {
      await appTester(authTest, bundle);
    } catch (error) {
      expect((error as Error).message).toContain(
        "The API Token you supplied is incorrect",
      );
      return;
    }
    throw new Error("appTester should have thrown");
  });
});
