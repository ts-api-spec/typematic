import type { ApiEntry, ApiMethod, ApiSpec } from "./types";
import type {
  ApiGetPathsByMethod,
  ApiGetEndpoint,
  ApiGetEndpointByPath,
  ApiGetEndpointBody,
  ApiGetEndpointBodyByPath,
  ApiGetEndpointBodySchema,
  ApiGetEndpointBodySchemaByPath,
  ApiGetEndpointEntries,
  ApiGetEndpointEntriesByPath,
  ApiGetEndpointEntry,
  ApiGetEndpointEntryByPath,
  ApiGetEndpointEntrySchema,
  ApiGetEndpointEntrySchemaByPath,
  ApiGetEndpointParams,
  ApiGetEndpointParamsByPath,
  ApiGetEndpointParam,
  ApiGetEndpointParamByPath,
  ApiGetEndpointParamSchema,
  ApiGetEndpointParamSchemaByPath,
  ApiGetEndpointQueries,
  ApiGetEndpointQueriesByPath,
  ApiGetEndpointQuery,
  ApiGetEndpointQueryByPath,
  ApiGetEndpointQuerySchema,
  ApiGetEndpointQuerySchemaByPath,
  ApiGetEndpointHeaders,
  ApiGetEndpointHeadersByPath,
  ApiGetEndpointHeader,
  ApiGetEndpointHeaderByPath,
  ApiGetEndpointHeaderSchema,
  ApiGetEndpointHeaderSchemaByPath,
  ApiGetEndpointCookies,
  ApiGetEndpointCookiesByPath,
  ApiGetEndpointCookie,
  ApiGetEndpointCookieByPath,
  ApiGetEndpointCookieSchema,
  ApiGetEndpointCookieSchemaByPath,
  ApiGetEndpointResponses,
  ApiGetEndpointResponsesByPath,
  ApiGetEndpointResponse,
  ApiGetEndpointResponseByPath,
  ApiGetEndpointResponseSchema,
  ApiGetEndpointResponseSchemaByPath,
} from "./parser.types";

/**
 * allow to throw an error in an expression
 * @param message - The error message to throw
 */
function raiseError(message: string): never {
  throw new Error(message);
}

/**
 * extracts the schema from an api spec entry
 * @param value - The api spec entry to get the schema from
 * @returns
 */
function apiGetSchemaOf(value: any): unknown {
  if (value && "schema" in value) {
    if (typeof value.validate === "function" || typeof value.parse === "function") {
      return value;
    }
    return value.schema;
  }
  return value;
}

/**
 * get an endpoint entry from an api spec
 * @param api - The api spec to get the endpoint from
 * @param endpointName - The name of the endpoint to get
 * @returns the endpoint entry
 * @throws if the endpoint is not found
 */
export function apiGetEndpoint<Api extends ApiSpec, Endpoint extends keyof Api["endpoints"]>(
  api: Api,
  endpointName: Endpoint
): ApiGetEndpoint<Api, Endpoint> {
  return (api.endpoints[endpointName as string] as any) ?? raiseError(`Endpoint not found: ${endpointName as string}`);
}

/**
 * get an endpoint entry from an api spec by path
 * @param api - The api spec to get the endpoint from
 * @param method - The method of the endpoint to get
 * @param path - The path of the endpoint to get
 * @returns the endpoint entry
 * @throws if the endpoint is not found
 */
export function apiGetEndpointByPath<
  Api extends ApiSpec,
  Method extends ApiMethod,
  Path extends ApiGetPathsByMethod<Api, Method>
>(api: Api, method: Method, path: Path): ApiGetEndpointByPath<Api, Method, Path> {
  for (const endpoint in api.endpoints) {
    if (
      api.endpoints[endpoint].method.toLowerCase() === method.toLowerCase() &&
      api.endpoints[endpoint].path === path
    ) {
      return api.endpoints[endpoint] as any;
    }
  }
  throw new Error(`Endpoint not found: ${method} ${path}`);
}

/**
 * get the body of an endpoint from an api spec
 * @param api - The api spec to get body from
 * @param endpointName - The name of the endpoint to get body from
 * @returns the body of the endpoint
 * @throws if the endpoint is not found
 */
export function apiGetEndpointBody<Api extends ApiSpec, Endpoint extends keyof Api["endpoints"]>(
  api: Api,
  endpointName: Endpoint
): ApiGetEndpointBody<Api, Endpoint> {
  const endpoint = apiGetEndpoint(api, endpointName);
  return endpoint.body as any;
}

