import type {
  ApiBaseMetadata,
  ApiRequestBodyParameter,
  ApiEndpoint,
  ApiEntry,
  ApiMethod,
  ApiParameter,
  ApiSpec,
} from "./types";
import type {
  ApiGetSchemaOf,
  ApiGetPathsByMethod,
  ApiGetEndpoint,
  ApiGetEndpointByPath,
  ApiGetEndpointBody,
  ApiGetEndpointBodyByPath,
  ApiGetEndpointBodySchema,
  ApiGetEndpointBodySchemaByPath,
} from "./parser.types";
import type { InferInputTypeFromSchema, InferOutputTypeFromSchema, SchemaType } from "./schema-type.types";
import { ApiTypeScriptSchema } from "./schema-type-ts";

declare global {
  /**
   * Schema type registry
   *
   * Allows to register custom schema default schema type
   *
   * The default schema type is used when no schema type is defined in the api spec
   *
   * If Api spec implementors want to use a different schema type, they can register a new one by overriding the default
   *
   * @example
   * ```ts
   * declare global {
   *  interface SchemaTypeRegistry {
   *   default(): typeof MyCustomSchemaType;
   *  }
   * }
   * ```
   */
  export interface SchemaTypeRegistry {
    default(): typeof ApiTypeScriptSchema;
  }
}

/**
 * Get the schema type for the api spec by looking at the metadata
 * Allows to define a default schema type for the api spec if none is defined
 * @param Api - Api spec
 * @returns Schema type
 */
export type ApiGetSchemaType<Api extends ApiSpec> = Api["metadata"] extends infer $Metadata extends ApiBaseMetadata
  ? $Metadata["schemaType"] extends infer $SchemaType extends SchemaType
    ? $SchemaType
    : ReturnType<SchemaTypeRegistry["default"]>
  : ReturnType<SchemaTypeRegistry["default"]>;

/**
 * Get the schema type for an endpoint by looking at the metadata
 * If the endpoint has no metadata, the schema type for the api spec is returned
 * Allows to define a default schema type if none is defined in any of the metadata
 * @param Api - Api spec
 * @param Endpoint - Endpoint name
 * @returns Schema type
 */
export type ApiGetEndpointSchemaType<
  Api extends ApiSpec,
  Endpoint extends keyof Api["endpoints"],
  $Endpoint extends ApiEndpoint = ApiGetEndpoint<Api, Endpoint>
> = $Endpoint["metadata"] extends infer $Metadata extends ApiBaseMetadata
  ? $Metadata["schemaType"] extends infer $SchemaType extends SchemaType
    ? $SchemaType
    : ApiGetSchemaType<Api>
  : ApiGetSchemaType<Api>;

/**
 * Get the schema type for an endpoint by looking at the metadata
 * If the endpoint has no metadata, the schema type for the api spec is returned
 * Allows to define a default schema type if none is defined in any of the metadata
 * @param Api - Api spec
 * @param Method - HTTP method
 * @param Path - Endpoint path
 * @returns Schema type
 */
export type ApiGetEndpointSchemaTypeByPath<
  Api extends ApiSpec,
  Method extends ApiMethod,
  Path extends ApiGetPathsByMethod<Api, Method>,
  $Endpoint extends ApiEndpoint = ApiGetEndpointByPath<Api, Method, Path>
> = $Endpoint["metadata"] extends infer $Metadata extends ApiBaseMetadata
  ? $Metadata["schemaType"] extends infer $SchemaType extends SchemaType
    ? $SchemaType
    : ApiGetSchemaType<Api>
  : ApiGetSchemaType<Api>;

/**
 * Get the schema type for the body of an endpoint by looking at the metadata
 * If the body has no metadata, the schema type for the endpoint is returned
 * If the endpoint has no metadata, the schema type for the api spec is returned
 * Allows to define a default schema type if none is defined in any of the metadata
 * @param Api - Api spec
 * @param Endpoint - Endpoint name
 * @returns Schema type
 */
export type ApiGetEndpointBodySchemaType<
  Api extends ApiSpec,
  Endpoint extends keyof Api["endpoints"]
> = ApiGetEndpointBody<Api, Endpoint> extends infer $Body extends ApiRequestBodyParameter
  ? $Body["metadata"] extends infer $Metadata extends ApiBaseMetadata
    ? $Metadata["schemaType"] extends infer $SchemaType extends SchemaType
      ? $SchemaType
      : ApiGetEndpointSchemaType<Api, Endpoint>
    : ApiGetEndpointSchemaType<Api, Endpoint>
  : ApiGetEndpointSchemaType<Api, Endpoint>;

