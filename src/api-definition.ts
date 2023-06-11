import { z } from "zod";
import type { SchemaType } from "./schema-type.types";
import { ApiZodSchema } from "./schema-type-zod";
import { ApiTypeScriptSchema, tsSchema } from "./schema-type-ts";

// example of a complete API specification
export const apiSpec = makeApiSpec({
  metadata: {
    name: "my-api",
    version: "1.0.0",
    description: "My API description",
    servers: [
      {
        url: "http://localhost:3000",
        name: "development",
      },
      {
        url: "https://jsonplaceholder.typicode.com",
        name: "production",
      },
    ],
    schemaType: ApiZodSchema, // optional, allows to specify the schema adapter to use, for all shemas in definitions, default to "zod"
  },
  // endpoints with aliases
  endpoints: {
    getPosts: {
      metadata: {
        description: "Get all posts",
        schemaType: ApiTypeScriptSchema, // override the parent defined schema adapter (ZodSchemaAdapter)
      },
      method: "GET",
      path: "/posts",
      query: {
        userId: {
          metadata: {
            description: "The ID of the user", // allows to add a description to the parameter for the documentation outside of the schema
            schemaType: ApiZodSchema, // override the parent defined schema adapter (TypeScriptSchemaAdapter)
          },
          schema: z.number().optional(), // zod schema since the schema adapter is ZodSchemaAdapter
        },
        id: {
          metadata: {
            description: "The ID of the post",
          },
          schema: tsSchema<number>(), // typescript schema since the schema adapter is TypeScriptSchemaAdapter
        },
      },
      responses: {
        200: {
          schema: z.array(
            z.object({
              userId: z.number(),
              id: z.number(),
              title: z.string(),
              body: z.string(),
            })
          ),
        },
        404: {
          schema: z
            .object({
              message: z.string(),
            })
            .describe("Not found"),
        },
      },
    },
    getPost: {
      method: "GET",
      path: "/posts/:id",
      params: {
        id: {
          schema: z.number().int().positive().describe("The ID of the post"),
        },
      },
      responses: {
        200: {
          schema: z.object({
            userId: z.number(),
            id: z.number(),
            title: z.string(),
            body: z.string(),
          }),
        },
        404: {
          schema: z
            .object({
              message: z.string(),
            })
            .describe("Not found"),
        },
      },
    },
    attachFile: {
      method: "POST",
      path: "/posts/:id/attachment",
      params: {
        id: {
          schema: z.number().int().positive().describe("The ID of the post"),
        },
      },
      body: {
        metadata: {
          description: "The file to attach",
          format: "form-data", // allows to specify the format of the body for the documentation and the client generation
        },
        schema: z.object({
          file: z.instanceof(File),
        }),
      },
      responses: {
        204: {
          schema: z.undefined().describe("No content"),
        },
        403: {
          schema: z
            .object({
              message: z.string(),
            })
            .describe("Forbidden"),
        },
      },
    },
    getAttachment: {
      method: "GET",
      path: "/posts/:id/attachment",
      params: {
        id: {
          schema: z.number().int().positive().describe("The ID of the post"),
        },
      },
      responses: {
        200: {
          metadata: {
            description: "The file attached to the post",
            format: "blob", // allows to specify the format of the response for the documentation and the client generation
          },
          schema: z.instanceof(Blob),
        },
        404: {
          schema: z
            .object({
              message: z.string(),
            })
            .describe("Not found"),
        },
      },
    },
  },
});

function makeApiSpec<const T extends ApiSpec>(spec: T): T {
  return spec;
}

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

export type ApiSpecGetEndpoint<
  Api extends ApiSpec,
  Endpoint extends keyof Api["endpoints"]
> = Api["endpoints"][Endpoint];

type ApiSpecGetPathsByMethod<Api extends ApiSpec, Method extends ApiMethod> = {
  [Endpoint in keyof Api["endpoints"]]: ApiSpecGetEndpoint<
    Api,
    Endpoint
  >["method"] extends Lowercase<Method> | Uppercase<Method>
    ? ApiSpecGetEndpoint<Api, Endpoint>["path"]
    : never;
}[keyof Api["endpoints"]];

export type ApiSpecGetEndpointByPath<
  Api extends ApiSpec,
  Method extends ApiMethod,
  Path extends ApiSpecGetPathsByMethod<Api, Method>
> = {
  [Endpoint in keyof Api["endpoints"]]: ApiSpecGetEndpoint<
    Api,
    Endpoint
  >["method"] extends Lowercase<Method> | Uppercase<Method>
    ? ApiSpecGetEndpoint<Api, Endpoint>["path"] extends Path
      ? ApiSpecGetEndpoint<Api, Endpoint>
      : never
    : never;
}[keyof Api["endpoints"]];

type ApiSpecGetEndpointBody<
  Api extends ApiSpec,
  Endpoint extends keyof Api["endpoints"]
> = ApiSpecGetEndpoint<Api, Endpoint>["body"];
type ApiSpecGetEndpointParams<
  Api extends ApiSpec,
  Endpoint extends keyof Api["endpoints"]
> = ApiSpecGetEndpoint<Api, Endpoint>["params"];
type ApiSpecGetEndpointQueries<
  Api extends ApiSpec,
  Endpoint extends keyof Api["endpoints"]
> = ApiSpecGetEndpoint<Api, Endpoint>["query"];
type ApiSpecGetEndpointQuery<
  Api extends ApiSpec,
  Endpoint extends keyof Api["endpoints"],
  Query extends keyof ApiSpecGetEndpoint<Api, Endpoint>["query"]
> = ApiSpecGetEndpoint<Api, Endpoint>["query"][Query];
type ApiSpecGetEndpointHeaders<
  Api extends ApiSpec,
  Endpoint extends keyof Api["endpoints"]
> = ApiSpecGetEndpoint<Api, Endpoint>["headers"];
type ApiSpecGetEndpointCookies<
  Api extends ApiSpec,
  Endpoint extends keyof Api["endpoints"]
> = ApiSpecGetEndpoint<Api, Endpoint>["cookies"];
type ApiSpecGetEndpointResponse<
  Api extends ApiSpec,
  Endpoint extends keyof Api["endpoints"],
  StatusCode extends keyof ApiSpecGetEndpoint<Api, Endpoint>["responses"]
> = ApiSpecGetEndpoint<Api, Endpoint>["responses"][StatusCode];

type T0 = ApiSpecGetEndpoint<typeof apiSpec, "getPosts">;
type T1 = ApiSpecGetEndpointBody<typeof apiSpec, "getPosts">;
type T2 = ApiSpecGetEndpointParams<typeof apiSpec, "getPosts">;
type T3 = ApiSpecGetEndpointQueries<typeof apiSpec, "getPosts">;
type T3_1 = ApiSpecGetEndpointQuery<typeof apiSpec, "getPosts", "userId">;
type T4 = ApiSpecGetEndpointHeaders<typeof apiSpec, "getPosts">;
type T5 = ApiSpecGetEndpointCookies<typeof apiSpec, "getPosts">;
type T6 = ApiSpecGetEndpointResponse<typeof apiSpec, "getPosts", 200>;
type T7 = ApiSpecGetEndpointResponse<typeof apiSpec, "getPosts", 404>;