/**
 * get the body entry of an endpoint from an api spec by path
 * @param api - The api spec to get body from
 * @param method - The method of the endpoint to get body from
 * @param path - The path of the endpoint to get body from
 * @returns the body entry of the endpoint
 * @throws if the endpoint is not found
 */
export function apiGetEndpointBodyByPath<
  Api extends ApiSpec,
  Method extends ApiMethod,
  Path extends ApiGetPathsByMethod<Api, Method>
>(api: Api, method: Method, path: Path): ApiGetEndpointBodyByPath<Api, Method, Path> {
  const endpoint = apiGetEndpointByPath(api, method, path);
  return endpoint.body as any;
}

/**
 * get the schema of the body entry of an endpoint from an api spec
 * @param api - The api spec to get body schema from
 * @param endpointName - The name of the endpoint to get body schema from
 * @returns the schema of the body entry
 * @throws if the endpoint is not found
 */
export function apiGetEndpointBodySchema<Api extends ApiSpec, Endpoint extends keyof Api["endpoints"]>(
  api: Api,
  endpointName: Endpoint
): ApiGetEndpointBodySchema<Api, Endpoint> {
  const endpoint = apiGetEndpoint(api, endpointName);
  return apiGetSchemaOf(endpoint.body) as any;
}

/**
 * get the schema of the body entry of an endpoint from an api spec by path
 * @param api - The api spec to get body schema from
 * @param method - The method of the endpoint to get body schema from
 * @param path - The path of the endpoint to get body schema from
 * @returns the schema of the body entry
 * @throws if the endpoint is not found
 */
export function apiGetEndpointBodySchemaByPath<
  Api extends ApiSpec,
  Method extends ApiMethod,
  Path extends ApiGetPathsByMethod<Api, Method>
>(api: Api, method: Method, path: Path): ApiGetEndpointBodySchemaByPath<Api, Method, Path> {
  const endpoint = apiGetEndpointByPath(api, method, path);
  return apiGetSchemaOf(endpoint.body) as any;
}

/**
 * get the entries parameters of an endpoint from an api spec
 *
 * entries can be:
 * - query
 * - path parameter
 * - header
 * - cookie
 * - response
 *
 * @param api - The api spec to get entries from
 * @param endpointName - The name of the endpoint to get entries from
 * @param entryName - The name of the entry to get
 * @returns the entries parameters of the endpoint
 * @throws if the endpoint is not found
 */
export function apiGetEndpointEntries<
  Api extends ApiSpec,
  Endpoint extends keyof Api["endpoints"],
  Entry extends ApiEntry
>(api: Api, endpointName: Endpoint, entryName: Entry): ApiGetEndpointEntries<Api, Endpoint, Entry> {
  const endpoint = apiGetEndpoint(api, endpointName);
  return endpoint[entryName] as any;
}

/**
 * get the entries parameters of an endpoint from an api spec by path
 *
 * entries can be:
 * - query
 * - path parameter
 * - header
 * - cookie
 * - response
 *
 * @param api - The api spec to get entries from
 * @param method - The method of the endpoint to get entries from
 * @param path - The path of the endpoint to get entries from
 * @param entryName - The name of the entry to get
 * @returns the entries parameters of the endpoint
 */
export function apiGetEndpointEntriesByPath<
  Api extends ApiSpec,
  Method extends ApiMethod,
  Path extends ApiGetPathsByMethod<Api, Method>,
  Entry extends ApiEntry
>(api: Api, method: Method, path: Path, entryName: Entry): ApiGetEndpointEntriesByPath<Api, Method, Path, Entry> {
  const endpoint = apiGetEndpointByPath(api, method, path);
  return endpoint[entryName] as any;
}

/**
 * get an entry parameter of an endpoint from an api spec
 *
 * entry parameters can be from:
 * - query
 * - path parameter
 * - header
 * - cookie
 * - response
 *
 * @param api - The api spec to get entry from
 * @param endpointName - The name of the endpoint to get entry from
 * @param entryName - The name of the entry to get
 * @param entryParam - The name of the entry parameter to get
 * @returns the entry parameter from the endpoint
 * @throws if the endpoint is not found
 */
export function apiGetEndpointEntry<
  Api extends ApiSpec,
  Endpoint extends keyof Api["endpoints"],
  Entry extends ApiEntry,
  EntryName extends keyof ApiGetEndpointEntries<Api, Endpoint, Entry>