/**
 * Get the schema type for the body of an endpoint by looking at the metadata
 * If the body has no metadata, the schema type for the endpoint is returned
 * If the endpoint has no metadata, the schema type for the api spec is returned
 * Allows to define a default schema type if none is defined in any of the metadata
 * @param Api - Api spec
 * @param Method - HTTP method
 * @param Path - Endpoint path
 * @returns Schema type
 */
export type ApiGetEndpointBodySchemaTypeByPath<
  Api extends ApiSpec,
  Method extends ApiMethod,
  Path extends ApiGetPathsByMethod<Api, Method>
> = ApiGetEndpointBodyByPath<Api, Method, Path> extends infer $Body extends ApiRequestBodyParameter
  ? $Body["metadata"] extends infer $Metadata extends ApiBaseMetadata
    ? $Metadata["schemaType"] extends infer $SchemaType extends SchemaType
      ? $SchemaType
      : ApiGetEndpointSchemaTypeByPath<Api, Method, Path>
    : ApiGetEndpointSchemaTypeByPath<Api, Method, Path>
  : ApiGetEndpointSchemaTypeByPath<Api, Method, Path>;

/**
 * Get the schema type for an entry of an endpoint by looking at the metadata
 * If the entry has no metadata, the schema type for the endpoint is returned
 * If the endpoint has no metadata, the schema type for the api spec is returned
 * Allows to define a default schema type if none is defined in any of the metadata
 * @param Api - Api spec
 * @param Endpoint - Endpoint name
 * @param Entry - Entry name
 * @param EntryParam - Entry parameter name
 * @returns Schema type
 */
export type ApiGetEndpointEntrySchemaType<
  Api extends ApiSpec,
  Endpoint extends keyof Api["endpoints"],
  Entry extends ApiEntry,
  EntryParam extends keyof ApiGetEndpoint<Api, Endpoint>[Entry]
> = ApiGetEndpoint<Api, Endpoint>[Entry][EntryParam] extends infer $Entry extends ApiParameter
  ? $Entry["metadata"] extends infer $Metadata extends ApiBaseMetadata
    ? $Metadata["schemaType"] extends infer $SchemaType extends SchemaType
      ? $SchemaType
      : ApiGetEndpointSchemaType<Api, Endpoint>
    : ApiGetEndpointSchemaType<Api, Endpoint>
  : ApiGetEndpointSchemaType<Api, Endpoint>;

/**
 * Get the schema type for an entry of an endpoint by looking at the metadata
 * If the entry has no metadata, the schema type for the endpoint is returned
 * If the endpoint has no metadata, the schema type for the api spec is returned
 * Allows to define a default schema type if none is defined in any of the metadata
 * @param Api - Api spec
 * @param Method - HTTP method
 * @param Path - Endpoint path
 * @param Entry - Entry name
 * @param EntryParam - Entry parameter name
 * @returns Schema type
 */
export type ApiGetEndpointEntrySchemaTypeByPath<
  Api extends ApiSpec,
  Method extends ApiMethod,
  Path extends ApiGetPathsByMethod<Api, Method>,
  Entry extends ApiEntry,
  EntryParam extends keyof ApiGetEndpointByPath<Api, Method, Path>[Entry]
> = ApiGetEndpointByPath<Api, Method, Path>[Entry][EntryParam] extends infer $Entry extends ApiParameter
  ? $Entry["metadata"] extends infer $Metadata extends ApiBaseMetadata
    ? $Metadata["schemaType"] extends infer $SchemaType extends SchemaType
      ? $SchemaType
      : ApiGetEndpointSchemaTypeByPath<Api, Method, Path>
    : ApiGetEndpointSchemaTypeByPath<Api, Method, Path>
  : ApiGetEndpointSchemaTypeByPath<Api, Method, Path>;

/**
 * Infer the typescript input type for an endpoint body
 * input type is the data type that needs to be passed as body to the endpoint before validating it
 * Use SchemaType cascading rules to determine the schema type to use
 * Cascading rules:
 * 1. If the body has a schema type defined, use it
 * 2. Else if the endpoint has a schema type defined, use it
 * 3. Else if the api spec has a schema type defined, use it
 * 4. Else use the default schema type
 * @param Api - Api spec
 * @param Endpoint - Endpoint name
 * @returns Typescript Input type for the endpoint body
 */
export type ApiInferEndpointInputBody<
  Api extends ApiSpec,
  Endpoint extends keyof Api["endpoints"],
  $SchemaType extends SchemaType = ApiGetEndpointBodySchemaType<Api, Endpoint>,
  $Schema = ApiGetEndpointBodySchema<Api, Endpoint>
