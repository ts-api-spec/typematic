import {
  apiGetEndpoint,
  apiGetEndpointByPath,
  apiGetEndpointBody,
  apiGetEndpointBodyByPath,
  apiGetEndpointBodySchema,
  apiGetEndpointBodySchemaByPath,
  apiGetEndpointEntrySchema,
  apiGetEndpointEntry,
  apiGetEndpointEntryByPath,
  apiGetEndpointEntrySchemaByPath,
} from "./parser";
import type {
  ApiGetPathsByMethod,
  ApiGetEndpoint,
  ApiGetEndpointBodySchema,
  ApiGetEndpointBodySchemaByPath,
  ApiGetEndpointByPath,
  ApiGetEndpointEntrySchema,
  ApiGetEndpointEntrySchemaByPath,
} from "./parser.types";
import { ApiTypeScriptSchema } from "./schema-type-ts";
import type { SchemaType, SchemaValidationResult } from "./schema-type.types";
import type { ApiEntry, ApiMethod, ApiSpec } from "./types";
import type {
  ApiGetSchemaType,
  ApiGetEndpointSchemaType,
  ApiGetEndpointSchemaTypeByPath,
  ApiGetEndpointBodySchemaType,
  ApiGetEndpointBodySchemaTypeByPath,
  ApiGetEndpointEntrySchemaType,
  ApiGetEndpointEntrySchemaTypeByPath,
} from "./validator.types";

let defaultSchemaType: SchemaType = ApiTypeScriptSchema;

/**
 * This is used to set the default schema type for all apis
 * The default schema type is used when no schema type is specified in the api metadata
 * tp be used by library authors to set their default schema type
 * @param schemaType
 */
export function setDefaultSchemaType(schemaType: SchemaType) {
  defaultSchemaType = schemaType;
}

/**
 * Get the current default schema type
 * @returns the default schema type
 */
export function getDefaultSchemaType() {
  return defaultSchemaType;
}

/**
 * get the schema type for an api
 * If the api does not specify a schema type, the default schema type is returned
 * @param api - the api to get the schema type for
 * @returns the schema type for the api
 */
export function apiGetSchemaType<Api extends ApiSpec>(api: Api): ApiGetSchemaType<Api> {
  return (api.metadata?.schemaType ?? defaultSchemaType) as any;
}

/**
 * get the schema type for an api endpoint
 *
 * Use SchemaType cascading rules to determine the schema type to use
 * Cascading rules:
 * 1. if the endpoint has a schema type defined, use it
 * 2. Else if the api spec has a schema type defined, use it
 * 3. Else use the default schema type
 *
 * @param api - the api to get the schema type for
 * @param endpoint - the endpoint to get the schema type for
 * @returns the schema type for the api endpoint
 */
export function apiGetEndpointSchemaType<Api extends ApiSpec, Endpoint extends keyof Api["endpoints"]>(
  api: Api,
  endpoint: Endpoint
): ApiGetEndpointSchemaType<Api, Endpoint> {
  return (apiGetEndpoint(api, endpoint).metadata?.schemaType ?? apiGetSchemaType(api)) as any;
}

/**
 * get the schema type for an api endpoint by path
 *
 * Use SchemaType cascading rules to determine the schema type to use
 * Cascading rules:
 * 1. if the endpoint has a schema type defined, use it
 * 2. Else if the api spec has a schema type defined, use it
 * 3. Else use the default schema type
 *
 * @param api - the api to get the schema type for
 * @param method - the method to get the schema type for
 * @param path - the path to get the schema type for
 * @returns the schema type for the api endpoint
 */
export function apiGetEndpointSchemaTypeByPath<
  Api extends ApiSpec,
  Method extends ApiMethod,
  Path extends ApiGetPathsByMethod<Api, Method>
>(api: Api, method: Method, path: Path): ApiGetEndpointSchemaTypeByPath<Api, Method, Path> {
  return (apiGetEndpointByPath(api, method, path).metadata?.schemaType ?? apiGetSchemaType(api)) as any;
}

/**
 * get the schema type for an api endpoint body
 *
 * Use SchemaType cascading rules to determine the schema type to use
 * Cascading rules:
 * 1. if the endpoint body has a schema type defined, use it
 * 2. Else if the endpoint has a schema type defined, use it
 * 3. Else if the api spec has a schema type defined, use it
 * 4. Else use the default schema type
 *
 * @param api - the api to get the schema type for
 * @param endpoint - the endpoint to get the schema type for
 * @returns the schema type for the api endpoint body
 */
export function apiGetEndpointBodySchemaType<Api extends ApiSpec, Endpoint extends keyof Api["endpoints"]>(
  api: Api,
  endpoint: Endpoint
): ApiGetEndpointBodySchemaType<Api, Endpoint> {
  const body = apiGetEndpointBody(api, endpoint) as any;
  return body.metadata?.schemaType ?? apiGetEndpointSchemaType(api, endpoint);
}

