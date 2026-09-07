/**
 * Browser-safe GraphQL client for the Spring Boot back-end.
 */
import { parseThemes, type ResolvedTheme } from "@sun/utils/property-set";
import { print, type DocumentNode } from "graphql";
import {
  DefineWordDocument,
  type DefineWordQuery,
  type DefineWordQueryVariables,
  WordDictionary,
  type WordScope,
} from "@/generated/graphql";

type ApiResponse<T> = {
  /**
   * Whether the request succeeded.
   */
  success: boolean;
  /**
   * Decoded data on success.
   */
  data?: T;
  /**
   * Error message on failure.
   */
  error?: string;
};

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

const PROPERTY_SET_QUERY = `
  query propertySet($ownerKey: String!, $name: String!) {
    gaiaQueries {
      propertySet(ownerKey: $ownerKey, name: $name)
    }
  }
`;

type PropertySetData = {
  /**
   * Raw property set map.
   */
  gaiaQueries?: { propertySet?: unknown };
};

/**
 * Background response shape.
 */
type BackgroundResponse = {
  /**
   * Whether the fetch succeeded at HTTP level.
   */
  ok: boolean;
  /**
   * HTTP status.
   */
  status: number;
  /**
   * Raw body text.
   */
  body: string;
};

/**
 * Runs a fetch via the background service worker to bypass page CORS.
 *
 * @param endpoint the GraphQL endpoint
 * @param headers the headers to send
 * @param body the GraphQL body
 * @returns the background response
 */
function fetchViaBackground(
  endpoint: string,
  headers: Record<string, string>,
  body: GraphQLBody,
): Promise<BackgroundResponse> {
  const queryText = body.query;
  return new Promise((resolve, reject) => {
    const timeout = setTimeout(() => reject(new Error("Background request timed out")), 10000);
    chrome.runtime.sendMessage(
      { type: "GRAPHQL_REQUEST", query: queryText, variables: body.variables, endpoint, headers },
      (response: BackgroundResponse | undefined) => {
        clearTimeout(timeout);
        if (chrome.runtime.lastError) {
          reject(new Error(chrome.runtime.lastError.message));
          return;
        }
        if (!response) {
          reject(new Error("No response from background"));
          return;
        }
        resolve(response);
      },
    );
  });
}

/**
 * Runs a GraphQL operation against the back-end.
 */
async function executeQuery<T>(
  query: string | DocumentNode,
  variables?: Record<string, unknown>,
): Promise<ApiResponse<T>> {
  const queryText = typeof query === "string" ? query : print(query);
  const endpoint = import.meta.env.VITE_GRAPHQL_ENDPOINT;
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    "X-Client-Id": import.meta.env.VITE_CLIENT_ID,
    "X-Client-Secret": import.meta.env.VITE_CLIENT_SECRET,
    "X-Api-Key": import.meta.env.VITE_API_KEY,
  };
  const body: GraphQLBody = { query: queryText, variables };

  const isExtension = typeof chrome !== "undefined" && !!chrome.runtime?.id;

  try {
    let rawBody: string;
    let ok: boolean;
    let status: number;

    if (isExtension) {
      const res = await fetchViaBackground(endpoint, headers, body);
      rawBody = res.body;
      ok = res.ok;
      status = res.status;
    } else {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000);
      try {
        const response = await fetch(endpoint, {
          method: "POST",
          headers,
          body: JSON.stringify(body),
          signal: controller.signal,
        });
        rawBody = await response.text();
        ok = response.ok;
        status = response.status;
      } finally {
        clearTimeout(timeoutId);
      }
    }

    if (!ok) {
      return { success: false, error: `HTTP ${status}` };
    }
    const result = JSON.parse(rawBody);
    if (result.errors) {
      const message = result.errors
        .map((entry: { message: string }) => entry.message)
        .join(", ");
      return { success: false, error: message };
    }
    if (!result.data) {
      return { success: false, error: "No data returned" };
    }
    return { success: true, data: result.data as T };
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return { success: false, error: message };
  }
}

/**
 * Fetches a property set's entries as a name-to-values map.
 */
export async function fetchPropertySet(
  ownerKey: string,
  name: string,
): Promise<ApiResponse<PropertySetData>> {
  return executeQuery<PropertySetData>(PROPERTY_SET_QUERY, { ownerKey, name });
}

/**
 * Loads available themes, falling back to an empty bundle offline.
 */
export async function fetchThemes(): Promise<ResolvedTheme> {
  try {
    const result = await fetchPropertySet("ReactApp", "themes");
    if (result.success) {
      return parseThemes(result.data?.gaiaQueries?.propertySet);
    }
    return { current: null, all: [] };
  } catch {
    return { current: null, all: [] };
  }
}

/**
 * Defines a word from WordReference.
 *
 * @param word the headword to look up
 * @param dictionary the dictionary to query
 * @param scope the parts of the page to include
 */
export async function fetchDefineWord(
  word: string,
  dictionary: WordDictionary = WordDictionary.English,
  scope: WordScope[] = [],
): Promise<ApiResponse<DefineWordQuery>> {
  const variables: DefineWordQueryVariables = { word, dictionary, scope };
  const result = await executeQuery<DefineWordQuery>(DefineWordDocument, variables as Record<string, unknown>);
  if (!result.success) {
    return result;
  }
  if (!result.data?.hadesQueries?.defineWord) {
    return { success: false, error: "No definition found" };
  }
  return result;
}

export { WordDictionary, type WordScope };
