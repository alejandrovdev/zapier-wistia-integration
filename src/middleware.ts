import type {
  BeforeRequestMiddleware,
  Bundle,
  ZObject,
} from "zapier-platform-core";

// This function runs after every outbound request. You can use it to check for
// errors or modify the response. You can have as many as you need. They'll need
// to each be registered in your index.js file.
const handleBadResponses = (response, z: ZObject) => {
  if (response.status === 401) {
    throw new z.errors.Error(
      // This message is surfaced to the user
      "The API Token you supplied is incorrect",
      "AuthenticationError",
      response.status,
    );
  }

  if (response.status === 403) {
    throw new z.errors.Error(
      "Your API token does not have permission for this action. Ensure it has read/write access.",
      "Forbidden",
      response.status,
    );
  }

  if (response.status === 404) {
    throw new z.errors.Error(
      "The requested resource was not found in Wistia. It may have been deleted.",
      "NotFound",
      response.status,
    );
  }

  return response;
};

// This function runs before every outbound request. You can have as many as you
// need. They'll need to each be registered in your index.js file.
const includeApiKey: BeforeRequestMiddleware = (
  request,
  z: ZObject,
  bundle: Bundle,
) => {
  if (bundle.authData.apiToken) {
    // Use these lines to include the API key in the querystring
    // request.params = request.params || {};
    // request.params.api_key = bundle.authData.apiToken;

    // If you want to include the API key in the header instead, uncomment this:
    request.headers = request.headers || {};
    request.headers.Authorization = `Bearer ${bundle.authData.apiToken}`;
  }

  return request;
};

export const befores = [includeApiKey];

export const afters = [handleBadResponses];
