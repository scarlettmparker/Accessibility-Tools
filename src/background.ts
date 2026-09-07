/**
 * Background service worker for privileged GraphQL fetches.
 *
 * Content scripts are subject to page CORS, so all back-end calls are
 * proxied through here where host_permissions bypass CORS.
 */

type GraphQLBody = {
  /**
   * GraphQL query text.
   */
  query: string;
  /**
   * Query variables.
   */
  variables?: Record<string, unknown>;
};

type GraphQLRequest = {
  /**
   * Message type.
   */
  type: "GRAPHQL_REQUEST";
  /**
   * GraphQL query text.
   */
  query: string;
  /**
   * Query variables.
   */
  variables?: Record<string, unknown>;
  /**
   * Endpoint URL.
   */
  endpoint: string;
  /**
   * Headers to forward.
   */
  headers: Record<string, string>;
};

chrome.runtime.onMessage.addListener((message: GraphQLRequest, _sender, sendResponse) => {
  if (message.type !== "GRAPHQL_REQUEST") {
    return;
  }

  const body: GraphQLBody = { query: message.query, variables: message.variables };

  fetch(message.endpoint, {
    method: "POST",
    headers: message.headers,
    body: JSON.stringify(body),
  })
    .then(async (response) => {
      const text = await response.text();
      sendResponse({ ok: response.ok, status: response.status, body: text });
    })
    .catch((error: unknown) => {
      const msg = error instanceof Error ? error.message : "Unknown error";
      sendResponse({ ok: false, status: 0, body: JSON.stringify({ errors: [{ message: msg }] }) });
    });

  return true;
});
