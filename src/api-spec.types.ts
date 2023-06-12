import { ApiTypeScriptSchema } from "./schema-type-ts";
import { ApiZodSchema } from "./schema-type-zod";
import type { InferInputTypeFromSchema, SchemaType } from "./schema-type.types";

/**
 * Api specification
 */
export interface ApiSpec {
  readonly metadata?: ApiMetadata;
  readonly endpoints: Record<string, ApiEndpoint>;
  readonly security?: ApiSecurity;
}

/**
 * Api metadata about the available servers
 */
export interface ApiServer {
  readonly url: string;
  readonly name: string;
}

export interface ApiSecurity {
  readonly [name: string]: unknown;
}

export interface ApiEndpoint {
  /**
   * optional metadata for the endpoint
   */
  readonly metadata?: ApiEndpointMetadata;
  /**
   * HTTP method for the endpoint
   */
  readonly method: ApiMethod;
  /**
   * Path for the endpoint
   */
  readonly path: string;
  /**
   * Query parameters for the endpoint
   * a record of schemas or a record of api parameters
   */
  readonly query?: Record<string, ApiParameter | {}>;
  /**
   * Path parameters for the endpoint
   * a record of schemas or a record of api parameters
   */
  readonly params?: Record<string, ApiParameter | {}>;
  /**
   * Headers for the endpoint
   * a record of schemas or a record of api parameters
   */
  readonly headers?: Record<string, ApiParameter | {}>;
  /**
   * Cookies for the endpoint
   * a record of schemas or a record of api parameters
   */
  readonly cookies?: Record<string, ApiParameter | {}>;
  /**
   * Body for the endpoint
   * can be a schema or an api data parameter
   */
  readonly body?: ApiDataParameter | {};
  /**
   * Possible responses for the endpoint
   * The key is the HTTP status code
   * The key "default" is used for the default response (only use for error responses)
   */
  readonly responses: {
    readonly [key in number | "default"]?: ApiDataParameter | {};
  };
}

/**
 * Describes any Endpoint parameter (query, path, header, cookie)
 */
export interface ApiParameter {
  /**
   * optional metadata for the parameter
   */
  readonly metadata?: ParameterMetadata;
  /**
   * Schema for the parameter
   */
  readonly schema: unknown;
}

/**
 * Describes the body of a request or response for an endpoint
 */
export interface ApiDataParameter {
  /**
   * optional metadata for the parameter
   */
  readonly metadata?: ApiDataMetadata;
  /**
   * Schema for the request or response body
   */
  readonly schema: unknown;
}

/**
 * common metadatas
 */
export interface ApiBaseMetadata {
  /**
   * optional description for the associated element
   */
  readonly description?: string;
  /**
   * optionally override the default schema type for the associated element
   * This allows to use a custom schema type for the associated element
   * Implementations of API spec can make one or more schema handled byt default
   */
  readonly schemaType?: SchemaType;
}

/**
 * API metadata
 * This metadata is used for the documentation and the client generation
 */
export interface ApiMetadata extends ApiBaseMetadata {
  /**
   * Name of the API
   */
  readonly name: string;
  /**
   * Version of the API
   */
  readonly version: string;
  /**
   * List of servers for the API
   */
  readonly servers?: readonly ApiServer[];
}

/**
 * Endpoint metadata
 */
export interface ApiEndpointMetadata extends ApiBaseMetadata {
  /**
   * Tags can be used for grouping endpoints in the documentation
   */
  readonly tags?: readonly string[];
  /**
   * Resource name for the endpoint, allows to implement cache normalization
   */
  readonly resource?: string;
  /**
   * Resource ID for the endpoint, allows to implement cache normalization
   */
  readonly resourceId?: string;
}

export interface ParameterMetadata extends ApiBaseMetadata {}

/**
 * Mimes types for the request or response body
 * application/json is the default mime type
 */
export type ApiMediaType =
  | "application/json"
  | "multipart/form-data"
  | "application/x-www-form-urlencoded"
  | "text/plain"
  | "application/octet-stream"
  | "application/pdf"
  | "image/png"
  | "image/jpeg"
  | "image/gif"
  | "image/webp"
  | "image/svg+xml"
  | (string & {});

/**
 * Data format for the request or response body
 * json is the default format
 * All other formats can be used for example for file upload/download
 * and are the ones supported by the browser Fetch API
 */
export type ApiDataFormat =
  | "json"
  | "text"
  | "form-data"
  | "url-search-params"
  | "blob"
  | "array-buffer"
  | "readable-stream";

/**
 * Supported HTTP methods
 */
export type ApiMethod =
  | "get"
  | "post"
  | "put"
  | "patch"
  | "delete"
  | "head"
  | "options"
  | "GET"
  | "POST"
  | "PUT"
  | "PATCH"
  | "DELETE"
  | "HEAD"
  | "OPTIONS";

/**
 * Metadata for the request or response body
 * This metadata is used for the documentation and the client/server generation
 */
export interface ApiDataMetadata extends ApiBaseMetadata {
  /**
   * Content type for the request or response body
   * application/json is the default content type
   */
  readonly contentType?: ApiMediaType; // default to application/json
  /**
   * Data format for the request or response body
   * json is the default format
   */
  readonly format?: ApiDataFormat;
}
