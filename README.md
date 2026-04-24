# Zapier–Wistia Integration

A Zapier CLI integration connecting the Wistia video platform to the Zapier ecosystem.

## Overview

This integration uses the [Wistia Data API](https://wistia.com/support/developers/data-api) to let Zapier users automate video management workflows — triggering on new uploads and updating media metadata from any Zap.

Built as part of the [Zapier Integration Challenge](docs/CodersLink%20Zapier%20Integration%20Challenge.pdf).

## Trade-offs

| Decision            | Chosen                      | Alternative             | Reason                                                                 |
| ------------------- | --------------------------- | ----------------------- | ---------------------------------------------------------------------- |
| Auth type           | Custom Auth (Bearer token)  | OAuth2                  | Wistia uses static API tokens; OAuth2 is out of scope for a 3h timebox |
| Polling vs webhooks | Polling                     | REST Hooks              | Wistia Data API has no native webhook support                          |
| Project filter      | Client-side filtering       | Server-side query param | `/v1/medias.json` does not accept a `project_id` query param           |
| Media action        | Update (PUT)                | Create (POST)           | Wistia media creation requires multipart upload — not JSON-friendly    |
| Pagination          | First page only (100 items) | Full cursor pagination  | Sufficient for polling dedup; keeps implementation simple              |
| HTTP layer          | Shared `utils/client.ts`    | Class-based service     | Pragmatic for 2 endpoints; avoids over-engineering                     |

## Assumptions

- The user has a Wistia account with at least one uploaded media.
- The API token has read/write permissions.
- Polling frequency is managed by Zapier (typically every 1–15 minutes depending on the plan).
- 100 items per page is sufficient — accounts uploading more than 100 media between polls may miss some triggers. This is an acceptable edge case for the scope of this challenge.
- Wistia's `id` field is stable and unique across the account, making it safe for Zapier's dedup mechanism.
- The Wistia Data API returns `hashedId` (camelCase) for projects but `hashed_id` (snake_case) for media objects — the integration handles this inconsistency.

## AI Tooling Used

[Claude](https://claude.ai) was used as a research and reference tool during development — primarily for exploring API documentation, comparing architectural approaches, and understanding Zapier Platform CLI conventions.

**Example prompts:**

> "What are the differences between Custom Auth and OAuth2 in the Zapier Platform CLI? When is each appropriate for a Bearer token API?"

> "How does Zapier's polling trigger deduplication work? Does the `id` field need to be a string or can it be numeric?"

> "What is the `satisfies` keyword in TypeScript and how does it differ from a type annotation when used with Zapier's `defineApp` and `defineTrigger` helpers?"

> "How do dynamic dropdowns work in the Zapier Platform CLI? What does the `dynamic` field format `trigger_key.id_field.label_field` expect?"

> "What are the sorting and pagination parameters for the Wistia Data API v1 `/medias.json` endpoint? What does `sort_direction: 0` mean?"

## Running Locally

### Prerequisites

- Node.js 18+ (see `.nvmrc` for the pinned version and [https://nodejs.org](https://nodejs.org) or [https://www.nvmnode.com/es/guide/introduction.html](https://www.nvmnode.com/es/guide/introduction.html) for installation)
- pnpm (see [https://pnpm.io/installation](https://pnpm.io/installation))
- Zapier Platform CLI (see [https://docs.zapier.com/platform/build-cli/overview](https://docs.zapier.com/platform/build-cli/overview))
- A Wistia API token (see [https://my.wistia.com/account/api](https://my.wistia.com/account/api))

### Setup

```bash
git clone https://github.com/alejandrovdev/zapier-wistia-integration.git
cd zapier-wistia-integration
pnpm install
cp .env.example .env
# Edit .env and set authData_apiToken=your_wistia_token
zapier-platform login
```

### Local Testing

```bash
# Test authentication
zapier-platform invoke auth test --non-interactive

# Test trigger (all media)
zapier-platform invoke trigger new_media --non-interactive

# Test trigger (filtered by project)
zapier-platform invoke trigger project_list --non-interactive
zapier-platform invoke trigger new_media --inputData '{"project_id":"YOUR_PROJECT_HASHED_ID"}' --non-interactive

# Test action (update media name)
zapier-platform invoke create update_media --inputData '{"hashed_id":"MEDIA_HASHED_ID","name":"New Name"}' --non-interactive

# Test action (update media description)
zapier-platform invoke create update_media --inputData '{"hashed_id":"MEDIA_HASHED_ID","description":"New description"}' --non-interactive

# Test action validation (should fail — no name or description)
zapier-platform invoke create update_media --inputData '{"hashed_id":"MEDIA_HASHED_ID"}' --non-interactive

# Run unit tests
pnpm test
```

## Deployment

```bash
zapier-platform validate       # Must show 0 errors
zapier-platform register "Wistia Integration"  # First time only
zapier-platform push           # Deploy to Zapier
```

### Testing in the Zap Editor

After pushing, go to [zapier.com](https://zapier.com/app/zaps) and create a new Zap:

1. **Connect your account** — Search for "Wistia Integration" → enter your API token → test the connection. It should display your account name.
2. **Test the trigger** — Choose "New Media" as the event → optionally select a project from the dropdown → click "Test trigger". It should return your Wistia media.
3. **Test the action** — Add a second step → choose "Update Media" → select a media from the dropdown → enter a new name → click "Test action". It should return the updated media.
4. **Verify in Wistia** — Open your Wistia dashboard and confirm the media name was updated.
