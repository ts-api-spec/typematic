import { z } from "zod";
import { tsSchema } from "./type-providers";
import { ReadonlyDeep } from "./utils.types";

const ApiZodSchema: SchemaType<ZodTypeProvider> = {
  validate: (schema, input) => schema.safeParse(input),
  validateAsync: (schema, input) => schema.safeParseAsync(input),
};

const ApiTypeScriptSchema = {
  validate: (schema: any, input: unknown) => {
    return { success: true, data: input } as SchemaValidationResult;
  },
  validateAsync: (schema: any, input: unknown) => {
    return Promise.resolve({
      success: true,
      data: input,
    }) as Promise<SchemaValidationResult>;
  },
};

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

function makeApiSpec<const T extends ReadonlyDeep<ApiSpec>>(spec: T): T {
  return spec;
}

export interface ApiTypeProvider<Schema = unknown> {
  schema: Schema;
  input: unknown;
  output: unknown;
}
export type InferInputTypeFromSchema<
  TypeProvider extends ApiTypeProvider,
  Schema
> = (TypeProvider & { schema: Schema })["input"];

export type InferOutputTypeFromSchema<
  TypeProvider extends ApiTypeProvider,
  Schema
> = (TypeProvider & { schema: Schema })["output"];

export type SchemaValidationResult =
  | { success: true; data: any }
  | { success: false; error: any };

export interface ZodTypeProvider
  extends ApiTypeProvider<{ _input: unknown; _output: unknown }> {
  input: this["schema"]["_input"];
  output: this["schema"]["_output"];
}

/**
 * Api specification
 */
export interface ApiSpec {
  metadata?: ApiMetadata;
  endpoints: Record<string, ApiEndpoint>;
  security?: ApiSecurity;
}

/**
 * Api metadata about the available servers
 */
interface ApiServer {
  url: string;
  name: string;
}

interface ApiSecurity {
  [name: string]: unknown;
}

interface SchemaType<TypeProvider extends ApiTypeProvider = ApiTypeProvider> {
  readonly _provider?: TypeProvider;
  validate: (schema: any, input: unknown) => SchemaValidationResult;
  validateAsync: (
    schema: any,
    input: unknown
  ) => Promise<SchemaValidationResult>;
}

interface ApiEndpoint {
  /**
   * optional metadata for the endpoint
   */
  metadata?: ApiEndpointMetadata;
  /**
   * HTTP method for the endpoint
   */
  method: ApiMethod;
  /**
   * Path for the endpoint
   */
  path: string;
  /**
   * Query parameters for the endpoint
   */
  query?: Record<string, ApiParameter>;
  /**
   * Path parameters for the endpoint
   */
  params?: Record<string, ApiParameter>;
  /**
   * Headers for the endpoint
   */
  headers?: Record<string, ApiParameter>;
  /**
   * Cookies for the endpoint
   */
  cookies?: Record<string, ApiParameter>;
  /**
   * Body for the endpoint
   */
  body?: ApiDataParameter;
  /**
   * Possible responses for the endpoint
   * The key is the HTTP status code
   * The key "default" is used for the default response (only use for error responses)
   */
  responses: {
    [key in number | "default"]?: ApiDataParameter;
  };
}

/**
 * Describes any Endpoint parameter (query, path, header, cookie)
 */
interface ApiParameter {
  /**
   * optional metadata for the parameter
   */
  metadata?: ParameterMetadata;
  /**
   * Schema for the parameter
   */
  schema: unknown;
}

/**
 * Describes the body of a request or response for an endpoint
 */
interface ApiDataParameter {
  /**
   * optional metadata for the parameter
   */
  metadata?: ApiDataMetadata;
  /**
   * Schema for the request or response body
   */
  schema: unknown;
}

/**
 * common metadatas
 */
interface ApiBaseMetadata {
  /**
   * optional description for the associated element
   */
  description?: string;
  /**
   * optionally override the default schema type for the associated element
   * This allows to use a custom schema type for the associated element
   * Implementations of API spec can make one or more schema handled byt default
   */
  schemaType?: SchemaType;
}

/**
 * API metadata
 * This metadata is used for the documentation and the client generation
 */
interface ApiMetadata extends ApiBaseMetadata {
  /**
   * Name of the API
   */
  name: string;
  /**
   * Version of the API
   */
  version: string;
  /**
   * List of servers for the API
   */
  servers?: ApiServer[];
}

/**
 * Endpoint metadata
 */
interface ApiEndpointMetadata extends ApiBaseMetadata {
  /**
   * Tags can be used for grouping endpoints in the documentation
   */
  tags?: string[];
  /**
   * Resource name for the endpoint, allows to implement cache normalization
   */
  resource?: string;
  /**
   * Resource ID for the endpoint, allows to implement cache normalization
   */
  resourceId?: string;
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
  contentType?: ApiMediaType; // default to application/json
  /**
   * Data format for the request or response body
   * json is the default format
   */
  format?: ApiDataFormat;
}

export type ApiSpecGetEndpoint<
  Api extends ReadonlyDeep<ApiSpec>,
  Endpoint extends keyof Api["endpoints"]
> = Api["endpoints"][Endpoint];

type ApiSpecGetPathsByMethod<
  Api extends ReadonlyDeep<ApiSpec>,
  Method extends ApiMethod
> = {
  [Endpoint in keyof Api["endpoints"]]: ApiSpecGetEndpoint<
    Api,
    Endpoint
  >["method"] extends Lowercase<Method> | Uppercase<Method>
    ? ApiSpecGetEndpoint<Api, Endpoint>["path"]
    : never;
}[keyof Api["endpoints"]];

export type ApiSpecGetEndpointByPath<
  Api extends ReadonlyDeep<ApiSpec>,
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
  Api extends ReadonlyDeep<ApiSpec>,
  Endpoint extends keyof Api["endpoints"]
> = ApiSpecGetEndpoint<Api, Endpoint>["body"];
type ApiSpecGetEndpointParams<
  Api extends ReadonlyDeep<ApiSpec>,
  Endpoint extends keyof Api["endpoints"]
> = ApiSpecGetEndpoint<Api, Endpoint>["params"];
type ApiSpecGetEndpointQueries<
  Api extends ReadonlyDeep<ApiSpec>,
  Endpoint extends keyof Api["endpoints"]
> = ApiSpecGetEndpoint<Api, Endpoint>["query"];
type ApiSpecGetEndpointQuery<
  Api extends ReadonlyDeep<ApiSpec>,
  Endpoint extends keyof Api["endpoints"],
  Query extends keyof ApiSpecGetEndpoint<Api, Endpoint>["query"]
> = ApiSpecGetEndpoint<Api, Endpoint>["query"][Query];
type ApiSpecGetEndpointHeaders<
  Api extends ReadonlyDeep<ApiSpec>,
  Endpoint extends keyof Api["endpoints"]
> = ApiSpecGetEndpoint<Api, Endpoint>["headers"];
type ApiSpecGetEndpointCookies<
  Api extends ReadonlyDeep<ApiSpec>,
  Endpoint extends keyof Api["endpoints"]
> = ApiSpecGetEndpoint<Api, Endpoint>["cookies"];
type ApiSpecGetEndpointResponse<
  Api extends ReadonlyDeep<ApiSpec>,
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
