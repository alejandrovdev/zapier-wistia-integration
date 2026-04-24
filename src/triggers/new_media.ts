import { defineInputFields, defineTrigger } from "zapier-platform-core";
import { fetchMedias } from "../utils/client.js";

const inputFields = defineInputFields([
  {
    key: "project_id",
    label: "Project",
    type: "string",
    required: false,
    helpText: "Optionally filter new media to a specific Wistia project.",
    dynamic: "project_list.hashedId.name",
  },
]);

export default defineTrigger({
  key: "new_media",
  noun: "Media",
  display: {
    label: "New Media",
    description: "Triggers when a new media is uploaded to Wistia.",
  },
  operation: {
    type: "polling",
    inputFields,
    perform: async (z, bundle) => {
      const medias = await fetchMedias(z);

      const projectId = bundle.inputData?.project_id;
      const filtered = projectId
        ? medias.filter((media) => media.project?.hashed_id === projectId)
        : medias;

      return filtered.map((m) => ({ ...m, id: String(m.id) }));
    },
    sample: {
      id: "1",
      hashed_id: "abc123def",
      name: "Sample Video",
      type: "Video",
      status: "ready",
      description: "A sample video.",
      created: "2024-01-01T00:00:00+00:00",
      updated: "2024-01-01T00:00:00+00:00",
      duration: 120,
      progress: 1,
      section: null,
      thumbnail: {
        url: "https://example.com/thumb.jpg",
        width: 1280,
        height: 720,
      },
    },
  },
});
