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
interface ApiServer {
  readonly url: string;
  readonly name: string;
}

interface ApiSecurity {
  readonly [name: string]: unknown;
}

interface ApiEndpoint {
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
   */
  readonly query?: Record<string, ApiParameter>;
  /**
   * Path parameters for the endpoint
   */
  readonly params?: Record<string, ApiParameter>;
  /**
   * Headers for the endpoint
   */
  readonly headers?: Record<string, ApiParameter>;
  /**
   * Cookies for the endpoint
   */
  readonly cookies?: Record<string, ApiParameter>;
  /**
   * Body for the endpoint
   */
  readonly body?: ApiDataParameter;
  /**
   * Possible responses for the endpoint
   * The key is the HTTP status code
   * The key "default" is used for the default response (only use for error responses)
   */
  readonly responses: {
    readonly [key in number | "default"]?: ApiDataParameter;
  };
}

/**
 * Describes any Endpoint parameter (query, path, header, cookie)
 */
interface ApiParameter {
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
interface ApiDataParameter {
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
interface ApiBaseMetadata {
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
interface ApiMetadata extends ApiBaseMetadata {
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
interface ApiEndpointMetadata extends ApiBaseMetadata {
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

interface ParameterMetadata extends ApiBaseMetadata {}

/**
 * Mimes types for the request or response body
 * application/json is the default mime type
 */
type ApiMediaType =
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
type ApiDataFormat =
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
type ApiMethod =
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
interface ApiDataMetadata extends ApiBaseMetadata {
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

export type ApiGetEndpoint<
  Api extends ApiSpec,
  Endpoint extends keyof Api["endpoints"]
> = Api["endpoints"][Endpoint];

type ApiGetPathsByMethod<Api extends ApiSpec, Method extends ApiMethod> = {
  [Endpoint in keyof Api["endpoints"]]: ApiGetEndpoint<
    Api,
    Endpoint
  >["method"] extends Lowercase<Method> | Uppercase<Method>
    ? ApiGetEndpoint<Api, Endpoint>["path"]
    : never;
}[keyof Api["endpoints"]];

export type ApiGetEndpointByPath<
  Api extends ApiSpec,
  Method extends ApiMethod,
  Path extends ApiGetPathsByMethod<Api, Method>
> = {
  [Endpoint in keyof Api["endpoints"]]: ApiGetEndpoint<
    Api,
    Endpoint
  >["method"] extends Lowercase<Method> | Uppercase<Method>
    ? ApiGetEndpoint<Api, Endpoint>["path"] extends Path
      ? ApiGetEndpoint<Api, Endpoint>
      : never
    : never;
}[keyof Api["endpoints"]];

export type ApiGetEndpointBody<
  Api extends ApiSpec,
  Endpoint extends keyof Api["endpoints"]
> = ApiGetEndpoint<Api, Endpoint>["body"];

export type ApiGetEndpointParams<
  Api extends ApiSpec,
  Endpoint extends keyof Api["endpoints"]
> = ApiGetEndpoint<Api, Endpoint>["params"];

export type ApiGetEndpointQueries<
  Api extends ApiSpec,
  Endpoint extends keyof Api["endpoints"]
> = ApiGetEndpoint<Api, Endpoint>["query"];

export type ApiGetEndpointQuery<
  Api extends ApiSpec,
  Endpoint extends keyof Api["endpoints"],
  Query extends keyof ApiGetEndpoint<Api, Endpoint>["query"]
> = ApiGetEndpoint<Api, Endpoint>["query"][Query];

export type ApiGetEndpointHeaders<
  Api extends ApiSpec,
  Endpoint extends keyof Api["endpoints"]
> = ApiGetEndpoint<Api, Endpoint>["headers"];

export type ApiGetEndpointCookies<
  Api extends ApiSpec,
  Endpoint extends keyof Api["endpoints"]
> = ApiGetEndpoint<Api, Endpoint>["cookies"];

export type ApiGetEndpointResponseByStatus<
  Api extends ApiSpec,
  Endpoint extends keyof Api["endpoints"],
  StatusCode extends keyof ApiGetEndpoint<Api, Endpoint>["responses"]
> = ApiGetEndpoint<Api, Endpoint>["responses"][StatusCode];

export type ApiGetEndpointBodySchema<
  Api extends ApiSpec,
  Endpoint extends keyof Api["endpoints"]
> = ApiGetEndpointBody<Api, Endpoint> extends ApiDataParameter
  ? ApiGetEndpointBody<Api, Endpoint>["schema"]
  : never;

export type ApiGetSchemaType<
  Api extends ApiSpec,
  DefaultSchemaType extends SchemaType = typeof ApiTypeScriptSchema
> = Api["metadata"] extends infer Meta extends ApiBaseMetadata
  ? Meta["schemaType"] extends infer Type extends SchemaType
    ? Type
    : DefaultSchemaType
  : DefaultSchemaType;

export type ApiGetEndpointSchemaType<
  Api extends ApiSpec,
  Endpoint extends keyof Api["endpoints"],
  DefaultSchemaType extends SchemaType = typeof ApiTypeScriptSchema,
  ComputedEndpoint extends ApiEndpoint = ApiGetEndpoint<Api, Endpoint>
> = ComputedEndpoint["metadata"] extends infer Meta extends ApiBaseMetadata
  ? Meta["schemaType"] extends infer Type extends SchemaType
    ? Type
    : ApiGetSchemaType<Api, DefaultSchemaType>
  : ApiGetSchemaType<Api, DefaultSchemaType>;

export type ApiGetEndpointBodySchemaType<
  Api extends ApiSpec,
  Endpoint extends keyof Api["endpoints"],
  DefaultSchemaType extends SchemaType = typeof ApiTypeScriptSchema
> = ApiGetEndpointBody<
  Api,
  Endpoint
> extends infer Param extends ApiDataParameter
  ? Param["metadata"] extends infer Meta extends ApiBaseMetadata
    ? Meta["schemaType"] extends infer Type extends SchemaType
      ? Type
      : ApiGetEndpointSchemaType<Api, Endpoint, DefaultSchemaType>
    : ApiGetEndpointSchemaType<Api, Endpoint, DefaultSchemaType>
  : ApiGetEndpointSchemaType<Api, Endpoint, DefaultSchemaType>;

export type ApiInferEndpointBody<
  Api extends ApiSpec,
  Endpoint extends keyof Api["endpoints"],
  DefaultSchemaType extends SchemaType = typeof ApiTypeScriptSchema
> = ApiGetEndpointBody<
  Api,
  Endpoint
> extends infer Param extends ApiDataParameter
  ? InferInputTypeFromSchema<
      NonNullable<
        ApiGetEndpointBodySchemaType<
          Api,
          Endpoint,
          DefaultSchemaType
        >["_provider"]
      >,
      Param["schema"]
    >
  : never;
