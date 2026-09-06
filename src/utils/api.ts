/**
 * Browser-safe GraphQL client for the Spring Boot back-end.
 */
import { parseThemes, type ResolvedTheme } from "@sun/utils/property-set";

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
 * Runs a GraphQL operation against the back-end.
 */
async function executeQuery<T>(
  query: string,
  variables?: Record<string, unknown>,
): Promise<ApiResponse<T>> {
  const endpoint = import.meta.env.VITE_GRAPHQL_ENDPOINT;
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 10000);
  try {
    const body: GraphQLBody = { query, variables };
    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Client-Id": import.meta.env.VITE_CLIENT_ID,
        "X-Client-Secret": import.meta.env.VITE_CLIENT_SECRET,
      },
      body: JSON.stringify(body),
      signal: controller.signal,
    });
    if (!response.ok) {
      return { success: false, error: `HTTP ${response.status}` };
    }
    const result = await response.json();
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
  } finally {
    clearTimeout(timeoutId);
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