>(
  api: Api,
  endpointName: Endpoint,
  entryName: Entry,
  entryParam: EntryName
): ApiGetEndpointEntry<Api, Endpoint, Entry, EntryName> {
  const endpoint = apiGetEndpoint(api, endpointName) as any;
  return endpoint[entryName]?.[entryParam];
}

/**
 * get an entry parameter of an endpoint from an api spec by path
 *
 * entry parameters can be from:
 * - query
 * - path parameter
 * - header
 * - cookie
 * - response
 *
 * @param api - The api spec to get entry from
 * @param method - The method of the endpoint to get entry from
 * @param path - The path of the endpoint to get entry from
 * @param entryName - The name of the entry to get
 * @param entryParam - The name of the entry parameter to get
 * @returns the entry parameter from the endpoint
 * @throws if the endpoint is not found
 */
export function apiGetEndpointEntryByPath<
  Api extends ApiSpec,
  Method extends ApiMethod,
  Path extends ApiGetPathsByMethod<Api, Method>,
  Entry extends ApiEntry,
  EntryName extends keyof ApiGetEndpointEntriesByPath<Api, Method, Path, Entry>
>(
  api: Api,
  method: Method,
  path: Path,
  entryName: Entry,
  entryParam: EntryName
): ApiGetEndpointEntryByPath<Api, Method, Path, Entry, EntryName> {
  const endpoint = apiGetEndpointByPath(api, method, path) as any;
  return endpoint[entryName]?.[entryParam];
}

/**
 * get the schema of an entry parameter of an endpoint from an api spec
 * @param api - The api spec to get the schema from
 * @param endpointName - The name of the endpoint to get the schema from
 * @param entryName - The name of the entry to get the schema from
 * @param entryParam - The name of the entry parameter to get the schema from
 * @returns the schema of the entry parameter
 * @throws if the endpoint is not found
 */
export function apiGetEndpointEntrySchema<
  Api extends ApiSpec,
  Endpoint extends keyof Api["endpoints"],
  Entry extends ApiEntry,
  EntryName extends keyof ApiGetEndpointEntries<Api, Endpoint, Entry>
>(
  api: Api,
  endpointName: Endpoint,
  entryName: Entry,
  entryParam: EntryName
): ApiGetEndpointEntrySchema<Api, Endpoint, Entry, EntryName> {
  const endpoint = apiGetEndpoint(api, endpointName) as any;
  return apiGetSchemaOf(endpoint[entryName]?.[entryParam]) as any;
}

/**
 * get the schema of an entry parameter of an endpoint from an api spec by path
 * @param api - The api spec to get the schema from
 * @param method - The method of the endpoint to get the schema from
 * @param path - The path of the endpoint to get the schema from
 * @param entryName - The name of the entry to get the schema from
 * @param entryParam - The name of the entry parameter to get the schema from
 * @returns the schema of the entry parameter
 * @throws if the endpoint is not found
 */
export function apiGetEndpointEntrySchemaByPath<
  Api extends ApiSpec,
  Method extends ApiMethod,
  Path extends ApiGetPathsByMethod<Api, Method>,
  Entry extends ApiEntry,
  EntryName extends keyof ApiGetEndpointEntriesByPath<Api, Method, Path, Entry>
>(
  api: Api,
  method: Method,
  path: Path,
  entryName: Entry,
  entryParam: EntryName
): ApiGetEndpointEntrySchemaByPath<Api, Method, Path, Entry, EntryName> {
  const endpoint = apiGetEndpointByPath(api, method, path) as any;
  return apiGetSchemaOf(endpoint[entryName]?.[entryParam]) as any;
}

/**
 * get the path parameters of an endpoint from an api spec
 * @param api - The api spec to get path parameters from
 * @param endpointName - The name of the endpoint to get path parameters from
 * @returns the path parameters of the endpoint
 * @throws if the endpoint is not found
 */
export function apiGetEndpointParams<Api extends ApiSpec, Endpoint extends keyof Api["endpoints"]>(
  api: Api,
  endpointName: Endpoint
): ApiGetEndpointParams<Api, Endpoint> {
  const endpoint = apiGetEndpoint(api, endpointName);
  return endpoint.params as any;
}

/**
 * get the path parameters of an endpoint from an api spec by path
 * @param api - The api spec to get path parameters from
 * @param method - The method of the endpoint to get path parameters from
 * @param path - The path of the endpoint to get path parameters from
 * @returns the path parameters of the endpoint
 * @throws if the endpoint is not found
 */