/**
 * get the schema type for an api endpoint body by path
 *
 * Use SchemaType cascading rules to determine the schema type to use
 * Cascading rules:
 * 1. if the endpoint body has a schema type defined, use it
 * 2. Else if the endpoint has a schema type defined, use it
 * 3. Else if the api spec has a schema type defined, use it
 * 4. Else use the default schema type
 *
 * @param api - the api to get the schema type for
 * @param method - the method to get the schema type for
 * @param path - the path to get the schema type for
 * @returns the schema type for the api endpoint body
 */
export function apiGetEndpointBodySchemaTypeByPath<
  Api extends ApiSpec,
  Method extends ApiMethod,
  Path extends ApiGetPathsByMethod<Api, Method>
>(api: Api, method: Method, path: Path): ApiGetEndpointBodySchemaTypeByPath<Api, Method, Path> {
  const body = apiGetEndpointBodyByPath(api, method, path) as any;
  return body?.metadata?.schemaType ?? apiGetEndpointSchemaTypeByPath(api, method, path);
}

/**
 * get the schema type for an api endpoint entry
 *
 * Use SchemaType cascading rules to determine the schema type to use
 * Cascading rules:
 * 1. if the endpoint entry has a schema type defined, use it
 * 2. Else if the endpoint has a schema type defined, use it
 * 3. Else if the api spec has a schema type defined, use it
 * 4. Else use the default schema type
 *
 * @param api - the api to get the schema type for
 * @param endpoint - the endpoint to get the schema type for
 * @param entry - the entry to get the schema type for
 * @param param - the param to get the schema type for
 * @returns the schema type for the api endpoint entry
 */
export function apiGetEndpointEntrySchemaType<
  Api extends ApiSpec,
  Endpoint extends keyof Api["endpoints"],
  Entry extends ApiEntry,
  EntryParam extends keyof ApiGetEndpoint<Api, Endpoint>[Entry]
>(
  api: Api,
  endpoint: Endpoint,
  entry: Entry,
  param: EntryParam
): ApiGetEndpointEntrySchemaType<Api, Endpoint, Entry, EntryParam> {
  const $entry = apiGetEndpointEntry(api, endpoint, entry, param) as any;
  return $entry?.metadata?.schemaType ?? apiGetEndpointSchemaType(api, endpoint);
}

/**
 * get the schema type for an api endpoint entry by path
 *
 * Use SchemaType cascading rules to determine the schema type to use
 * Cascading rules:
 * 1. if the endpoint entry has a schema type defined, use it
 * 2. Else if the endpoint has a schema type defined, use it
 * 3. Else if the api spec has a schema type defined, use it
 * 4. Else use the default schema type
 *
 * @param api - the api to get the schema type for
 * @param method - the method to get the schema type for
 * @param path - the path to get the schema type for
 * @param entry - the entry to get the schema type for
 * @param param - the param to get the schema type for
 * @returns the schema type for the api endpoint entry
 */
export function apiGetEndpointEntrySchemaTypeByPath<
  Api extends ApiSpec,
  Method extends ApiMethod,
  Path extends ApiGetPathsByMethod<Api, Method>,
  Entry extends ApiEntry,
  EntryParam extends keyof ApiGetEndpointByPath<Api, Method, Path>[Entry]
>(
  api: Api,
  method: Method,
  path: Path,
  entry: Entry,
  param: EntryParam
): ApiGetEndpointEntrySchemaTypeByPath<Api, Method, Path, Entry, EntryParam> {
  const $entry = apiGetEndpointEntryByPath(api, method, path, entry, param) as any;
  return $entry?.metadata?.schemaType ?? apiGetEndpointSchemaTypeByPath(api, method, path);
}

/**
 * validate an api endpoint body
 * @param api - the api to validate against
 * @param endpoint - the endpoint to validate against
 * @param body - the body to validate
 * @returns the validation result
 */
export function apiValidateEndpointBody<
  Api extends ApiSpec,
  Endpoint extends keyof Api["endpoints"],
  $Schema = ApiGetEndpointBodySchema<Api, Endpoint>,
  $SchemaType extends SchemaType = ApiGetEndpointBodySchemaType<Api, Endpoint>
>(api: Api, endpoint: Endpoint, body: unknown): SchemaValidationResult<$Schema, NonNullable<$SchemaType["_provider"]>> {
  const schemaType = apiGetEndpointBodySchemaType(api, endpoint);
  const schema = apiGetEndpointBodySchema(api, endpoint);
  // @ts-ignore
  return schemaType.validate(schema, body);
}

/**
 * validate an api endpoint body asynchronously
 * @param api - the api to validate against
 * @param endpoint - the endpoint to validate against
 * @param body - the body to validate
 * @returns the validation result
 */