> = InferInputTypeFromSchema<NonNullable<$SchemaType["_provider"]>, $Schema>;

/**
 * Infer the typescript input type for an endpoint body
 * input type is the data type that needs to be passed as body to the endpoint before validating it
 * Use SchemaType cascading rules to determine the schema type to use
 * Cascading rules:
 * 1. If the body has a schema type defined, use it
 * 2. Else if the endpoint has a schema type defined, use it
 * 3. Else if the api spec has a schema type defined, use it
 * 4. Else use the default schema type
 * @param Api - Api spec
 * @param Method - HTTP method
 * @param Path - Endpoint path
 * @returns Typescript Input type for the endpoint body
 */
export type ApiInferEndpointInputBodyByPath<
  Api extends ApiSpec,
  Method extends ApiMethod,
  Path extends ApiGetPathsByMethod<Api, Method>,
  $SchemaType extends SchemaType = ApiGetEndpointBodySchemaTypeByPath<Api, Method, Path>,
  $Schema = ApiGetEndpointBodySchemaByPath<Api, Method, Path>
> = InferInputTypeFromSchema<NonNullable<$SchemaType["_provider"]>, $Schema>;

/**
 * Infer the typescript output type for an endpoint body
 * output type is the data type that is returned after validating the endpoint body
 * Use SchemaType cascading rules to determine the schema type to use
 * Cascading rules:
 * 1. If the body has a schema type defined, use it
 * 2. Else if the endpoint has a schema type defined, use it
 * 3. Else if the api spec has a schema type defined, use it
 * 4. Else use the default schema type
 * @param Api - Api spec
 * @param Endpoint - Endpoint name
 * @returns Typescript Output type for the endpoint body
 */
export type ApiInferEndpointOutputBody<
  Api extends ApiSpec,
  Endpoint extends keyof Api["endpoints"],
  $SchemaType extends SchemaType = ApiGetEndpointBodySchemaType<Api, Endpoint>,
  $Schema = ApiGetEndpointBodySchema<Api, Endpoint>
> = InferOutputTypeFromSchema<NonNullable<$SchemaType["_provider"]>, $Schema>;

/**
 * Infer the typescript output type for an endpoint body
 * output type is the data type that is returned after validating the endpoint body
 * Use SchemaType cascading rules to determine the schema type to use
 * Cascading rules:
 * 1. If the body has a schema type defined, use it
 * 2. Else if the endpoint has a schema type defined, use it
 * 3. Else if the api spec has a schema type defined, use it
 * 4. Else use the default schema type
 * @param Api - Api spec
 * @param Method - HTTP method
 * @param Path - Endpoint path
 * @returns Typescript Output type for the endpoint body
 */
export type ApiInferEndpointOutputBodyByPath<
  Api extends ApiSpec,
  Method extends ApiMethod,
  Path extends ApiGetPathsByMethod<Api, Method>,
  $SchemaType extends SchemaType = ApiGetEndpointBodySchemaTypeByPath<Api, Method, Path>,
  $Schema = ApiGetEndpointBodySchemaByPath<Api, Method, Path>
> = InferOutputTypeFromSchema<NonNullable<$SchemaType["_provider"]>, $Schema>;

/**
 * Infer the typescript input type for an endpoint entry (path, query, header, cookie, response)
 * input type is the data type that needs to be passed as entry to the endpoint before validating it
 * Use SchemaType cascading rules to determine the schema type to use
 * Cascading rules:
 * 1. If the entry has a schema type defined, use it
 * 2. Else if the endpoint has a schema type defined, use it
 * 3. Else if the api spec has a schema type defined, use it
 * 4. Else use the default schema type
 * @param Api - Api spec
 * @param Endpoint - Endpoint name
 * @param Entry - Entry name
 * @param EntryParam - Entry parameter name
 * @returns Typescript Input type for the endpoint entry
 */
export type ApiInferEndpointInputEntry<
  Api extends ApiSpec,
  Endpoint extends keyof Api["endpoints"],
  Entry extends ApiEntry,
  EntryParam extends keyof ApiGetEndpoint<Api, Endpoint>[Entry],
  $SchemaType extends SchemaType = ApiGetEndpointEntrySchemaType<Api, Endpoint, Entry, EntryParam>,
  $EntryParam = ApiGetEndpoint<Api, Endpoint>[Entry][EntryParam]
> = InferInputTypeFromSchema<NonNullable<$SchemaType["_provider"]>, ApiGetSchemaOf<$EntryParam>>;