export function apiGetEndpointParamsByPath<
  Api extends ApiSpec,
  Method extends ApiMethod,
  Path extends ApiGetPathsByMethod<Api, Method>
>(api: Api, method: Method, path: Path): ApiGetEndpointParamsByPath<Api, Method, Path> {
  const endpoint = apiGetEndpointByPath(api, method, path);
  return endpoint.params as any;
}

/**
 * get a path parameter of an endpoint from an api spec
 * @param api - The api spec to get path parameter from
 * @param endpointName - The name of the endpoint to get path parameter from
 * @param paramName - The name of the path parameter to get
 * @returns the path parameter from the endpoint
 * @throws if the endpoint is not found
 */
export function apiGetEndpointParam<
  Api extends ApiSpec,
  Endpoint extends keyof Api["endpoints"],
  Param extends keyof ApiGetEndpointParams<Api, Endpoint>
>(api: Api, endpointName: Endpoint, paramName: Param): ApiGetEndpointParam<Api, Endpoint, Param> {
  const endpoint = apiGetEndpoint(api, endpointName);
  return endpoint.params?.[paramName] as any;
}

/**
 * get a path parameter of an endpoint from an api spec by path
 * @param api - The api spec to get path parameter from
 * @param method - The method of the endpoint to get path parameter from
 * @param path - The path of the endpoint to get path parameter from
 * @param paramName - The name of the path parameter to get
 * @returns the path parameter from the endpoint
 * @throws if the endpoint is not found
 */
export function apiGetEndpointParamByPath<
  Api extends ApiSpec,
  Method extends ApiMethod,
  Path extends ApiGetPathsByMethod<Api, Method>,
  Param extends keyof ApiGetEndpointParamsByPath<Api, Method, Path>
>(api: Api, method: Method, path: Path, paramName: Param): ApiGetEndpointParamByPath<Api, Method, Path, Param> {
  const endpoint = apiGetEndpointByPath(api, method, path);
  return endpoint.params?.[paramName] as any;
}

/**
 * get the schema of a path parameter of an endpoint from an api spec
 * @param api - The api spec to get the schema from
 * @param endpointName - The name of the endpoint to get the schema from
 * @param paramName - The name of the path parameter to get the schema from
 * @returns the schema of the path parameter
 * @throws if the endpoint is not found
 */
export function apiGetEndpointParamSchema<
  Api extends ApiSpec,
  Endpoint extends keyof Api["endpoints"],
  Param extends keyof ApiGetEndpointParams<Api, Endpoint>
>(api: Api, endpointName: Endpoint, paramName: Param): ApiGetEndpointParamSchema<Api, Endpoint, Param> {
  const endpoint = apiGetEndpoint(api, endpointName);
  return apiGetSchemaOf(endpoint.params?.[paramName]) as any;
}

/**
 * get the schema of a path parameter of an endpoint from an api spec by path
 * @param api - The api spec to get the schema from
 * @param method - The method of the endpoint to get the schema from
 * @param path - The path of the endpoint to get the schema from
 * @param paramName - The name of the path parameter to get the schema from
 * @returns the schema of the path parameter
 * @throws if the endpoint is not found
 */
export function apiGetEndpointParamSchemaByPath<
  Api extends ApiSpec,
  Method extends ApiMethod,
  Path extends ApiGetPathsByMethod<Api, Method>,
  Param extends keyof ApiGetEndpointParamsByPath<Api, Method, Path>
>(api: Api, method: Method, path: Path, paramName: Param): ApiGetEndpointParamSchemaByPath<Api, Method, Path, Param> {
  const endpoint = apiGetEndpointByPath(api, method, path);
  return apiGetSchemaOf(endpoint.params?.[paramName]) as any;
}

/**
 * get the query parameters of an endpoint from an api spec
 * @param api - The api spec to get query parameters from
 * @param endpointName - The name of the endpoint to get query parameters from
 * @returns the query parameters of the endpoint
 * @throws if the endpoint is not found
 */
export function apiGetEndpointQueries<Api extends ApiSpec, Endpoint extends keyof Api["endpoints"]>(
  api: Api,
  endpointName: Endpoint
): ApiGetEndpointQueries<Api, Endpoint> {
  const endpoint = apiGetEndpoint(api, endpointName);
  return endpoint.query as any;
}

