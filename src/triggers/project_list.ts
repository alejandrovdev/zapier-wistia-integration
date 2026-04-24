import { defineTrigger } from "zapier-platform-core";
import { fetchProjects } from "../utils/client.js";

export default defineTrigger({
  key: "project_list",
  noun: "Project",
  display: {
    label: "List Projects",
    description: "Hidden trigger that populates project dropdowns.",
    hidden: true,
  },
  operation: {
    type: "polling",
    perform: async (z) => {
      const projects = await fetchProjects(z);
      return projects.map((p) => ({ ...p, id: String(p.id) }));
    },
    sample: {
      id: "1",
      hashed_id: "abc123def",
      name: "My Project",
      mediaCount: 5,
      created: "2024-01-01T00:00:00+00:00",
      updated: "2024-01-01T00:00:00+00:00",
    },
  },
});
