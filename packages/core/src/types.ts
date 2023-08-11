import type { SchemaType } from "./schema-type.types";

/**
 * Api specification
 */
export interface ApiSpec {
  /**
   * Optional metadata for the api
   */
  readonly metadata?: ApiMetadata;
  /**
   * Definitions for all the API endpoints
   */
  readonly endpoints: Record<string, ApiEndpoint>;
  /**
   * Optional Definitions for security schemes
   */
  readonly security?: ApiSecurity;
  /**
   * Optional Definitions for common schemas, usefull for reusing schemas when using json-schema or json-types
   */
  readonly schemas?: Record<string, unknown>;
}

/**
 * Api metadata about the available servers
 */
export interface ApiServer {
  /**
   * URL of the server
   */
  readonly url: string;
  /**
   * Alias name for the server
   */
  readonly name: string;
}

export interface ApiSecurity {
  readonly [name: string]: unknown;
}

/**
 * API entries that have record of schemas or api parameters
 */
export type ApiEntry = "query" | "params" | "headers" | "cookies" | "responses";

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
   * Request Query parameters for the endpoint
   * a record of schemas or a record of api parameters
   */
  readonly query?: Record<string, ApiParameter | {}>;
  /**
   * Request Path parameters for the endpoint
   * a record of schemas or a record of api parameters
   */
  readonly params?: Record<string, ApiParameter | {}>;
  /**
   * Request Headers for the endpoint
   * a record of schemas or a record of api parameters
   */
  readonly headers?: {
    readonly [key in ApiHeaders]?: ApiParameter | {};
  };
  /**
   * Request Cookies for the endpoint
   * a record of schemas or a record of api parameters
   */
  readonly cookies?: Record<string, ApiParameter | {}>;
  /**
   * Request Body for the endpoint
   * can be a schema or an api data parameter
   */
  readonly body?: ApiRequestBodyParameter | {};
  /**
   * Possible responses for the endpoint
   * The key is the HTTP status code
   * The key "default" is used for the default response (only use for error responses)
   */
  readonly responses: {
    readonly [key in number | "default"]?: ApiResponseBodyParameter | {};
  };
}

/**
 * Describes any Endpoint parameter (query, path, header, cookie)
 */
export interface ApiParameter {
  /**
   * optional metadata for the parameter
   */
  readonly metadata?: ApiParameterMetadata;
  /**
   * Schema for the parameter
   */
  readonly schema: unknown;
}

/**
 * Describes the body of a request for an endpoint
 */
export interface ApiRequestBodyParameter {
  /**
   * optional metadata for the parameter
   */
  readonly metadata?: ApiDataMetadata;
  /**
   * Schema for the request body
   */
  readonly schema: unknown;
}

/**
 * Describes the body of a response for an endpoint
 */
export interface ApiResponseBodyParameter {
  /**
   * optional metadata for the parameter
   */
  readonly metadata?: ApiDataMetadata;
  /**
   * optional schemas for the response headers
   */
  readonly headers?: {
    readonly [key in ApiHeaders]?: ApiParameter | {};
  };
  /**
   * Schema for the response body
   */
  readonly schema: unknown;
}

/**
 * API metadata activation options
 */
interface ApiActivationOptions {
  /**
   * enable or disable the option for incoming requests
   * This is used for server side handling of the API
   */
  incomingRequest?: boolean;
  /**
   * enable or disable the option for outgoing requests
   * This is used for client side handling of the API
   */
  outgoingRequest?: boolean;
  /**
   * enable or disable the option for incoming responses
   * This is used for client side handling of the API
   */
  incomingResponse?: boolean;
  /**
   * enable or disable the option for outgoing responses
   * This is used for server side handling of the API
   */
  outgoingResponse?: boolean;
}

export interface Serializer {
  stringify: (data: unknown) => string;
  parse: (data: string) => unknown;
}

/**
 * common metadatas
 */
export interface ApiBaseMetadata {
  /**
   * optional description for the associated element, used for documentation
   */
  readonly description?: string;
  /**
   * optionally override the default schema type for the associated element
   * This allows to use a custom schema type for the associated element
   * Implementations of API spec can make one or more schema handled by default
   */
  readonly schemaType?: SchemaType;
  /**
   * optionally disable or enable validation for the associated element
   * default is implementation specific, customize if needed
   * implementors of API spec are encouraged to honor the validate option
   */
  readonly validate?: boolean | ApiActivationOptions;
  /**
   * optionally disable or enable transformation for the associated element
   * default is implementation specific, customize if needed
   * implementors of API spec are encouraged to honor the transform option
   */
  readonly transform?: boolean | ApiActivationOptions;
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
  /**
   * optionnally provide a serializer to stringify and parse query parameters
   * it will be used instead of the default serializer
   * to serialize data after validation and deserialize data before validation
   */
  readonly querySerializer?: Serializer;
  /**
   * optionnally provide a serializer to stringify and parse header parameters
   * it will be used instead of the default serializer
   * to serialize data after validation and deserialize data before validation
   */
  readonly headersSerializer?: Serializer;
  /**
   * optionnally provide a serializer to stringify and parse path parameters
   * it will be used instead of the default serializer
   * to serialize data after validation and deserialize data before validation
   */
  readonly paramsSerializer?: Serializer;
  /**
   * optionnally provide a serializer to stringify and parse cookie parameters
   * it will be used instead of the default serializer
   * to serialize data after validation and deserialize data before validation
   */
  readonly cookiesSerializer?: Serializer;
  /**
   * optionnally provide a serializer to stringify and parse body parameters
   * it will be used instead of the default serializer
   * to serialize data after validation and deserialize data before validation
   */
  readonly bodySerializer?: Serializer;
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

export interface ApiParameterMetadata extends ApiBaseMetadata {
  /**
   * optionnally provide a transformer to stringify and parse the data
   * it will be used instead of the default serializer
   * to serialize data after validation and deserialize data before validation
   */
  readonly serializer?: Serializer;
}

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

export type ApiHeaders =
  | "accept"
  | "accept-encoding"
  | "accept-language"
  | "age"
  | "authorization"
  | "cache-control"
  | "content-disposition"
  | "content-encoding"
  | "content-language"
  | "content-length"
  | "content-location"
  | "content-type"
  | "cookie"
  | "date"
  | "etag"
  | "expect"
  | "expires"
  | "forwarded"
  | "from"
  | "host"
  | "if-match"
  | "if-modified-since"
  | "if-none-match"
  | "if-unmodified-since"
  | "keep-alive"
  | "last-modified"
  | "link"
  | "location"
  | "max-forwards"
  | "pragma"
  | "proxy-authenticate"
  | "proxy-authorization"
  | "range"
  | "referer"
  | "retry-after"
  | "set-cookie"
  | "strict-transport-security"
  | "transfer-encoding"
  | "user-agent"
  | "vary"
  | "via"
  | "warning"
  | "www-authenticate"
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
  /**
   * optionnally provide a serializer to stringify and parse the data
   * it will be used instead of the default serializer
   * to serialize data after validation and deserialize data before validation
   */
  readonly serializer?: Serializer;
}
