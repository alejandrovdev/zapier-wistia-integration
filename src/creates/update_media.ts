import {
  defineCreate,
  defineInputFields,
  type Bundle,
  type ZObject,
} from "zapier-platform-core";
import { updateMedia } from "../utils/client.js";

const inputFields = defineInputFields([
  {
    key: "hashed_id",
    label: "Media",
    type: "string",
    required: true,
    helpText: "The Wistia media to update.",
    dynamic: "new_media.hashed_id.name",
  },
  {
    key: "name",
    label: "Name",
    type: "string",
    required: false,
    helpText: "New name for the media. Leave blank to keep current.",
  },
  {
    key: "description",
    label: "Description",
    type: "text",
    required: false,
    helpText: "New description for the media. Leave blank to keep current.",
  },
]);

export const perform = async (
  z: ZObject,
  bundle: Bundle<Record<string, string>>,
) => {
  const { hashed_id, name, description } = bundle.inputData;

  if (!hashed_id) {
    throw new z.errors.Error("Media ID is required.", "InvalidData", 400);
  }

  if (!name && !description) {
    throw new z.errors.Error(
      "Provide at least one of Name or Description to update.",
      "InvalidData",
      400,
    );
  }

  const data: { name?: string; description?: string } = {};

  if (name) data.name = name;
  if (description) data.description = description;

  const media = await updateMedia(z, hashed_id, data);

  return { ...media, id: String(media.id) };
};

export default defineCreate({
  key: "update_media",
  noun: "Media",
  display: {
    label: "Update Media",
    description:
      "Updates the name and/or description of an existing Wistia media.",
  },
  operation: {
    inputFields,
    perform,
    sample: {
      id: "1",
      hashed_id: "abc123def",
      name: "Updated Video Title",
      type: "Video",
      status: "ready",
      description: "Updated description.",
      created: "2024-01-01T00:00:00+00:00",
      updated: "2024-06-15T12:00:00+00:00",
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