/**
 * get the query parameters of an endpoint from an api spec by path
 * @param api - The api spec to get query parameters from
 * @param method - The method of the endpoint to get query parameters from
 * @param path - The path of the endpoint to get query parameters from
 * @returns the query parameters of the endpoint
 * @throws if the endpoint is not found
 */
export function apiGetEndpointQueriesByPath<
  Api extends ApiSpec,
  Method extends ApiMethod,
  Path extends ApiGetPathsByMethod<Api, Method>
>(api: Api, method: Method, path: Path): ApiGetEndpointQueriesByPath<Api, Method, Path> {
  const endpoint = apiGetEndpointByPath(api, method, path);
  return endpoint.query as any;
}

/**
 * get a query parameter of an endpoint from an api spec
 * @param api - The api spec to get query parameter from
 * @param endpointName - The name of the endpoint to get query parameter from
 * @param queryName - The name of the query parameter to get
 * @returns the query parameter from the endpoint
 * @throws if the endpoint is not found
 */
export function apiGetEndpointQuery<
  Api extends ApiSpec,
  Endpoint extends keyof Api["endpoints"],
  Query extends keyof ApiGetEndpointQueries<Api, Endpoint>
>(api: Api, endpointName: Endpoint, queryName: Query): ApiGetEndpointQuery<Api, Endpoint, Query> {
  const endpoint = apiGetEndpoint(api, endpointName);
  return endpoint.query?.[queryName] as any;
}

/**
 * get a query parameter of an endpoint from an api spec by path
 * @param api - The api spec to get query parameter from
 * @param method - The method of the endpoint to get query parameter from
 * @param path - The path of the endpoint to get query parameter from
 * @param queryName - The name of the query parameter to get
 * @returns the query parameter from the endpoint
 * @throws if the endpoint is not found
 */
export function apiGetEndpointQueryByPath<
  Api extends ApiSpec,
  Method extends ApiMethod,
  Path extends ApiGetPathsByMethod<Api, Method>,
  Query extends keyof ApiGetEndpointQueriesByPath<Api, Method, Path>
>(api: Api, method: Method, path: Path, queryName: Query): ApiGetEndpointQueryByPath<Api, Method, Path, Query> {
  const endpoint = apiGetEndpointByPath(api, method, path);
  return endpoint.query?.[queryName] as any;
}

/**
 * get the schema of a query parameter of an endpoint from an api spec
 * @param api - The api spec to get the schema from
 * @param endpointName - The name of the endpoint to get the schema from
 * @param queryName - The name of the query parameter to get the schema from
 * @returns the schema of the query parameter
 * @throws if the endpoint is not found
 */
export function apiGetEndpointQuerySchema<
  Api extends ApiSpec,
  Endpoint extends keyof Api["endpoints"],
  Query extends keyof ApiGetEndpointQueries<Api, Endpoint>
>(api: Api, endpointName: Endpoint, queryName: Query): ApiGetEndpointQuerySchema<Api, Endpoint, Query> {
  const endpoint = apiGetEndpoint(api, endpointName);
  return apiGetSchemaOf(endpoint.query?.[queryName]) as any;
}

/**
 * get the schema of a query parameter of an endpoint from an api spec by path
 * @param api - The api spec to get the schema from
 * @param method - The method of the endpoint to get the schema from
 * @param path - The path of the endpoint to get the schema from
 * @param queryName - The name of the query parameter to get the schema from
 * @returns the schema of the query parameter
 * @throws if the endpoint is not found
 */
export function apiGetEndpointQuerySchemaByPath<
  Api extends ApiSpec,
  Method extends ApiMethod,
  Path extends ApiGetPathsByMethod<Api, Method>,
  Query extends keyof ApiGetEndpointQueriesByPath<Api, Method, Path>
>(api: Api, method: Method, path: Path, queryName: Query): ApiGetEndpointQuerySchemaByPath<Api, Method, Path, Query> {
  const endpoint = apiGetEndpointByPath(api, method, path);
  return apiGetSchemaOf(endpoint.query?.[queryName]) as any;
}

/**
 * get the headers of an endpoint from an api spec
 * @param api - The api spec to get headers from
 * @param endpointName - The name of the endpoint to get headers from
 * @returns the headers of the endpoint
 * @throws if the endpoint is not found
 */
export function apiGetEndpointHeaders<Api extends ApiSpec, Endpoint extends keyof Api["endpoints"]>(
  api: Api,
  endpointName: Endpoint
): ApiGetEndpointHeaders<Api, Endpoint> {
  const endpoint = apiGetEndpoint(api, endpointName);
  return endpoint.headers as any;
}