/**
 * Infer the typescript input type for an endpoint entry (path, query, header, cookie, response)
 * input type is the data type that needs to be passed as entry to the endpoint before validating it
 * Use SchemaType cascading rules to determine the schema type to use
 * Cascading rules:
 * 1. If the entry has a schema type defined, use it
 * 2. Else if the endpoint has a schema type defined, use it
 * 3. Else if the api spec has a schema type defined, use it
 * 4. Else use the default schema type
 * @param Api - Api spec
 * @param Method - HTTP method
 * @param Path - Endpoint path
 * @param Entry - Entry name
 * @param EntryParam - Entry parameter name
 * @returns Typescript Input type for the endpoint entry
 */
export type ApiInferEndpointInputEntryByPath<
  Api extends ApiSpec,
  Method extends ApiMethod,
  Path extends ApiGetPathsByMethod<Api, Method>,
  Entry extends ApiEntry,
  EntryParam extends keyof ApiGetEndpointByPath<Api, Method, Path>[Entry],
  $SchemaType extends SchemaType = ApiGetEndpointEntrySchemaTypeByPath<Api, Method, Path, Entry, EntryParam>,
  $EntryParam = ApiGetEndpointByPath<Api, Method, Path>[Entry][EntryParam]
> = InferInputTypeFromSchema<NonNullable<$SchemaType["_provider"]>, ApiGetSchemaOf<$EntryParam>>;

/**
 * Infer the typescript output type for an endpoint entry (path, query, header, cookie, response)
 * output type is the data type that is returned by the endpoint after validating it
 * Use SchemaType cascading rules to determine the schema type to use
 * Cascading rules:
 * 1. If the entry has a schema type defined, use it
 * 2. Else if the endpoint has a schema type defined, use it
 * 3. Else if the api spec has a schema type defined, use it
 * 4. Else use the default schema type
 * @param Api - Api spec
 * @param Endpoint - Endpoint name
 * @param Entry - Entry name
 * @param EntryParam - Entry parameter name
 * @returns Typescript Output type for the endpoint entry
 */
export type ApiInferEndpointOutputEntry<
  Api extends ApiSpec,
  Endpoint extends keyof Api["endpoints"],
  Entry extends ApiEntry,
  EntryParam extends keyof ApiGetEndpoint<Api, Endpoint>[Entry],
  $SchemaType extends SchemaType = ApiGetEndpointEntrySchemaType<Api, Endpoint, Entry, EntryParam>,
  $EntryParam = ApiGetEndpoint<Api, Endpoint>[Entry][EntryParam]
> = InferOutputTypeFromSchema<NonNullable<$SchemaType["_provider"]>, ApiGetSchemaOf<$EntryParam>>;

/**
 * Infer the typescript output type for an endpoint entry (path, query, header, cookie, response)
 * output type is the data type that is returned by the endpoint after validating it
 * Use SchemaType cascading rules to determine the schema type to use
 * Cascading rules:
 * 1. If the entry has a schema type defined, use it
 * 2. Else if the endpoint has a schema type defined, use it
 * 3. Else if the api spec has a schema type defined, use it
 * 4. Else use the default schema type
 * @param Api - Api spec
 * @param Method - HTTP method
 * @param Path - Endpoint path
 * @param Entry - Entry name
 * @param EntryParam - Entry parameter name
 * @returns Typescript Output type for the endpoint entry
 */
export type ApiInferEndpointOutputEntryByPath<
  Api extends ApiSpec,
  Method extends ApiMethod,
  Path extends ApiGetPathsByMethod<Api, Method>,
  Entry extends ApiEntry,
  EntryParam extends keyof ApiGetEndpointByPath<Api, Method, Path>[Entry],
  $SchemaType extends SchemaType = ApiGetEndpointEntrySchemaTypeByPath<Api, Method, Path, Entry, EntryParam>,
  $EntryParam = ApiGetEndpointByPath<Api, Method, Path>[Entry][EntryParam]
> = InferOutputTypeFromSchema<NonNullable<$SchemaType["_provider"]>, ApiGetSchemaOf<$EntryParam>>;

/**
 * Infer the typescript input type for an endpoint path parameter
 * input type is the data type that needs to be passed as path parameter to the endpoint before validating it
 * Use SchemaType cascading rules to determine the schema type to use
 * Cascading rules:
 * 1. If the path parameter has a schema type defined, use it
 * 2. Else if the endpoint has a schema type defined, use it
 * 3. Else if the api spec has a schema type defined, use it
 * 4. Else use the default schema type
 * @param Api - Api spec
 * @param Endpoint - Endpoint name
 * @param PathParam - Path parameter name
 * @returns Typescript Input type for the endpoint path parameter
 */