export function apiValidateAsyncEndpointBody<
  Api extends ApiSpec,
  Endpoint extends keyof Api["endpoints"],
  $Schema = ApiGetEndpointBodySchema<Api, Endpoint>,
  $SchemaType extends SchemaType = ApiGetEndpointBodySchemaType<Api, Endpoint>
>(
  api: Api,
  endpoint: Endpoint,
  body: unknown
): Promise<SchemaValidationResult<$Schema, NonNullable<$SchemaType["_provider"]>>> {
  const schemaType = apiGetEndpointBodySchemaType(api, endpoint);
  const schema = apiGetEndpointBodySchema(api, endpoint);
  // @ts-ignore
  return schemaType.validateAsync(schema, body);
}

/**
 * validate an api endpoint body by path
 * @param api - the api to validate against
 * @param method - the method to validate against
 * @param path - the path to validate against
 * @param body - the body to validate
 * @returns the validation result
 */
export function apiValidateEndpointBodyByPath<
  Api extends ApiSpec,
  Method extends ApiMethod,
  Path extends ApiGetPathsByMethod<Api, Method>,
  $Schema = ApiGetEndpointBodySchemaByPath<Api, Method, Path>,
  $SchemaType extends SchemaType = ApiGetEndpointBodySchemaTypeByPath<Api, Method, Path>
>(
  api: Api,
  method: Method,
  path: Path,
  body: unknown
): SchemaValidationResult<$Schema, NonNullable<$SchemaType["_provider"]>> {
  const schemaType = apiGetEndpointBodySchemaTypeByPath(api, method, path);
  const schema = apiGetEndpointBodySchemaByPath(api, method, path);
  // @ts-ignore
  return schemaType.validate(schema, body);
}

/**
 * validate an api endpoint body by path asynchronously
 * @param api - the api to validate against
 * @param method - the method to validate against
 * @param path - the path to validate against
 * @param body - the body to validate
 * @returns the validation result
 */
export function apiValidateAsyncEndpointBodyByPath<
  Api extends ApiSpec,
  Method extends ApiMethod,
  Path extends ApiGetPathsByMethod<Api, Method>,
  $Schema = ApiGetEndpointBodySchemaByPath<Api, Method, Path>,
  $SchemaType extends SchemaType = ApiGetEndpointBodySchemaTypeByPath<Api, Method, Path>
>(
  api: Api,
  method: Method,
  path: Path,
  body: unknown
): Promise<SchemaValidationResult<$Schema, NonNullable<$SchemaType["_provider"]>>> {
  const schemaType = apiGetEndpointBodySchemaTypeByPath(api, method, path);
  const schema = apiGetEndpointBodySchemaByPath(api, method, path);
  // @ts-ignore
  return schemaType.validateAsync(schema, body);
}

/**
 * validate an api endpoint entry
 * @param api - the api to validate against
 * @param endpoint - the endpoint to validate against
 * @param entry - the entry to validate against
 * @param param - the param to validate against
 * @param value - the value to validate
 * @returns the validation result
 */
export function apiValidateEndpointEntry<
  Api extends ApiSpec,
  Endpoint extends keyof Api["endpoints"],
  Entry extends ApiEntry,
  EntryParam extends keyof ApiGetEndpoint<Api, Endpoint>[Entry],
  $Schema = ApiGetEndpointEntrySchema<Api, Endpoint, Entry, EntryParam>,
  $SchemaType extends SchemaType = ApiGetEndpointEntrySchemaType<Api, Endpoint, Entry, EntryParam>
>(
  api: Api,
  endpoint: Endpoint,
  entry: Entry,
  param: EntryParam,
  value: unknown
): SchemaValidationResult<$Schema, NonNullable<$SchemaType["_provider"]>> {
  const schemaType = apiGetEndpointEntrySchemaType(api, endpoint, entry, param);
  const schema = apiGetEndpointEntrySchema(api, endpoint, entry, param);
  // @ts-ignore
  return schemaType.validate(schema, value);
}

/**
 * validate an api endpoint entry asynchronously
 * @param api - the api to validate against
 * @param endpoint - the endpoint to validate against
 * @param entry - the entry to validate against
 * @param param - the param to validate against
 * @param value - the value to validate
 * @returns the validation result
 */
export function apiValidateAsyncEndpointEntry<
  Api extends ApiSpec,
  Endpoint extends keyof Api["endpoints"],
  Entry extends ApiEntry,
  EntryParam extends keyof ApiGetEndpoint<Api, Endpoint>[Entry],
  $Schema = ApiGetEndpointEntrySchema<Api, Endpoint, Entry, EntryParam>,
  $SchemaType extends SchemaType = ApiGetEndpointEntrySchemaType<Api, Endpoint, Entry, EntryParam>