/**
 * get the headers of an endpoint from an api spec by path
 * @param api - The api spec to get headers from
 * @param method - The method of the endpoint to get headers from
 * @param path - The path of the endpoint to get headers from
 * @returns the headers of the endpoint
 * @throws if the endpoint is not found
 */
export function apiGetEndpointHeadersByPath<
  Api extends ApiSpec,
  Method extends ApiMethod,
  Path extends ApiGetPathsByMethod<Api, Method>
>(api: Api, method: Method, path: Path): ApiGetEndpointHeadersByPath<Api, Method, Path> {
  const endpoint = apiGetEndpointByPath(api, method, path);
  return endpoint.headers as any;
}

/**
 * get a header of an endpoint from an api spec
 * @param api - The api spec to get header from
 * @param endpointName - The name of the endpoint to get header from
 * @param headerName - The name of the header to get
 * @returns the header from the endpoint
 * @throws if the endpoint is not found
 */
export function apiGetEndpointHeader<
  Api extends ApiSpec,
  Endpoint extends keyof Api["endpoints"],
  Header extends keyof ApiGetEndpointHeaders<Api, Endpoint>
>(api: Api, endpointName: Endpoint, headerName: Header): ApiGetEndpointHeader<Api, Endpoint, Header> {
  const endpoint = apiGetEndpoint(api, endpointName);
  return endpoint.headers?.[headerName] as any;
}

/**
 * get a header of an endpoint from an api spec by path
 * @param api - The api spec to get header from
 * @param method - The method of the endpoint to get header from
 * @param path - The path of the endpoint to get header from
 * @param headerName - The name of the header to get
 * @returns the header from the endpoint
 * @throws if the endpoint is not found
 */
export function apiGetEndpointHeaderByPath<
  Api extends ApiSpec,
  Method extends ApiMethod,
  Path extends ApiGetPathsByMethod<Api, Method>,
  Header extends keyof ApiGetEndpointHeadersByPath<Api, Method, Path>
>(api: Api, method: Method, path: Path, headerName: Header): ApiGetEndpointHeaderByPath<Api, Method, Path, Header> {
  const endpoint = apiGetEndpointByPath(api, method, path);
  return endpoint.headers?.[headerName] as any;
}

/**
 * get the schema of a header of an endpoint from an api spec
 * @param api - The api spec to get the schema from
 * @param endpointName - The name of the endpoint to get the schema from
 * @param headerName - The name of the header to get the schema from
 * @returns the schema of the header
 * @throws if the endpoint is not found
 */
export function apiGetEndpointHeaderSchema<
  Api extends ApiSpec,
  Endpoint extends keyof Api["endpoints"],
  Header extends keyof ApiGetEndpointHeaders<Api, Endpoint>
>(api: Api, endpointName: Endpoint, headerName: Header): ApiGetEndpointHeaderSchema<Api, Endpoint, Header> {
  const endpoint = apiGetEndpoint(api, endpointName);
  return apiGetSchemaOf(endpoint.headers?.[headerName]) as any;
}

/**
 * get the schema of a header of an endpoint from an api spec by path
 * @param api - The api spec to get the schema from
 * @param method - The method of the endpoint to get the schema from
 * @param path - The path of the endpoint to get the schema from
 * @param headerName - The name of the header to get the schema from
 * @returns the schema of the header
 * @throws if the endpoint is not found
 */
export function apiGetEndpointHeaderSchemaByPath<
  Api extends ApiSpec,
  Method extends ApiMethod,
  Path extends ApiGetPathsByMethod<Api, Method>,
  Header extends keyof ApiGetEndpointHeadersByPath<Api, Method, Path>
>(
  api: Api,
  method: Method,
  path: Path,
  headerName: Header
): ApiGetEndpointHeaderSchemaByPath<Api, Method, Path, Header> {
  const endpoint = apiGetEndpointByPath(api, method, path);
  return apiGetSchemaOf(endpoint.headers?.[headerName]) as any;
}

/**
 * get the cookies of an endpoint from an api spec
 * @param api - The api spec to get cookies from
 * @param endpointName - The name of the endpoint to get cookies from
 * @returns the cookies of the endpoint
 * @throws if the endpoint is not found
 */
export function apiGetEndpointCookies<Api extends ApiSpec, Endpoint extends keyof Api["endpoints"]>(
  api: Api,
  endpointName: Endpoint
): ApiGetEndpointCookies<Api, Endpoint> {
  const endpoint = apiGetEndpoint(api, endpointName);
  return endpoint.cookies as any;
}