export type ApiInferEndpointInputParam<
  Api extends ApiSpec,
  Endpoint extends keyof Api["endpoints"],
  PathParam extends keyof ApiGetEndpoint<Api, Endpoint>["params"]
> = ApiInferEndpointInputEntry<Api, Endpoint, "params", PathParam>;

/**
 * Infer the typescript input type for an endpoint path parameter
 * input type is the data type that needs to be passed as path parameter to the endpoint before validating it
 * Use SchemaType cascading rules to determine the schema type to use
 * Cascading rules:
 * 1. If the path parameter has a schema type defined, use it
 * 2. Else if the endpoint has a schema type defined, use it
 * 3. Else if the api spec has a schema type defined, use it
 * 4. Else use the default schema type
 * @param Api - Api spec
 * @param Method - HTTP method
 * @param Path - Endpoint path
 * @param PathParam - Path parameter name
 * @returns Typescript Input type for the endpoint path parameter
 */
export type ApiInferEndpointInputParamByPath<
  Api extends ApiSpec,
  Method extends ApiMethod,
  Path extends ApiGetPathsByMethod<Api, Method>,
  PathParam extends keyof ApiGetEndpointByPath<Api, Method, Path>["params"]
> = ApiInferEndpointInputEntryByPath<Api, Method, Path, "params", PathParam>;

/**
 * Infer the typescript input type for an endpoint query parameter
 * input type is the data type that needs to be passed as query parameter to the endpoint before validating it
 * Use SchemaType cascading rules to determine the schema type to use
 * Cascading rules:
 * 1. If the query parameter has a schema type defined, use it
 * 2. Else if the endpoint has a schema type defined, use it
 * 3. Else if the api spec has a schema type defined, use it
 * 4. Else use the default schema type
 * @param Api - Api spec
 * @param Endpoint - Endpoint name
 * @param QueryParam - Query parameter name
 * @returns Typescript Input type for the endpoint query parameter
 */
export type ApiInferEndpointInputQuery<
  Api extends ApiSpec,
  Endpoint extends keyof Api["endpoints"],
  QueryParam extends keyof ApiGetEndpoint<Api, Endpoint>["query"]
> = ApiInferEndpointInputEntry<Api, Endpoint, "query", QueryParam>;

/**
 * Infer the typescript input type for an endpoint query parameter
 * input type is the data type that needs to be passed as query parameter to the endpoint before validating it
 * Use SchemaType cascading rules to determine the schema type to use
 * Cascading rules:
 * 1. If the query parameter has a schema type defined, use it
 * 2. Else if the endpoint has a schema type defined, use it
 * 3. Else if the api spec has a schema type defined, use it
 * 4. Else use the default schema type
 * @param Api - Api spec
 * @param Endpoint - Endpoint name
 * @param QueryParam - Query parameter name
 * @returns Typescript Input type for the endpoint query parameter
 */
export type ApiInferEndpointInputQueryByPath<
  Api extends ApiSpec,
  Method extends ApiMethod,
  Path extends ApiGetPathsByMethod<Api, Method>,
  QueryParam extends keyof ApiGetEndpointByPath<Api, Method, Path>["query"]
> = ApiInferEndpointInputEntryByPath<Api, Method, Path, "query", QueryParam>;

/**
 * Infer the typescript input type for an endpoint header parameter
 * input type is the data type that needs to be passed as header parameter to the endpoint before validating it
 * Use SchemaType cascading rules to determine the schema type to use
 * Cascading rules:
 * 1. If the header parameter has a schema type defined, use it
 * 2. Else if the endpoint has a schema type defined, use it
 * 3. Else if the api spec has a schema type defined, use it
 * 4. Else use the default schema type
 * @param Api - Api spec
 * @param Endpoint - Endpoint name
 * @param HeaderParam - Header parameter name
 * @returns Typescript Input type for the endpoint header parameter
 */
export type ApiInferEndpointInputHeader<
  Api extends ApiSpec,
  Endpoint extends keyof Api["endpoints"],
  HeaderParam extends keyof ApiGetEndpoint<Api, Endpoint>["headers"]
> = ApiInferEndpointInputEntry<Api, Endpoint, "headers", HeaderParam>;

/**
 * Infer the typescript input type for an endpoint header parameter
 * input type is the data type that needs to be passed as header parameter to the endpoint before validating it
 * Use SchemaType cascading rules to determine the schema type to use
 * Cascading rules:
 * 1. If the header parameter has a schema type defined, use it
 * 2. Else if the endpoint has a schema type defined, use it
 * 3. Else if the api spec has a schema type defined, use it
 * 4. Else use the default schema type
 * @param Api - Api spec
 * @param Endpoint - Endpoint name
 * @param HeaderParam - Header parameter name
 * @returns Typescript Input type for the endpoint header parameter
 */