>(
  api: Api,
  endpoint: Endpoint,
  entry: Entry,
  param: EntryParam,
  value: unknown
): Promise<SchemaValidationResult<$Schema, NonNullable<$SchemaType["_provider"]>>> {
  const schemaType = apiGetEndpointEntrySchemaType(api, endpoint, entry, param);
  const schema = apiGetEndpointEntrySchema(api, endpoint, entry, param);
  // @ts-ignore
  return schemaType.validateAsync(schema, value);
}

/**
 * validate an api endpoint entry by path
 * @param api - the api to validate against
 * @param method - the method to validate against
 * @param path - the path to validate against
 * @param entry - the entry to validate against
 * @param param - the param to validate against
 * @param value - the value to validate
 * @returns the validation result
 */
export function apiValidateEndpointEntryByPath<
  Api extends ApiSpec,
  Method extends ApiMethod,
  Path extends ApiGetPathsByMethod<Api, Method>,
  Entry extends ApiEntry,
  EntryParam extends keyof ApiGetEndpointByPath<Api, Method, Path>[Entry],
  $Schema = ApiGetEndpointEntrySchemaByPath<Api, Method, Path, Entry, EntryParam>,
  $SchemaType extends SchemaType = ApiGetEndpointEntrySchemaTypeByPath<Api, Method, Path, Entry, EntryParam>
>(
  api: Api,
  method: Method,
  path: Path,
  entry: Entry,
  param: EntryParam,
  value: unknown
): SchemaValidationResult<$Schema, NonNullable<$SchemaType["_provider"]>> {
  const schemaType = apiGetEndpointEntrySchemaTypeByPath(api, method, path, entry, param);
  const schema = apiGetEndpointEntrySchemaByPath(api, method, path, entry, param);
  // @ts-ignore
  return schemaType.validate(schema, value);
}

/**
 * validate an api endpoint entry by path asynchronously
 * @param api - the api to validate against
 * @param method - the method to validate against
 * @param path - the path to validate against
 * @param entry - the entry to validate against
 * @param param - the param to validate against
 * @param value - the value to validate
 * @returns the validation result
 */
export function apiValidateAsyncEndpointEntryByPath<
  Api extends ApiSpec,
  Method extends ApiMethod,
  Path extends ApiGetPathsByMethod<Api, Method>,
  Entry extends ApiEntry,
  EntryParam extends keyof ApiGetEndpointByPath<Api, Method, Path>[Entry],
  $Schema = ApiGetEndpointEntrySchemaByPath<Api, Method, Path, Entry, EntryParam>,
  $SchemaType extends SchemaType = ApiGetEndpointEntrySchemaTypeByPath<Api, Method, Path, Entry, EntryParam>
>(
  api: Api,
  method: Method,
  path: Path,
  entry: Entry,
  param: EntryParam,
  value: unknown
): Promise<SchemaValidationResult<$Schema, NonNullable<$SchemaType["_provider"]>>> {
  const schemaType = apiGetEndpointEntrySchemaTypeByPath(api, method, path, entry, param);
  const schema = apiGetEndpointEntrySchemaByPath(api, method, path, entry, param);
  // @ts-ignore
  return schemaType.validateAsync(schema, value);
}

/**
 * validate an api endpoint path param
 * @param api - the api to validate against
 * @param endpoint - the endpoint to validate against
 * @param pathParam - the path param to validate against
 * @param value - the value to validate
 * @returns the validation result
 */
export function apiValidateEndpointParam<
  Api extends ApiSpec,
  Endpoint extends keyof Api["endpoints"],
  PathParam extends keyof ApiGetEndpoint<Api, Endpoint>["params"],
  $Schema = ApiGetEndpointEntrySchema<Api, Endpoint, "params", PathParam>,
  $SchemaType extends SchemaType = ApiGetEndpointEntrySchemaType<Api, Endpoint, "params", PathParam>
>(
  api: Api,
  endpoint: Endpoint,
  pathParam: PathParam,
  value: unknown
): SchemaValidationResult<$Schema, NonNullable<$SchemaType["_provider"]>> {
  return apiValidateEndpointEntry(api, endpoint, "params", pathParam, value);
}

/**
 * validate an api endpoint path param asynchronously
 * @param api - the api to validate against
 * @param endpoint - the endpoint to validate against
 * @param pathParam - the path param to validate against
 * @param value - the value to validate
 * @returns the validation result
 */
export function apiValidateAsyncEndpointParam<
  Api extends ApiSpec,
  Endpoint extends keyof Api["endpoints"],
  PathParam extends keyof ApiGetEndpoint<Api, Endpoint>["params"],
  $Schema = ApiGetEndpointEntrySchema<Api, Endpoint, "params", PathParam>,
  $SchemaType extends SchemaType = ApiGetEndpointEntrySchemaType<Api, Endpoint, "params", PathParam>