/**
 * get the cookies of an endpoint from an api spec by path
 * @param api - The api spec to get cookies from
 * @param method - The method of the endpoint to get cookies from
 * @param path - The path of the endpoint to get cookies from
 * @returns the cookies of the endpoint
 * @throws if the endpoint is not found
 */
export function apiGetEndpointCookiesByPath<
  Api extends ApiSpec,
  Method extends ApiMethod,
  Path extends ApiGetPathsByMethod<Api, Method>
>(api: Api, method: Method, path: Path): ApiGetEndpointCookiesByPath<Api, Method, Path> {
  const endpoint = apiGetEndpointByPath(api, method, path);
  return endpoint.cookies as any;
}

/**
 * get a cookie of an endpoint from an api spec
 * @param api - The api spec to get cookie from
 * @param endpointName - The name of the endpoint to get cookie from
 * @param cookieName - The name of the cookie to get
 * @returns the cookie from the endpoint
 * @throws if the endpoint is not found
 */
export function apiGetEndpointCookie<
  Api extends ApiSpec,
  Endpoint extends keyof Api["endpoints"],
  Cookie extends keyof ApiGetEndpointCookies<Api, Endpoint>
>(api: Api, endpointName: Endpoint, cookieName: Cookie): ApiGetEndpointCookie<Api, Endpoint, Cookie> {
  const endpoint = apiGetEndpoint(api, endpointName);
  return endpoint.cookies?.[cookieName] as any;
}

/**
 * get a cookie of an endpoint from an api spec by path
 * @param api - The api spec to get cookie from
 * @param method - The method of the endpoint to get cookie from
 * @param path - The path of the endpoint to get cookie from
 * @param cookieName - The name of the cookie to get
 * @returns the cookie from the endpoint
 * @throws if the endpoint is not found
 */
export function apiGetEndpointCookieByPath<
  Api extends ApiSpec,
  Method extends ApiMethod,
  Path extends ApiGetPathsByMethod<Api, Method>,
  Cookie extends keyof ApiGetEndpointCookiesByPath<Api, Method, Path>
>(api: Api, method: Method, path: Path, cookieName: Cookie): ApiGetEndpointCookieByPath<Api, Method, Path, Cookie> {
  const endpoint = apiGetEndpointByPath(api, method, path);
  return endpoint.cookies?.[cookieName] as any;
}

/**
 * get the schema of a cookie of an endpoint from an api spec
 * @param api - The api spec to get the schema from
 * @param endpointName - The name of the endpoint to get the schema from
 * @param cookieName - The name of the cookie to get the schema from
 * @returns the schema of the cookie
 * @throws if the endpoint is not found
 */
export function apiGetEndpointCookieSchema<
  Api extends ApiSpec,
  Endpoint extends keyof Api["endpoints"],
  Cookie extends keyof ApiGetEndpointCookies<Api, Endpoint>
>(api: Api, endpointName: Endpoint, cookieName: Cookie): ApiGetEndpointCookieSchema<Api, Endpoint, Cookie> {
  const endpoint = apiGetEndpoint(api, endpointName);
  return apiGetSchemaOf(endpoint.cookies?.[cookieName]) as any;
}

/**
 * get the schema of a cookie of an endpoint from an api spec by path
 * @param api - The api spec to get the schema from
 * @param method - The method of the endpoint to get the schema from
 * @param path - The path of the endpoint to get the schema from
 * @param cookieName - The name of the cookie to get the schema from
 * @returns the schema of the cookie
 * @throws if the endpoint is not found
 */
export function apiGetEndpointCookieSchemaByPath<
  Api extends ApiSpec,
  Method extends ApiMethod,
  Path extends ApiGetPathsByMethod<Api, Method>,
  Cookie extends keyof ApiGetEndpointCookiesByPath<Api, Method, Path>
>(
  api: Api,
  method: Method,
  path: Path,
  cookieName: Cookie
): ApiGetEndpointCookieSchemaByPath<Api, Method, Path, Cookie> {
  const endpoint = apiGetEndpointByPath(api, method, path);
  return apiGetSchemaOf(endpoint.cookies?.[cookieName]) as any;
}

/**
 * get the responses of an endpoint from an api spec
 * @param api - The api spec to get responses from
 * @param endpointName - The name of the endpoint to get responses from
 * @returns the responses of the endpoint
 * @throws if the endpoint is not found
 */