export type ApiInferEndpointInputHeaderByPath<
  Api extends ApiSpec,
  Method extends ApiMethod,
  Path extends ApiGetPathsByMethod<Api, Method>,
  HeaderParam extends keyof ApiGetEndpointByPath<Api, Method, Path>["headers"]
> = ApiInferEndpointInputEntryByPath<Api, Method, Path, "headers", HeaderParam>;

/**
 * Infer the typescript input type for an endpoint cookie parameter
 * input type is the data type that needs to be passed as cookie parameter to the endpoint before validating it
 * Use SchemaType cascading rules to determine the schema type to use
 * Cascading rules:
 * 1. If the cookie parameter has a schema type defined, use it
 * 2. Else if the endpoint has a schema type defined, use it
 * 3. Else if the api spec has a schema type defined, use it
 * 4. Else use the default schema type
 * @param Api - Api spec
 * @param Endpoint - Endpoint name
 * @param CookieParam - Cookie parameter name
 * @returns Typescript Input type for the endpoint cookie parameter
 */
export type ApiInferEndpointInputCookie<
  Api extends ApiSpec,
  Endpoint extends keyof Api["endpoints"],
  CookieParam extends keyof ApiGetEndpoint<Api, Endpoint>["cookies"]
> = ApiInferEndpointInputEntry<Api, Endpoint, "cookies", CookieParam>;

/**
 * Infer the typescript input type for an endpoint cookie parameter
 * input type is the data type that needs to be passed as cookie parameter to the endpoint before validating it
 * Use SchemaType cascading rules to determine the schema type to use
 * Cascading rules:
 * 1. If the cookie parameter has a schema type defined, use it
 * 2. Else if the endpoint has a schema type defined, use it
 * 3. Else if the api spec has a schema type defined, use it
 * 4. Else use the default schema type
 * @param Api - Api spec
 * @param Endpoint - Endpoint name
 * @param CookieParam - Cookie parameter name
 * @returns Typescript Input type for the endpoint cookie parameter
 */
export type ApiInferEndpointInputCookieByPath<
  Api extends ApiSpec,
  Method extends ApiMethod,
  Path extends ApiGetPathsByMethod<Api, Method>,
  CookieParam extends keyof ApiGetEndpointByPath<Api, Method, Path>["cookies"]
> = ApiInferEndpointInputEntryByPath<Api, Method, Path, "cookies", CookieParam>;

/**
 * Infer the typescript input type for an endpoint response body
 * input type is the data type that needs to be passed as response body to the endpoint before validating it
 * Use SchemaType cascading rules to determine the schema type to use
 * Cascading rules:
 * 1. If the response body has a schema type defined, use it
 * 2. Else if the endpoint has a schema type defined, use it
 * 3. Else if the api spec has a schema type defined, use it
 * 4. Else use the default schema type
 * @param Api - Api spec
 * @param Endpoint - Endpoint name
 * @param StatusCode - Response status code
 * @returns Typescript Input type for the endpoint response body
 */
export type ApiInferEndpointInputResponse<
  Api extends ApiSpec,
  Endpoint extends keyof Api["endpoints"],
  StatusCode extends keyof ApiGetEndpoint<Api, Endpoint>["responses"]
> = ApiInferEndpointInputEntry<Api, Endpoint, "responses", StatusCode>;

/**
 * Infer the typescript input type for an endpoint response body
 * input type is the data type that needs to be passed as response body to the endpoint before validating it
 * Use SchemaType cascading rules to determine the schema type to use
 * Cascading rules:
 * 1. If the response body has a schema type defined, use it
 * 2. Else if the endpoint has a schema type defined, use it
 * 3. Else if the api spec has a schema type defined, use it
 * 4. Else use the default schema type
 * @param Api - Api spec
 * @param Endpoint - Endpoint name
 * @param StatusCode - Response status code
 * @returns Typescript Input type for the endpoint response body
 */
export type ApiInferEndpointInputResponseByPath<
  Api extends ApiSpec,
  Method extends ApiMethod,
  Path extends ApiGetPathsByMethod<Api, Method>,
  StatusCode extends keyof ApiGetEndpointByPath<Api, Method, Path>["responses"]
> = ApiInferEndpointInputEntryByPath<Api, Method, Path, "responses", StatusCode>;