>(
  api: Api,
  endpoint: Endpoint,
  pathParam: PathParam,
  value: unknown
): Promise<SchemaValidationResult<$Schema, NonNullable<$SchemaType["_provider"]>>> {
  return apiValidateAsyncEndpointEntry(api, endpoint, "params", pathParam, value);
}

/**
 * validate an api endpoint path param by path
 * @param api - the api to validate against
 * @param method - the method to validate against
 * @param path - the path to validate against
 * @param pathParam - the path param to validate against
 * @param value - the value to validate
 * @returns the validation result
 */
export function apiValidateEndpointParamByPath<
  Api extends ApiSpec,
  Method extends ApiMethod,
  Path extends ApiGetPathsByMethod<Api, Method>,
  PathParam extends keyof ApiGetEndpointByPath<Api, Method, Path>["params"],
  $Schema = ApiGetEndpointEntrySchemaByPath<Api, Method, Path, "params", PathParam>,
  $SchemaType extends SchemaType = ApiGetEndpointEntrySchemaTypeByPath<Api, Method, Path, "params", PathParam>
>(
  api: Api,
  method: Method,
  path: Path,
  pathParam: PathParam,
  value: unknown
): SchemaValidationResult<$Schema, NonNullable<$SchemaType["_provider"]>> {
  return apiValidateEndpointEntryByPath(api, method, path, "params", pathParam, value);
}

/**
 * validate an api endpoint path param by path asynchronously
 * @param api - the api to validate against
 * @param method - the method to validate against
 * @param path - the path to validate against
 * @param pathParam - the path param to validate against
 * @param value - the value to validate
 * @returns the validation result
 */
export function apiValidateAsyncEndpointParamByPath<
  Api extends ApiSpec,
  Method extends ApiMethod,
  Path extends ApiGetPathsByMethod<Api, Method>,
  PathParam extends keyof ApiGetEndpointByPath<Api, Method, Path>["params"],
  $Schema = ApiGetEndpointEntrySchemaByPath<Api, Method, Path, "params", PathParam>,
  $SchemaType extends SchemaType = ApiGetEndpointEntrySchemaTypeByPath<Api, Method, Path, "params", PathParam>
>(
  api: Api,
  method: Method,
  path: Path,
  pathParam: PathParam,
  value: unknown
): Promise<SchemaValidationResult<$Schema, NonNullable<$SchemaType["_provider"]>>> {
  return apiValidateAsyncEndpointEntryByPath(api, method, path, "params", pathParam, value);
}

/**
 * validate an api endpoint query param
 * @param api - the api to validate against
 * @param endpoint - the endpoint to validate against
 * @param queryParam - the query param to validate against
 * @param value - the value to validate
 * @returns the validation result
 */
export function apiValidateEndpointQuery<
  Api extends ApiSpec,
  Endpoint extends keyof Api["endpoints"],
  QueryParam extends keyof ApiGetEndpoint<Api, Endpoint>["query"],
  $Schema = ApiGetEndpointEntrySchema<Api, Endpoint, "query", QueryParam>,
  $SchemaType extends SchemaType = ApiGetEndpointEntrySchemaType<Api, Endpoint, "query", QueryParam>
>(
  api: Api,
  endpoint: Endpoint,
  queryParam: QueryParam,
  value: unknown
): SchemaValidationResult<$Schema, NonNullable<$SchemaType["_provider"]>> {
  return apiValidateEndpointEntry(api, endpoint, "query", queryParam, value);
}

/**
 * validate an api endpoint query param asynchronously
 * @param api - the api to validate against
 * @param endpoint - the endpoint to validate against
 * @param queryParam - the query param to validate against
 * @param value - the value to validate
 * @returns the validation result
 */
export function apiValidateAsyncEndpointQuery<
  Api extends ApiSpec,
  Endpoint extends keyof Api["endpoints"],
  QueryParam extends keyof ApiGetEndpoint<Api, Endpoint>["query"],
  $Schema = ApiGetEndpointEntrySchema<Api, Endpoint, "query", QueryParam>,
  $SchemaType extends SchemaType = ApiGetEndpointEntrySchemaType<Api, Endpoint, "query", QueryParam>
>(
  api: Api,
  endpoint: Endpoint,
  queryParam: QueryParam,
  value: unknown
): Promise<SchemaValidationResult<$Schema, NonNullable<$SchemaType["_provider"]>>> {
  return apiValidateAsyncEndpointEntry(api, endpoint, "query", queryParam, value);
}

/**
 * validate an api endpoint query param by path
 * @param api - the api to validate against
 * @param method - the method to validate against
 * @param path - the path to validate against
 * @param queryParam - the query param to validate against
 * @param value - the value to validate
 * @returns the validation result
 */
