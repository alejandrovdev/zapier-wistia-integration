// Wistia Data API v1
// https://docs.wistia.com/reference/getting-started-with-the-data-api
import type { ZObject } from "zapier-platform-core";

export const WISTIA_API = "https://api.wistia.com/v1";

export interface WistiaAccount {
  id: number;
  name: string;
  url: string;
}

export interface WistiaProject {
  id: number;
  hashedId: string;
  name: string;
  mediaCount: number;
  created: string;
  updated: string;
}

export interface WistiaMedia {
  id: number;
  hashed_id: string;
  name: string;
  type: string;
  status: string;
  description: string;
  created: string;
  updated: string;
  duration: number | null;
  progress: number;
  section: string | null;
  thumbnail: {
    url: string;
    width: number;
    height: number;
  };
  project?: {
    id: number;
    name: string;
    hashed_id: string;
  };
}

/**
 * Fetches the newest page of medias sorted by creation date (descending).
 * Returns up to 100 items per request — sufficient for polling dedup.
 * @see https://docs.wistia.com/reference/get_medias
 */
export const fetchMedias = async (
  z: ZObject,
  params?: Record<string, string>,
): Promise<WistiaMedia[]> => {
  const response = await z.request({
    url: `${WISTIA_API}/medias.json`,
    params: {
      sort_by: "created",
      sort_direction: "0",
      per_page: "100",
      ...params,
    },
  });

  return response.data as WistiaMedia[];
};

/**
 * Updates a media's name and/or description by hashed ID.
 * @see https://docs.wistia.com/reference/put_medias-media-hashed-id-json
 */
export const updateMedia = async (
  z: ZObject,
  hashedId: string,
  data: { name?: string; description?: string },
): Promise<WistiaMedia> => {
  const response = await z.request({
    url: `${WISTIA_API}/medias/${hashedId}.json`,
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  return response.data as WistiaMedia;
};

/**
 * Lists all projects in the account.
 * Used to populate the project dropdown in the trigger.
 * @see https://docs.wistia.com/reference/get_projects
 */
export const fetchProjects = async (z: ZObject): Promise<WistiaProject[]> => {
  const response = await z.request({
    url: `${WISTIA_API}/projects.json`,
  });

  return response.data as WistiaProject[];
};
