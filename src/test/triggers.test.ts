import { describe, expect, it } from "vitest";
import zapier from "zapier-platform-core";
import App from "../index.js";
import { perform as performNewMedia } from "../triggers/new_media.js";
import { perform as performProjectList } from "../triggers/project_list.js";

const appTester = zapier.createAppTester(App);

describe("new_media trigger", () => {
  it("returns an array of medias", async () => {
    const bundle = {
      authData: { apiToken: process.env.authData_apiToken },
      inputData: {},
    };

    const results = (await appTester(performNewMedia, bundle)) as Record<
      string,
      unknown
    >[];

    expect(Array.isArray(results)).toBe(true);
    expect(results.length).toBeGreaterThan(0);
    expect(results[0]).toHaveProperty("id");
    expect(results[0]).toHaveProperty("hashed_id");
    expect(results[0]).toHaveProperty("name");
    expect(typeof results[0]!.id).toBe("string");
  });

  it("filters by project when project_id is provided", async () => {
    const projectBundle = {
      authData: { apiToken: process.env.authData_apiToken },
      inputData: {},
    };

    const projects = (await appTester(
      performProjectList,
      projectBundle,
    )) as Record<string, unknown>[];

    expect(projects.length).toBeGreaterThan(0);

    const bundle = {
      authData: { apiToken: process.env.authData_apiToken },
      inputData: { project_id: projects[0]!.hashedId },
    };

    const results = (await appTester(performNewMedia, bundle)) as Record<
      string,
      unknown
    >[];

    expect(Array.isArray(results)).toBe(true);
  });

  it("returns empty array for non-existent project", async () => {
    const bundle = {
      authData: { apiToken: process.env.authData_apiToken },
      inputData: { project_id: "nonexistent_project_id" },
    };

    const results = (await appTester(performNewMedia, bundle)) as Record<
      string,
      unknown
    >[];

    expect(Array.isArray(results)).toBe(true);
    expect(results.length).toBe(0);
  });
});

describe("project_list trigger", () => {
  it("returns an array of projects", async () => {
    const bundle = {
      authData: { apiToken: process.env.authData_apiToken },
      inputData: {},
    };

    const results = (await appTester(performProjectList, bundle)) as Record<
      string,
      unknown
    >[];

    expect(Array.isArray(results)).toBe(true);
    expect(results.length).toBeGreaterThan(0);
    expect(results[0]).toHaveProperty("id");
    expect(results[0]).toHaveProperty("hashedId");
    expect(results[0]).toHaveProperty("name");
    expect(typeof results[0]!.id).toBe("string");
  });
});