export function apiValidateEndpointQueryByPath<
  Api extends ApiSpec,
  Method extends ApiMethod,
  Path extends ApiGetPathsByMethod<Api, Method>,
  QueryParam extends keyof ApiGetEndpointByPath<Api, Method, Path>["query"],
  $Schema = ApiGetEndpointEntrySchemaByPath<Api, Method, Path, "query", QueryParam>,
  $SchemaType extends SchemaType = ApiGetEndpointEntrySchemaTypeByPath<Api, Method, Path, "query", QueryParam>
>(
  api: Api,
  method: Method,
  path: Path,
  queryParam: QueryParam,
  value: unknown
): SchemaValidationResult<$Schema, NonNullable<$SchemaType["_provider"]>> {
  return apiValidateEndpointEntryByPath(api, method, path, "query", queryParam, value);
}

/**
 * validate an api endpoint query param by path asynchronously
 * @param api - the api to validate against
 * @param method - the method to validate against
 * @param path - the path to validate against
 * @param queryParam - the query param to validate against
 * @param value - the value to validate
 * @returns the validation result
 */
export function apiValidateAsyncEndpointQueryByPath<
  Api extends ApiSpec,
  Method extends ApiMethod,
  Path extends ApiGetPathsByMethod<Api, Method>,
  QueryParam extends keyof ApiGetEndpointByPath<Api, Method, Path>["query"],
  $Schema = ApiGetEndpointEntrySchemaByPath<Api, Method, Path, "query", QueryParam>,
  $SchemaType extends SchemaType = ApiGetEndpointEntrySchemaTypeByPath<Api, Method, Path, "query", QueryParam>
>(
  api: Api,
  method: Method,
  path: Path,
  queryParam: QueryParam,
  value: unknown
): Promise<SchemaValidationResult<$Schema, NonNullable<$SchemaType["_provider"]>>> {
  return apiValidateAsyncEndpointEntryByPath(api, method, path, "query", queryParam, value);
}

/**
 * validate an api endpoint header param
 * @param api - the api to validate against
 * @param endpoint - the endpoint to validate against
 * @param headerParam - the header param to validate against
 * @param value - the value to validate
 * @returns the validation result
 */
export function apiValidateEndpointHeader<
  Api extends ApiSpec,
  Endpoint extends keyof Api["endpoints"],
  HeaderParam extends keyof ApiGetEndpoint<Api, Endpoint>["headers"],
  $Schema = ApiGetEndpointEntrySchema<Api, Endpoint, "headers", HeaderParam>,
  $SchemaType extends SchemaType = ApiGetEndpointEntrySchemaType<Api, Endpoint, "headers", HeaderParam>
>(
  api: Api,
  endpoint: Endpoint,
  headerParam: HeaderParam,
  value: unknown
): SchemaValidationResult<$Schema, NonNullable<$SchemaType["_provider"]>> {
  return apiValidateEndpointEntry(api, endpoint, "headers", headerParam, value);
}

/**
 * validate an api endpoint header param asynchronously
 * @param api - the api to validate against
 * @param endpoint - the endpoint to validate against
 * @param headerParam - the header param to validate against
 * @param value - the value to validate
 * @returns the validation result
 */
export function apiValidateAsyncEndpointHeader<
  Api extends ApiSpec,
  Endpoint extends keyof Api["endpoints"],
  HeaderParam extends keyof ApiGetEndpoint<Api, Endpoint>["headers"],
  $Schema = ApiGetEndpointEntrySchema<Api, Endpoint, "headers", HeaderParam>,
  $SchemaType extends SchemaType = ApiGetEndpointEntrySchemaType<Api, Endpoint, "headers", HeaderParam>
>(
  api: Api,
  endpoint: Endpoint,
  headerParam: HeaderParam,
  value: unknown
): Promise<SchemaValidationResult<$Schema, NonNullable<$SchemaType["_provider"]>>> {
  return apiValidateAsyncEndpointEntry(api, endpoint, "headers", headerParam, value);
}

/**
 * validate an api endpoint header param by path
 * @param api - the api to validate against
 * @param method - the method to validate against
 * @param path - the path to validate against
 * @param headerParam - the header param to validate against
 * @param value - the value to validate
 * @returns the validation result
 */
export function apiValidateEndpointHeaderByPath<
  Api extends ApiSpec,
  Method extends ApiMethod,
  Path extends ApiGetPathsByMethod<Api, Method>,
  HeaderParam extends keyof ApiGetEndpointByPath<Api, Method, Path>["headers"],
  $Schema = ApiGetEndpointEntrySchemaByPath<Api, Method, Path, "headers", HeaderParam>,
  $SchemaType extends SchemaType = ApiGetEndpointEntrySchemaTypeByPath<Api, Method, Path, "headers", HeaderParam>
>(
  api: Api,
  method: Method,
  path: Path,
  headerParam: HeaderParam,
  value: unknown
): SchemaValidationResult<$Schema, NonNullable<$SchemaType["_provider"]>> {
  return apiValidateEndpointEntryByPath(api, method, path, "headers", headerParam, value);
}

