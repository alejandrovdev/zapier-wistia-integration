import { describe, expect, it } from "vitest";
import zapier from "zapier-platform-core";
import { perform as performUpdateMedia } from "../creates/update_media.js";
import App from "../index.js";
import { perform as performNewMedia } from "../triggers/new_media.js";

const appTester = zapier.createAppTester(App);

describe("update_media action", () => {
  it("updates a media name and restores it", async () => {
    const triggerBundle = {
      authData: { apiToken: process.env.authData_apiToken },
      inputData: {},
    };

    const medias = (await appTester(performNewMedia, triggerBundle)) as Record<
      string,
      unknown
    >[];

    expect(medias.length).toBeGreaterThan(0);
    const originalName = medias[0]!.name as string;
    const hashedId = medias[0]!.hashed_id as string;

    // Update the name
    const result = (await appTester(performUpdateMedia, {
      authData: { apiToken: process.env.authData_apiToken },
      inputData: { hashed_id: hashedId, name: "Test Update via Vitest" },
    })) as Record<string, unknown>;

    expect(result).toHaveProperty("id");
    expect(typeof result.id).toBe("string");
    expect(result.name).toBe("Test Update via Vitest");

    // Restore original name
    await appTester(performUpdateMedia, {
      authData: { apiToken: process.env.authData_apiToken },
      inputData: { hashed_id: hashedId, name: originalName },
    });
  });

  it("fails when no name or description is provided", async () => {
    const bundle = {
      authData: { apiToken: process.env.authData_apiToken },
      inputData: { hashed_id: "any_id" },
    };

    try {
      await appTester(performUpdateMedia, bundle);
    } catch (error) {
      expect((error as Error).message).toContain(
        "Provide at least one of Name or Description to update.",
      );
      return;
    }
    throw new Error("appTester should have thrown");
  });

  it("fails with 404 for non-existent media", async () => {
    const bundle = {
      authData: { apiToken: process.env.authData_apiToken },
      inputData: {
        hashed_id: "nonexistent_media_id",
        name: "Should Fail",
      },
    };

    try {
      await appTester(performUpdateMedia, bundle);
    } catch (error) {
      expect((error as Error).message).toContain("not found");
      return;
    }
    throw new Error("appTester should have thrown");
  });
});
