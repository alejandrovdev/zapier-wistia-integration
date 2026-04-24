# Zapier–Wistia Integration

A Zapier CLI integration connecting the Wistia video platform to the Zapier ecosystem.

## Overview

This integration uses the [Wistia Data API](https://wistia.com/support/developers/data-api) to let Zapier users automate video management workflows — triggering on new uploads and updating media metadata from any Zap.

Built as part of the [Zapier Integration Challenge](docs/CodersLink%20Zapier%20Integration%20Challenge.pdf).

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