/**
 * validate an api endpoint header param by path asynchronously
 * @param api - the api to validate against
 * @param method - the method to validate against
 * @param path - the path to validate against
 * @param headerParam - the header param to validate against
 * @param value - the value to validate
 * @returns the validation result
 */
export function apiValidateAsyncEndpointHeaderByPath<
  Api extends ApiSpec,
  Method extends ApiMethod,
  Path extends ApiGetPathsByMethod<Api, Method>,
  HeaderParam extends keyof ApiGetEndpointByPath<Api, Method, Path>["headers"],
  $Schema = ApiGetEndpointEntrySchemaByPath<Api, Method, Path, "headers", HeaderParam>,
  $SchemaType extends SchemaType = ApiGetEndpointEntrySchemaTypeByPath<Api, Method, Path, "headers", HeaderParam>
>(
  api: Api,
  method: Method,
  path: Path,
  headerParam: HeaderParam,
  value: unknown
): Promise<SchemaValidationResult<$Schema, NonNullable<$SchemaType["_provider"]>>> {
  return apiValidateAsyncEndpointEntryByPath(api, method, path, "headers", headerParam, value);
}

/**
 * validate an api endpoint cookie param
 * @param api - the api to validate against
 * @param endpoint - the endpoint to validate against
 * @param cookieParam - the cookie param to validate against
 * @param value - the value to validate
 * @returns the validation result
 */
export function apiValidateEndpointCookie<
  Api extends ApiSpec,
  Endpoint extends keyof Api["endpoints"],
  CookieParam extends keyof ApiGetEndpoint<Api, Endpoint>["cookies"],
  $Schema = ApiGetEndpointEntrySchema<Api, Endpoint, "cookies", CookieParam>,
  $SchemaType extends SchemaType = ApiGetEndpointEntrySchemaType<Api, Endpoint, "cookies", CookieParam>
>(
  api: Api,
  endpoint: Endpoint,
  cookieParam: CookieParam,
  value: unknown
): SchemaValidationResult<$Schema, NonNullable<$SchemaType["_provider"]>> {
  return apiValidateEndpointEntry(api, endpoint, "cookies", cookieParam, value);
}

/**
 * validate an api endpoint cookie param asynchronously
 * @param api - the api to validate against
 * @param endpoint - the endpoint to validate against
 * @param cookieParam - the cookie param to validate against
 * @param value - the value to validate
 * @returns the validation result
 */
export function apiValidateAsyncEndpointCookie<
  Api extends ApiSpec,
  Endpoint extends keyof Api["endpoints"],
  CookieParam extends keyof ApiGetEndpoint<Api, Endpoint>["cookies"],
  $Schema = ApiGetEndpointEntrySchema<Api, Endpoint, "cookies", CookieParam>,
  $SchemaType extends SchemaType = ApiGetEndpointEntrySchemaType<Api, Endpoint, "cookies", CookieParam>
>(
  api: Api,
  endpoint: Endpoint,
  cookieParam: CookieParam,
  value: unknown
): Promise<SchemaValidationResult<$Schema, NonNullable<$SchemaType["_provider"]>>> {
  return apiValidateAsyncEndpointEntry(api, endpoint, "cookies", cookieParam, value);
}

/**
 * validate an api endpoint cookie param by path
 * @param api - the api to validate against
 * @param method - the method to validate against
 * @param path - the path to validate against
 * @param cookieParam - the cookie param to validate against
 * @param value - the value to validate
 * @returns the validation result
 */
export function apiValidateEndpointCookieByPath<
  Api extends ApiSpec,
  Method extends ApiMethod,
  Path extends ApiGetPathsByMethod<Api, Method>,
  CookieParam extends keyof ApiGetEndpointByPath<Api, Method, Path>["cookies"],
  $Schema = ApiGetEndpointEntrySchemaByPath<Api, Method, Path, "cookies", CookieParam>,
  $SchemaType extends SchemaType = ApiGetEndpointEntrySchemaTypeByPath<Api, Method, Path, "cookies", CookieParam>
>(
  api: Api,
  method: Method,
  path: Path,
  cookieParam: CookieParam,
  value: unknown
): SchemaValidationResult<$Schema, NonNullable<$SchemaType["_provider"]>> {
  return apiValidateEndpointEntryByPath(api, method, path, "cookies", cookieParam, value);
}

/**
 * validate an api endpoint cookie param by path asynchronously
 * @param api - the api to validate against
 * @param method - the method to validate against
 * @param path - the path to validate against
 * @param cookieParam - the cookie param to validate against
 * @param value - the value to validate
 * @returns the validation result
 */
