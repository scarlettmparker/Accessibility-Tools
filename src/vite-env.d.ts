/**
 * Ambient types for Vite-exposed environment variables.
 */
interface ViteTypeOptions {
  strictImportMetaEnv: unknown;
}

/**
 * Client-exposed environment variables, loaded from .env.
 */
interface ImportMetaEnv {
  /**
   * GraphQL endpoint of the Spring Boot back-end.
   */
  readonly VITE_GRAPHQL_ENDPOINT: string;
  /**
   * Client id forwarded as X-Client-Id.
   */
  readonly VITE_CLIENT_ID: string;
  /**
   * Client secret forwarded as X-Client-Secret.
   */
  readonly VITE_CLIENT_SECRET: string;
}

/**
 * Extended ImportMeta with typed env.
 */
interface ImportMeta {
  /**
   * Typed environment.
   */
  readonly env: ImportMetaEnv;
}