/**
 * Infer the typescript output type for an endpoint path parameter
 * output type is the data type that is returned after validating the endpoint path parameter
 * Use SchemaType cascading rules to determine the schema type to use
 * Cascading rules:
 * 1. If the path parameter has a schema type defined, use it
 * 2. Else if the endpoint has a schema type defined, use it
 * 3. Else if the api spec has a schema type defined, use it
 * 4. Else use the default schema type
 * @param Api - Api spec
 * @param Endpoint - Endpoint name
 * @param PathParam - Path parameter name
 * @returns Typescript Output type for the endpoint path parameter
 */
export type ApiInferEndpointOutputParam<
  Api extends ApiSpec,
  Endpoint extends keyof Api["endpoints"],
  PathParam extends keyof ApiGetEndpoint<Api, Endpoint>["params"]
> = ApiInferEndpointOutputEntry<Api, Endpoint, "params", PathParam>;

/**
 * Infer the typescript output type for an endpoint path parameter
 * output type is the data type that is returned after validating the endpoint path parameter
 * Use SchemaType cascading rules to determine the schema type to use
 * Cascading rules:
 * 1. If the path parameter has a schema type defined, use it
 * 2. Else if the endpoint has a schema type defined, use it
 * 3. Else if the api spec has a schema type defined, use it
 * 4. Else use the default schema type
 * @param Api - Api spec
 * @param Endpoint - Endpoint name
 * @param PathParam - Path parameter name
 * @returns Typescript Output type for the endpoint path parameter
 */
export type ApiInferEndpointOutputParamByPath<
  Api extends ApiSpec,
  Method extends ApiMethod,
  Path extends ApiGetPathsByMethod<Api, Method>,
  PathParam extends keyof ApiGetEndpointByPath<Api, Method, Path>["params"]
> = ApiInferEndpointOutputEntryByPath<Api, Method, Path, "params", PathParam>;

/**
 * Infer the typescript output type for an endpoint query parameter
 * output type is the data type that is returned after validating the endpoint query parameter
 * Use SchemaType cascading rules to determine the schema type to use
 * Cascading rules:
 * 1. If the query parameter has a schema type defined, use it
 * 2. Else if the endpoint has a schema type defined, use it
 * 3. Else if the api spec has a schema type defined, use it
 * 4. Else use the default schema type
 * @param Api - Api spec
 * @param Endpoint - Endpoint name
 * @param QueryParam - Query parameter name
 * @returns Typescript Output type for the endpoint query parameter
 */
export type ApiInferEndpointOutputQuery<
  Api extends ApiSpec,
  Endpoint extends keyof Api["endpoints"],
  QueryParam extends keyof ApiGetEndpoint<Api, Endpoint>["query"]
> = ApiInferEndpointOutputEntry<Api, Endpoint, "query", QueryParam>;

/**
 * Infer the typescript output type for an endpoint query parameter
 * output type is the data type that is returned after validating the endpoint query parameter
 * Use SchemaType cascading rules to determine the schema type to use
 * Cascading rules:
 * 1. If the query parameter has a schema type defined, use it
 * 2. Else if the endpoint has a schema type defined, use it
 * 3. Else if the api spec has a schema type defined, use it
 * 4. Else use the default schema type
 * @param Api - Api spec
 * @param Endpoint - Endpoint name
 * @param QueryParam - Query parameter name
 * @returns Typescript Output type for the endpoint query parameter
 */
export type ApiInferEndpointOutputQueryByPath<
  Api extends ApiSpec,
  Method extends ApiMethod,
  Path extends ApiGetPathsByMethod<Api, Method>,
  QueryParam extends keyof ApiGetEndpointByPath<Api, Method, Path>["query"]
> = ApiInferEndpointOutputEntryByPath<Api, Method, Path, "query", QueryParam>;

/**
 * Infer the typescript output type for an endpoint header parameter
 * output type is the data type that is returned after validating the endpoint header parameter
 * Use SchemaType cascading rules to determine the schema type to use
 * Cascading rules:
 * 1. If the header parameter has a schema type defined, use it
 * 2. Else if the endpoint has a schema type defined, use it
 * 3. Else if the api spec has a schema type defined, use it
 * 4. Else use the default schema type
 * @param Api - Api spec
 * @param Endpoint - Endpoint name
 * @param HeaderParam - Header parameter name
 * @returns Typescript Output type for the endpoint header parameter
 */
export type ApiInferEndpointOutputHeader<
  Api extends ApiSpec,
  Endpoint extends keyof Api["endpoints"],
  HeaderParam extends keyof ApiGetEndpoint<Api, Endpoint>["headers"]
> = ApiInferEndpointOutputEntry<Api, Endpoint, "headers", HeaderParam>;