export function apiValidateAsyncEndpointCookieByPath<
  Api extends ApiSpec,
  Method extends ApiMethod,
  Path extends ApiGetPathsByMethod<Api, Method>,
  CookieParam extends keyof ApiGetEndpointByPath<Api, Method, Path>["cookies"],
  $Schema = ApiGetEndpointEntrySchemaByPath<Api, Method, Path, "cookies", CookieParam>,
  $SchemaType extends SchemaType = ApiGetEndpointEntrySchemaTypeByPath<Api, Method, Path, "cookies", CookieParam>
>(
  api: Api,
  method: Method,
  path: Path,
  cookieParam: CookieParam,
  value: unknown
): Promise<SchemaValidationResult<$Schema, NonNullable<$SchemaType["_provider"]>>> {
  return apiValidateAsyncEndpointEntryByPath(api, method, path, "cookies", cookieParam, value);
}

/**
 * validate an api endpoint response
 * @param api - the api to validate against
 * @param endpoint - the endpoint to validate against
 * @param statusCode - the status code to validate against
 * @param value - the value to validate
 * @returns the validation result
 */
export function apiValidateEndpointResponse<
  Api extends ApiSpec,
  Endpoint extends keyof Api["endpoints"],
  StatusCode extends keyof ApiGetEndpoint<Api, Endpoint>["responses"],
  $Schema = ApiGetEndpointEntrySchema<Api, Endpoint, "responses", StatusCode>,
  $SchemaType extends SchemaType = ApiGetEndpointEntrySchemaType<Api, Endpoint, "responses", StatusCode>
>(
  api: Api,
  endpoint: Endpoint,
  statusCode: StatusCode,
  value: unknown
): SchemaValidationResult<$Schema, NonNullable<$SchemaType["_provider"]>> {
  return apiValidateEndpointEntry(api, endpoint, "responses", statusCode, value);
}

/**
 * validate an api endpoint response asynchronously
 * @param api - the api to validate against
 * @param endpoint - the endpoint to validate against
 * @param statusCode - the status code to validate against
 * @param value - the value to validate
 * @returns the validation result
 */
export function apiValidateAsyncEndpointResponse<
  Api extends ApiSpec,
  Endpoint extends keyof Api["endpoints"],
  StatusCode extends keyof ApiGetEndpoint<Api, Endpoint>["responses"],
  $Schema = ApiGetEndpointEntrySchema<Api, Endpoint, "responses", StatusCode>,
  $SchemaType extends SchemaType = ApiGetEndpointEntrySchemaType<Api, Endpoint, "responses", StatusCode>
>(
  api: Api,
  endpoint: Endpoint,
  statusCode: StatusCode,
  value: unknown
): Promise<SchemaValidationResult<$Schema, NonNullable<$SchemaType["_provider"]>>> {
  return apiValidateAsyncEndpointEntry(api, endpoint, "responses", statusCode, value);
}

/**
 * validate an api endpoint response by path
 * @param api - the api to validate against
 * @param method - the method to validate against
 * @param path - the path to validate against
 * @param statusCode - the status code to validate against
 * @param value - the value to validate
 * @returns the validation result
 */
export function apiValidateEndpointResponseByPath<
  Api extends ApiSpec,
  Method extends ApiMethod,
  Path extends ApiGetPathsByMethod<Api, Method>,
  StatusCode extends keyof ApiGetEndpointByPath<Api, Method, Path>["responses"],
  $Schema = ApiGetEndpointEntrySchemaByPath<Api, Method, Path, "responses", StatusCode>,
  $SchemaType extends SchemaType = ApiGetEndpointEntrySchemaTypeByPath<Api, Method, Path, "responses", StatusCode>
>(
  api: Api,
  method: Method,
  path: Path,
  statusCode: StatusCode,
  value: unknown
): SchemaValidationResult<$Schema, NonNullable<$SchemaType["_provider"]>> {
  return apiValidateEndpointEntryByPath(api, method, path, "responses", statusCode, value);
}

/**
 * validate an api endpoint response by path asynchronously
 * @param api - the api to validate against
 * @param method - the method to validate against
 * @param path - the path to validate against
 * @param statusCode - the status code to validate against
 * @param value - the value to validate
 * @returns the validation result
 */
export function apiValidateAsyncEndpointResponseByPath<
  Api extends ApiSpec,
  Method extends ApiMethod,
  Path extends ApiGetPathsByMethod<Api, Method>,
  StatusCode extends keyof ApiGetEndpointByPath<Api, Method, Path>["responses"],
  $Schema = ApiGetEndpointEntrySchemaByPath<Api, Method, Path, "responses", StatusCode>,
  $SchemaType extends SchemaType = ApiGetEndpointEntrySchemaTypeByPath<Api, Method, Path, "responses", StatusCode>
>(
  api: Api,
  method: Method,
  path: Path,
  statusCode: StatusCode,
  value: unknown
): Promise<SchemaValidationResult<$Schema, NonNullable<$SchemaType["_provider"]>>> {
  return apiValidateAsyncEndpointEntryByPath(api, method, path, "responses", statusCode, value);
}
