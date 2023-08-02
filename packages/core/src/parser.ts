import type { ApiMethod, ApiSpec } from "./types";
import type {
  ApiGetPathsByMethod,
  ApiGetEndpoint,
  ApiGetEndpointByPath,
  ApiGetEndpointBody,
  ApiGetEndpointBodyByPath,
  ApiGetEndpointBodySchema,
  ApiGetEndpointBodySchemaByPath,
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

function apiGetSchemaOf(value: any): unknown {
  if (value && "schema" in value) {
    if ("validate" in (value.schema as any)) {
      return value;
    }
    return value.schema;
  }
  return value;
}

export function apiGetEndpoint<Api extends ApiSpec, Endpoint extends keyof Api["endpoints"]>(
  api: Api,
  endpointName: Endpoint
): ApiGetEndpoint<Api, Endpoint> {
  return api.endpoints[endpointName as string] as any;
}

export function apiGetEndpointByPath<
  Api extends ApiSpec,
  Method extends ApiMethod,
  Path extends ApiGetPathsByMethod<Api, Method>
>(api: Api, method: Method, path: Path): ApiGetEndpointByPath<Api, Method, Path> {
  for (const endpoint in api.endpoints) {
    if (api.endpoints[endpoint].method === method && api.endpoints[endpoint].path === path) {
      return api.endpoints[endpoint] as any;
    }
  }
  throw new Error(`Endpoint not found for method ${method} and path ${path}`);
}

export function apiGetEndpointBody<Api extends ApiSpec, Endpoint extends keyof Api["endpoints"]>(
  api: Api,
  endpointName: Endpoint
): ApiGetEndpointBody<Api, Endpoint> {
  const endpoint = apiGetEndpoint(api, endpointName);
  return endpoint.body as any;
}

export function apiGetEndpointBodyByPath<
  Api extends ApiSpec,
  Method extends ApiMethod,
  Path extends ApiGetPathsByMethod<Api, Method>
>(api: Api, method: Method, path: Path): ApiGetEndpointBodyByPath<Api, Method, Path> {
  const endpoint = apiGetEndpointByPath(api, method, path);
  return endpoint.body as any;
}

export function apiGetEndpointBodySchema<Api extends ApiSpec, Endpoint extends keyof Api["endpoints"]>(
  api: Api,
  endpointName: Endpoint
): ApiGetEndpointBodySchema<Api, Endpoint> {
  const endpoint = apiGetEndpoint(api, endpointName);
  return apiGetSchemaOf(endpoint.body) as any;
}

export function apiGetEndpointBodySchemaByPath<
  Api extends ApiSpec,
  Method extends ApiMethod,
  Path extends ApiGetPathsByMethod<Api, Method>
>(api: Api, method: Method, path: Path): ApiGetEndpointBodySchemaByPath<Api, Method, Path> {
  const endpoint = apiGetEndpointByPath(api, method, path);
  return apiGetSchemaOf(endpoint.body) as any;
}

export function apiGetEndpointParams<Api extends ApiSpec, Endpoint extends keyof Api["endpoints"]>(
  api: Api,
  endpointName: Endpoint
): ApiGetEndpointParams<Api, Endpoint> {
  const endpoint = apiGetEndpoint(api, endpointName);
  return endpoint.params as any;
}

export function apiGetEndpointParamsByPath<
  Api extends ApiSpec,
  Method extends ApiMethod,
  Path extends ApiGetPathsByMethod<Api, Method>
>(api: Api, method: Method, path: Path): ApiGetEndpointParamsByPath<Api, Method, Path> {
  const endpoint = apiGetEndpointByPath(api, method, path);
  return endpoint.params as any;
}

export function apiGetEndpointParam<
  Api extends ApiSpec,
  Endpoint extends keyof Api["endpoints"],
  Param extends keyof ApiGetEndpointParams<Api, Endpoint>
>(api: Api, endpointName: Endpoint, paramName: Param): ApiGetEndpointParam<Api, Endpoint, Param> {
  const endpoint = apiGetEndpoint(api, endpointName);
  return endpoint.params?.[paramName] as any;
}

export function apiGetEndpointParamByPath<
  Api extends ApiSpec,
  Method extends ApiMethod,
  Path extends ApiGetPathsByMethod<Api, Method>,
  Param extends keyof ApiGetEndpointParamsByPath<Api, Method, Path>
>(api: Api, method: Method, path: Path, paramName: Param): ApiGetEndpointParamByPath<Api, Method, Path, Param> {
  const endpoint = apiGetEndpointByPath(api, method, path);
  return endpoint.params?.[paramName] as any;
}

export function apiGetEndpointParamSchema<
  Api extends ApiSpec,
  Endpoint extends keyof Api["endpoints"],
  Param extends keyof ApiGetEndpointParams<Api, Endpoint>
>(api: Api, endpointName: Endpoint, paramName: Param): ApiGetEndpointParamSchema<Api, Endpoint, Param> {
  const endpoint = apiGetEndpoint(api, endpointName);
  return apiGetSchemaOf(endpoint.params?.[paramName]) as any;
}

export function apiGetEndpointParamSchemaByPath<
  Api extends ApiSpec,
  Method extends ApiMethod,
  Path extends ApiGetPathsByMethod<Api, Method>,
  Param extends keyof ApiGetEndpointParamsByPath<Api, Method, Path>
>(api: Api, method: Method, path: Path, paramName: Param): ApiGetEndpointParamSchemaByPath<Api, Method, Path, Param> {
  const endpoint = apiGetEndpointByPath(api, method, path);
  return apiGetSchemaOf(endpoint.params?.[paramName]) as any;
}

export function apiGetEndpointQueries<Api extends ApiSpec, Endpoint extends keyof Api["endpoints"]>(
  api: Api,
  endpointName: Endpoint
): ApiGetEndpointQueries<Api, Endpoint> {
  const endpoint = apiGetEndpoint(api, endpointName);
  return endpoint.query as any;
}

export function apiGetEndpointQueriesByPath<
  Api extends ApiSpec,
  Method extends ApiMethod,
  Path extends ApiGetPathsByMethod<Api, Method>
>(api: Api, method: Method, path: Path): ApiGetEndpointQueriesByPath<Api, Method, Path> {
  const endpoint = apiGetEndpointByPath(api, method, path);
  return endpoint.query as any;
}

export function apiGetEndpointQuery<
  Api extends ApiSpec,
  Endpoint extends keyof Api["endpoints"],
  Query extends keyof ApiGetEndpointQueries<Api, Endpoint>
>(api: Api, endpointName: Endpoint, queryName: Query): ApiGetEndpointQuery<Api, Endpoint, Query> {
  const endpoint = apiGetEndpoint(api, endpointName);
  return endpoint.query?.[queryName] as any;
}

export function apiGetEndpointQueryByPath<
  Api extends ApiSpec,
  Method extends ApiMethod,
  Path extends ApiGetPathsByMethod<Api, Method>,
  Query extends keyof ApiGetEndpointQueriesByPath<Api, Method, Path>
>(api: Api, method: Method, path: Path, queryName: Query): ApiGetEndpointQueryByPath<Api, Method, Path, Query> {
  const endpoint = apiGetEndpointByPath(api, method, path);
  return endpoint.query?.[queryName] as any;
}

export function apiGetEndpointQuerySchema<
  Api extends ApiSpec,
  Endpoint extends keyof Api["endpoints"],
  Query extends keyof ApiGetEndpointQueries<Api, Endpoint>
>(api: Api, endpointName: Endpoint, queryName: Query): ApiGetEndpointQuerySchema<Api, Endpoint, Query> {
  const endpoint = apiGetEndpoint(api, endpointName);
  return apiGetSchemaOf(endpoint.query?.[queryName]) as any;
}

export function apiGetEndpointQuerySchemaByPath<
  Api extends ApiSpec,
  Method extends ApiMethod,
  Path extends ApiGetPathsByMethod<Api, Method>,
  Query extends keyof ApiGetEndpointQueriesByPath<Api, Method, Path>
>(api: Api, method: Method, path: Path, queryName: Query): ApiGetEndpointQuerySchemaByPath<Api, Method, Path, Query> {
  const endpoint = apiGetEndpointByPath(api, method, path);
  return apiGetSchemaOf(endpoint.query?.[queryName]) as any;
}

export function apiGetEndpointHeaders<Api extends ApiSpec, Endpoint extends keyof Api["endpoints"]>(
  api: Api,
  endpointName: Endpoint
): ApiGetEndpointHeaders<Api, Endpoint> {
  const endpoint = apiGetEndpoint(api, endpointName);
  return endpoint.headers as any;
}

export function apiGetEndpointHeadersByPath<
  Api extends ApiSpec,
  Method extends ApiMethod,
  Path extends ApiGetPathsByMethod<Api, Method>
>(api: Api, method: Method, path: Path): ApiGetEndpointHeadersByPath<Api, Method, Path> {
  const endpoint = apiGetEndpointByPath(api, method, path);
  return endpoint.headers as any;
}

export function apiGetEndpointHeader<
  Api extends ApiSpec,
  Endpoint extends keyof Api["endpoints"],
  Header extends keyof ApiGetEndpointHeaders<Api, Endpoint>
>(api: Api, endpointName: Endpoint, headerName: Header): ApiGetEndpointHeader<Api, Endpoint, Header> {
  const endpoint = apiGetEndpoint(api, endpointName);
  return endpoint.headers?.[headerName] as any;
}

export function apiGetEndpointHeaderByPath<
  Api extends ApiSpec,
  Method extends ApiMethod,
  Path extends ApiGetPathsByMethod<Api, Method>,
  Header extends keyof ApiGetEndpointHeadersByPath<Api, Method, Path>
>(api: Api, method: Method, path: Path, headerName: Header): ApiGetEndpointHeaderByPath<Api, Method, Path, Header> {
  const endpoint = apiGetEndpointByPath(api, method, path);
  return endpoint.headers?.[headerName] as any;
}

export function apiGetEndpointHeaderSchema<
  Api extends ApiSpec,
  Endpoint extends keyof Api["endpoints"],
  Header extends keyof ApiGetEndpointHeaders<Api, Endpoint>
>(api: Api, endpointName: Endpoint, headerName: Header): ApiGetEndpointHeaderSchema<Api, Endpoint, Header> {
  const endpoint = apiGetEndpoint(api, endpointName);
  return apiGetSchemaOf(endpoint.headers?.[headerName]) as any;
}

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

export function apiGetEndpointCookies<Api extends ApiSpec, Endpoint extends keyof Api["endpoints"]>(
  api: Api,
  endpointName: Endpoint
): ApiGetEndpointCookies<Api, Endpoint> {
  const endpoint = apiGetEndpoint(api, endpointName);
  return endpoint.cookies as any;
}

export function apiGetEndpointCookiesByPath<
  Api extends ApiSpec,
  Method extends ApiMethod,
  Path extends ApiGetPathsByMethod<Api, Method>
>(api: Api, method: Method, path: Path): ApiGetEndpointCookiesByPath<Api, Method, Path> {
  const endpoint = apiGetEndpointByPath(api, method, path);
  return endpoint.cookies as any;
}

export function apiGetEndpointCookie<
  Api extends ApiSpec,
  Endpoint extends keyof Api["endpoints"],
  Cookie extends keyof ApiGetEndpointCookies<Api, Endpoint>
>(api: Api, endpointName: Endpoint, cookieName: Cookie): ApiGetEndpointCookie<Api, Endpoint, Cookie> {
  const endpoint = apiGetEndpoint(api, endpointName);
  return endpoint.cookies?.[cookieName] as any;
}

export function apiGetEndpointCookieByPath<
  Api extends ApiSpec,
  Method extends ApiMethod,
  Path extends ApiGetPathsByMethod<Api, Method>,
  Cookie extends keyof ApiGetEndpointCookiesByPath<Api, Method, Path>
>(api: Api, method: Method, path: Path, cookieName: Cookie): ApiGetEndpointCookieByPath<Api, Method, Path, Cookie> {
  const endpoint = apiGetEndpointByPath(api, method, path);
  return endpoint.cookies?.[cookieName] as any;
}

export function apiGetEndpointCookieSchema<
  Api extends ApiSpec,
  Endpoint extends keyof Api["endpoints"],
  Cookie extends keyof ApiGetEndpointCookies<Api, Endpoint>
>(api: Api, endpointName: Endpoint, cookieName: Cookie): ApiGetEndpointCookieSchema<Api, Endpoint, Cookie> {
  const endpoint = apiGetEndpoint(api, endpointName);
  return apiGetSchemaOf(endpoint.cookies?.[cookieName]) as any;
}

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

export function apiGetEndpointResponses<Api extends ApiSpec, Endpoint extends keyof Api["endpoints"]>(
  api: Api,
  endpointName: Endpoint
): ApiGetEndpointResponses<Api, Endpoint> {
  const endpoint = apiGetEndpoint(api, endpointName);
  return endpoint.responses as any;
}

export function apiGetEndpointResponsesByPath<
  Api extends ApiSpec,
  Method extends ApiMethod,
  Path extends ApiGetPathsByMethod<Api, Method>
>(api: Api, method: Method, path: Path): ApiGetEndpointResponsesByPath<Api, Method, Path> {
  const endpoint = apiGetEndpointByPath(api, method, path);
  return endpoint.responses as any;
}

export function apiGetEndpointResponse<
  Api extends ApiSpec,
  Endpoint extends keyof Api["endpoints"],
  StatusCode extends keyof ApiGetEndpointResponses<Api, Endpoint>
>(api: Api, endpointName: Endpoint, statusCode: StatusCode): ApiGetEndpointResponse<Api, Endpoint, StatusCode> {
  const endpoint = apiGetEndpoint(api, endpointName);
  return endpoint.responses?.[statusCode] as any;
}

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

export function apiGetEndpointResponseSchema<
  Api extends ApiSpec,
  Endpoint extends keyof Api["endpoints"],
  StatusCode extends keyof ApiGetEndpointResponses<Api, Endpoint>
>(api: Api, endpointName: Endpoint, statusCode: StatusCode): ApiGetEndpointResponseSchema<Api, Endpoint, StatusCode> {
  const endpoint = apiGetEndpoint(api, endpointName);
  return apiGetSchemaOf(endpoint.responses?.[statusCode]) as any;
}

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