export function apiGetEndpointResponses<Api extends ApiSpec, Endpoint extends keyof Api["endpoints"]>(
  api: Api,
  endpointName: Endpoint
): ApiGetEndpointResponses<Api, Endpoint> {
  const endpoint = apiGetEndpoint(api, endpointName);
  return endpoint.responses as any;
}

/**
 * get the responses of an endpoint from an api spec by path
 * @param api - The api spec to get responses from
 * @param method - The method of the endpoint to get responses from
 * @param path - The path of the endpoint to get responses from
 * @returns the responses of the endpoint
 * @throws if the endpoint is not found
 */
export function apiGetEndpointResponsesByPath<
  Api extends ApiSpec,
  Method extends ApiMethod,
  Path extends ApiGetPathsByMethod<Api, Method>
>(api: Api, method: Method, path: Path): ApiGetEndpointResponsesByPath<Api, Method, Path> {
  const endpoint = apiGetEndpointByPath(api, method, path);
  return endpoint.responses as any;
}

/**
 * get a response of an endpoint from an api spec
 * @param api - The api spec to get response from
 * @param endpointName - The name of the endpoint to get response from
 * @param statusCode - The status code of the response to get
 * @returns the response of the endpoint
 * @throws if the endpoint is not found
 */
export function apiGetEndpointResponse<
  Api extends ApiSpec,
  Endpoint extends keyof Api["endpoints"],
  StatusCode extends keyof ApiGetEndpointResponses<Api, Endpoint>
>(api: Api, endpointName: Endpoint, statusCode: StatusCode): ApiGetEndpointResponse<Api, Endpoint, StatusCode> {
  const endpoint = apiGetEndpoint(api, endpointName);
  return endpoint.responses?.[statusCode] as any;
}

/**
 * get a response of an endpoint from an api spec by path
 * @param api - The api spec to get response from
 * @param method - The method of the endpoint to get response from
 * @param path - The path of the endpoint to get response from
 * @param statusCode - The status code of the response to get
 * @returns the response of the endpoint
 * @throws if the endpoint is not found
 */
export function apiGetEndpointResponseByPath<
  Api extends ApiSpec,
  Method extends ApiMethod,
  Path extends ApiGetPathsByMethod<Api, Method>,
  StatusCode extends keyof ApiGetEndpointResponsesByPath<Api, Method, Path>
>(
  api: Api,
  method: Method,
  path: Path,
  statusCode: StatusCode
): ApiGetEndpointResponseByPath<Api, Method, Path, StatusCode> {
  const endpoint = apiGetEndpointByPath(api, method, path);
  return endpoint.responses?.[statusCode] as any;
}

/**
 * get the schema of a response of an endpoint from an api spec
 * @param api - The api spec to get the schema from
 * @param endpointName - The name of the endpoint to get the schema from
 * @param statusCode - The status code of the response to get the schema from
 * @returns the schema of the response
 * @throws if the endpoint is not found
 */
export function apiGetEndpointResponseSchema<
  Api extends ApiSpec,
  Endpoint extends keyof Api["endpoints"],
  StatusCode extends keyof ApiGetEndpointResponses<Api, Endpoint>
>(api: Api, endpointName: Endpoint, statusCode: StatusCode): ApiGetEndpointResponseSchema<Api, Endpoint, StatusCode> {
  const endpoint = apiGetEndpoint(api, endpointName);
  return apiGetSchemaOf(endpoint.responses?.[statusCode]) as any;
}

/**
 * get the schema of a response of an endpoint from an api spec by path
 * @param api - The api spec to get the schema from
 * @param method - The method of the endpoint to get the schema from
 * @param path - The path of the endpoint to get the schema from
 * @param statusCode - The status code of the response to get the schema from
 * @returns the schema of the response
 */
export function apiGetEndpointResponseSchemaByPath<
  Api extends ApiSpec,
  Method extends ApiMethod,
  Path extends ApiGetPathsByMethod<Api, Method>,
  StatusCode extends keyof ApiGetEndpointResponsesByPath<Api, Method, Path>
>(
  api: Api,
  method: Method,
  path: Path,
  statusCode: StatusCode
): ApiGetEndpointResponseSchemaByPath<Api, Method, Path, StatusCode> {
  const endpoint = apiGetEndpointByPath(api, method, path);
  return apiGetSchemaOf(endpoint.responses?.[statusCode]) as any;
}