/**
 * Infer the typescript output type for an endpoint header parameter
 * output type is the data type that is returned after validating the endpoint header parameter
 * Use SchemaType cascading rules to determine the schema type to use
 * Cascading rules:
 * 1. If the header parameter has a schema type defined, use it
 * 2. Else if the endpoint has a schema type defined, use it
 * 3. Else if the api spec has a schema type defined, use it
 * 4. Else use the default schema type
 * @param Api - Api spec
 * @param Endpoint - Endpoint name
 * @param HeaderParam - Header parameter name
 * @returns Typescript Output type for the endpoint header parameter
 */
export type ApiInferEndpointOutputHeaderByPath<
  Api extends ApiSpec,
  Method extends ApiMethod,
  Path extends ApiGetPathsByMethod<Api, Method>,
  HeaderParam extends keyof ApiGetEndpointByPath<Api, Method, Path>["headers"]
> = ApiInferEndpointOutputEntryByPath<Api, Method, Path, "headers", HeaderParam>;

/**
 * Infer the typescript output type for an endpoint cookie parameter
 * output type is the data type that is returned after validating the endpoint cookie parameter
 * Use SchemaType cascading rules to determine the schema type to use
 * Cascading rules:
 * 1. If the cookie parameter has a schema type defined, use it
 * 2. Else if the endpoint has a schema type defined, use it
 * 3. Else if the api spec has a schema type defined, use it
 * 4. Else use the default schema type
 * @param Api - Api spec
 * @param Endpoint - Endpoint name
 * @param CookieParam - Cookie parameter name
 * @returns Typescript Output type for the endpoint cookie parameter
 */
export type ApiInferEndpointOutputCookie<
  Api extends ApiSpec,
  Endpoint extends keyof Api["endpoints"],
  CookieParam extends keyof ApiGetEndpoint<Api, Endpoint>["cookies"]
> = ApiInferEndpointOutputEntry<Api, Endpoint, "cookies", CookieParam>;

/**
 * Infer the typescript output type for an endpoint cookie parameter
 * output type is the data type that is returned after validating the endpoint cookie parameter
 * Use SchemaType cascading rules to determine the schema type to use
 * Cascading rules:
 * 1. If the cookie parameter has a schema type defined, use it
 * 2. Else if the endpoint has a schema type defined, use it
 * 3. Else if the api spec has a schema type defined, use it
 * 4. Else use the default schema type
 * @param Api - Api spec
 * @param Endpoint - Endpoint name
 * @param CookieParam - Cookie parameter name
 * @returns Typescript Output type for the endpoint cookie parameter
 */
export type ApiInferEndpointOutputCookieByPath<
  Api extends ApiSpec,
  Method extends ApiMethod,
  Path extends ApiGetPathsByMethod<Api, Method>,
  CookieParam extends keyof ApiGetEndpointByPath<Api, Method, Path>["cookies"]
> = ApiInferEndpointOutputEntryByPath<Api, Method, Path, "cookies", CookieParam>;

/**
 * Infer the typescript output type for an endpoint response body
 * output type is the data type that is returned after validating the endpoint response body
 * Use SchemaType cascading rules to determine the schema type to use
 * Cascading rules:
 * 1. If the response body has a schema type defined, use it
 * 2. Else if the endpoint has a schema type defined, use it
 * 3. Else if the api spec has a schema type defined, use it
 * 4. Else use the default schema type
 * @param Api - Api spec
 * @param Endpoint - Endpoint name
 * @param StatusCode - Response status code
 * @returns Typescript Output type for the endpoint response body
 */
export type ApiInferEndpointOutputResponse<
  Api extends ApiSpec,
  Endpoint extends keyof Api["endpoints"],
  StatusCode extends keyof ApiGetEndpoint<Api, Endpoint>["responses"]
> = ApiInferEndpointOutputEntry<Api, Endpoint, "responses", StatusCode>;

/**
 * Infer the typescript output type for an endpoint response body
 * output type is the data type that is returned after validating the endpoint response body
 * Use SchemaType cascading rules to determine the schema type to use
 * Cascading rules:
 * 1. If the response body has a schema type defined, use it
 * 2. Else if the endpoint has a schema type defined, use it
 * 3. Else if the api spec has a schema type defined, use it
 * 4. Else use the default schema type
 * @param Api - Api spec
 * @param Endpoint - Endpoint name
 * @param StatusCode - Response status code
 * @returns Typescript Output type for the endpoint response body
 */
export type ApiInferEndpointOutputResponseByPath<
  Api extends ApiSpec,
  Method extends ApiMethod,
  Path extends ApiGetPathsByMethod<Api, Method>,
  StatusCode extends keyof ApiGetEndpointByPath<Api, Method, Path>["responses"]
> = ApiInferEndpointOutputEntryByPath<Api, Method, Path, "responses", StatusCode>;
