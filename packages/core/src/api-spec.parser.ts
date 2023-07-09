import type { ApiMethod, ApiSpec } from "./api-spec.types";
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
} from "./endpoint-utilities.types";

function getSchemaOf(value: any): unknown {
  if (value && "schema" in value) {
    if ("validate" in (value.schema as any)) {
      return value;
    }
    return value.schema;
  }
  return value;
}

export function apiSpecGetEndpoint<Api extends ApiSpec, Endpoint extends keyof Api["endpoints"]>(
  api: Api,
  endpointName: Endpoint
): ApiGetEndpoint<Api, Endpoint> {
  return api.endpoints[endpointName as string] as any;
}

export function apiSpecGetEndpointByPath<
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

export function apiSpecGetEndpointBody<Api extends ApiSpec, Endpoint extends keyof Api["endpoints"]>(
  api: Api,
  endpointName: Endpoint
): ApiGetEndpointBody<Api, Endpoint> {
  const endpoint = apiSpecGetEndpoint(api, endpointName);
  return endpoint.body as any;
}

export function apiSpecGetEndpointBodyByPath<
  Api extends ApiSpec,
  Method extends ApiMethod,
  Path extends ApiGetPathsByMethod<Api, Method>
>(api: Api, method: Method, path: Path): ApiGetEndpointBodyByPath<Api, Method, Path> {
  const endpoint = apiSpecGetEndpointByPath(api, method, path);
  return endpoint.body as any;
}

export function apiSpecGetEndpointBodySchema<Api extends ApiSpec, Endpoint extends keyof Api["endpoints"]>(
  api: Api,
  endpointName: Endpoint
): ApiGetEndpointBodySchema<Api, Endpoint> {
  const endpoint = apiSpecGetEndpoint(api, endpointName);
  return getSchemaOf(endpoint.body) as any;
}

export function apiSpecGetEndpointBodySchemaByPath<
  Api extends ApiSpec,
  Method extends ApiMethod,
  Path extends ApiGetPathsByMethod<Api, Method>
>(api: Api, method: Method, path: Path): ApiGetEndpointBodySchemaByPath<Api, Method, Path> {
  const endpoint = apiSpecGetEndpointByPath(api, method, path);
  return getSchemaOf(endpoint.body) as any;
}

export function apiSpecGetEndpointParams<Api extends ApiSpec, Endpoint extends keyof Api["endpoints"]>(
  api: Api,
  endpointName: Endpoint
): ApiGetEndpointParams<Api, Endpoint> {
  const endpoint = apiSpecGetEndpoint(api, endpointName);
  return endpoint.params as any;
}

export function apiSpecGetEndpointParamsByPath<
  Api extends ApiSpec,
  Method extends ApiMethod,
  Path extends ApiGetPathsByMethod<Api, Method>
>(api: Api, method: Method, path: Path): ApiGetEndpointParamsByPath<Api, Method, Path> {
  const endpoint = apiSpecGetEndpointByPath(api, method, path);
  return endpoint.params as any;
}

export function apiSpecGetEndpointParam<
  Api extends ApiSpec,
  Endpoint extends keyof Api["endpoints"],
  Param extends keyof ApiGetEndpointParams<Api, Endpoint>
>(api: Api, endpointName: Endpoint, paramName: Param): ApiGetEndpointParam<Api, Endpoint, Param> {
  const endpoint = apiSpecGetEndpoint(api, endpointName);
  return endpoint.params?.[paramName] as any;
}

export function apiSpecGetEndpointParamByPath<
  Api extends ApiSpec,
  Method extends ApiMethod,
  Path extends ApiGetPathsByMethod<Api, Method>,
  Param extends keyof ApiGetEndpointParamsByPath<Api, Method, Path>
>(api: Api, method: Method, path: Path, paramName: Param): ApiGetEndpointParamByPath<Api, Method, Path, Param> {
  const endpoint = apiSpecGetEndpointByPath(api, method, path);
  return endpoint.params?.[paramName] as any;
}

export function apiSpecGetEndpointParamSchema<
  Api extends ApiSpec,
  Endpoint extends keyof Api["endpoints"],
  Param extends keyof ApiGetEndpointParams<Api, Endpoint>
>(api: Api, endpointName: Endpoint, paramName: Param): ApiGetEndpointParamSchema<Api, Endpoint, Param> {
  const endpoint = apiSpecGetEndpoint(api, endpointName);
  return getSchemaOf(endpoint.params?.[paramName]) as any;
}

export function apiSpecGetEndpointParamSchemaByPath<
  Api extends ApiSpec,
  Method extends ApiMethod,
  Path extends ApiGetPathsByMethod<Api, Method>,
  Param extends keyof ApiGetEndpointParamsByPath<Api, Method, Path>
>(api: Api, method: Method, path: Path, paramName: Param): ApiGetEndpointParamSchemaByPath<Api, Method, Path, Param> {
  const endpoint = apiSpecGetEndpointByPath(api, method, path);
  return getSchemaOf(endpoint.params?.[paramName]) as any;
}

export function apiSpecGetEndpointQueries<Api extends ApiSpec, Endpoint extends keyof Api["endpoints"]>(
  api: Api,
  endpointName: Endpoint
): ApiGetEndpointQueries<Api, Endpoint> {
  const endpoint = apiSpecGetEndpoint(api, endpointName);
  return endpoint.query as any;
}

export function apiSpecGetEndpointQueriesByPath<
  Api extends ApiSpec,
  Method extends ApiMethod,
  Path extends ApiGetPathsByMethod<Api, Method>
>(api: Api, method: Method, path: Path): ApiGetEndpointQueriesByPath<Api, Method, Path> {
  const endpoint = apiSpecGetEndpointByPath(api, method, path);
  return endpoint.query as any;
}

export function apiSpecGetEndpointQuery<
  Api extends ApiSpec,
  Endpoint extends keyof Api["endpoints"],
  Query extends keyof ApiGetEndpointQueries<Api, Endpoint>
>(api: Api, endpointName: Endpoint, queryName: Query): ApiGetEndpointQuery<Api, Endpoint, Query> {
  const endpoint = apiSpecGetEndpoint(api, endpointName);
  return endpoint.query?.[queryName] as any;
}

export function apiSpecGetEndpointQueryByPath<
  Api extends ApiSpec,
  Method extends ApiMethod,
  Path extends ApiGetPathsByMethod<Api, Method>,
  Query extends keyof ApiGetEndpointQueriesByPath<Api, Method, Path>
>(api: Api, method: Method, path: Path, queryName: Query): ApiGetEndpointQueryByPath<Api, Method, Path, Query> {
  const endpoint = apiSpecGetEndpointByPath(api, method, path);
  return endpoint.query?.[queryName] as any;
}

export function apiSpecGetEndpointQuerySchema<
  Api extends ApiSpec,
  Endpoint extends keyof Api["endpoints"],
  Query extends keyof ApiGetEndpointQueries<Api, Endpoint>
>(api: Api, endpointName: Endpoint, queryName: Query): ApiGetEndpointQuerySchema<Api, Endpoint, Query> {
  const endpoint = apiSpecGetEndpoint(api, endpointName);
  return getSchemaOf(endpoint.query?.[queryName]) as any;
}

export function apiSpecGetEndpointQuerySchemaByPath<
  Api extends ApiSpec,
  Method extends ApiMethod,
  Path extends ApiGetPathsByMethod<Api, Method>,
  Query extends keyof ApiGetEndpointQueriesByPath<Api, Method, Path>
>(api: Api, method: Method, path: Path, queryName: Query): ApiGetEndpointQuerySchemaByPath<Api, Method, Path, Query> {
  const endpoint = apiSpecGetEndpointByPath(api, method, path);
  return getSchemaOf(endpoint.query?.[queryName]) as any;
}

export function apiSpecGetEndpointHeaders<Api extends ApiSpec, Endpoint extends keyof Api["endpoints"]>(
  api: Api,
  endpointName: Endpoint
): ApiGetEndpointHeaders<Api, Endpoint> {
  const endpoint = apiSpecGetEndpoint(api, endpointName);
  return endpoint.headers as any;
}

export function apiSpecGetEndpointHeadersByPath<
  Api extends ApiSpec,
  Method extends ApiMethod,
  Path extends ApiGetPathsByMethod<Api, Method>
>(api: Api, method: Method, path: Path): ApiGetEndpointHeadersByPath<Api, Method, Path> {
  const endpoint = apiSpecGetEndpointByPath(api, method, path);
  return endpoint.headers as any;
}

export function apiSpecGetEndpointHeader<
  Api extends ApiSpec,
  Endpoint extends keyof Api["endpoints"],
  Header extends keyof ApiGetEndpointHeaders<Api, Endpoint>
>(api: Api, endpointName: Endpoint, headerName: Header): ApiGetEndpointHeader<Api, Endpoint, Header> {
  const endpoint = apiSpecGetEndpoint(api, endpointName);
  return endpoint.headers?.[headerName] as any;
}

export function apiSpecGetEndpointHeaderByPath<
  Api extends ApiSpec,
  Method extends ApiMethod,
  Path extends ApiGetPathsByMethod<Api, Method>,
  Header extends keyof ApiGetEndpointHeadersByPath<Api, Method, Path>
>(api: Api, method: Method, path: Path, headerName: Header): ApiGetEndpointHeaderByPath<Api, Method, Path, Header> {
  const endpoint = apiSpecGetEndpointByPath(api, method, path);
  return endpoint.headers?.[headerName] as any;
}

export function apiSpecGetEndpointHeaderSchema<
  Api extends ApiSpec,
  Endpoint extends keyof Api["endpoints"],
  Header extends keyof ApiGetEndpointHeaders<Api, Endpoint>
>(api: Api, endpointName: Endpoint, headerName: Header): ApiGetEndpointHeaderSchema<Api, Endpoint, Header> {
  const endpoint = apiSpecGetEndpoint(api, endpointName);
  return getSchemaOf(endpoint.headers?.[headerName]) as any;
}

export function apiSpecGetEndpointHeaderSchemaByPath<
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
  const endpoint = apiSpecGetEndpointByPath(api, method, path);
  return getSchemaOf(endpoint.headers?.[headerName]) as any;
}

export function apiSpecGetEndpointCookies<Api extends ApiSpec, Endpoint extends keyof Api["endpoints"]>(
  api: Api,
  endpointName: Endpoint
): ApiGetEndpointCookies<Api, Endpoint> {
  const endpoint = apiSpecGetEndpoint(api, endpointName);
  return endpoint.cookies as any;
}

export function apiSpecGetEndpointCookiesByPath<
  Api extends ApiSpec,
  Method extends ApiMethod,
  Path extends ApiGetPathsByMethod<Api, Method>
>(api: Api, method: Method, path: Path): ApiGetEndpointCookiesByPath<Api, Method, Path> {
  const endpoint = apiSpecGetEndpointByPath(api, method, path);
  return endpoint.cookies as any;
}

export function apiSpecGetEndpointCookie<
  Api extends ApiSpec,
  Endpoint extends keyof Api["endpoints"],
  Cookie extends keyof ApiGetEndpointCookies<Api, Endpoint>
>(api: Api, endpointName: Endpoint, cookieName: Cookie): ApiGetEndpointCookie<Api, Endpoint, Cookie> {
  const endpoint = apiSpecGetEndpoint(api, endpointName);
  return endpoint.cookies?.[cookieName] as any;
}

export function apiSpecGetEndpointCookieByPath<
  Api extends ApiSpec,
  Method extends ApiMethod,
  Path extends ApiGetPathsByMethod<Api, Method>,
  Cookie extends keyof ApiGetEndpointCookiesByPath<Api, Method, Path>
>(api: Api, method: Method, path: Path, cookieName: Cookie): ApiGetEndpointCookieByPath<Api, Method, Path, Cookie> {
  const endpoint = apiSpecGetEndpointByPath(api, method, path);
  return endpoint.cookies?.[cookieName] as any;
}

export function apiSpecGetEndpointCookieSchema<
  Api extends ApiSpec,
  Endpoint extends keyof Api["endpoints"],
  Cookie extends keyof ApiGetEndpointCookies<Api, Endpoint>
>(api: Api, endpointName: Endpoint, cookieName: Cookie): ApiGetEndpointCookieSchema<Api, Endpoint, Cookie> {
  const endpoint = apiSpecGetEndpoint(api, endpointName);
  return getSchemaOf(endpoint.cookies?.[cookieName]) as any;
}

export function apiSpecGetEndpointCookieSchemaByPath<
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
  const endpoint = apiSpecGetEndpointByPath(api, method, path);
  return getSchemaOf(endpoint.cookies?.[cookieName]) as any;
}

export function apiGetEndpointResponses<Api extends ApiSpec, Endpoint extends keyof Api["endpoints"]>(
  api: Api,
  endpointName: Endpoint
): ApiGetEndpointResponses<Api, Endpoint> {
  const endpoint = apiSpecGetEndpoint(api, endpointName);
  return endpoint.responses as any;
}

export function apiGetEndpointResponsesByPath<
  Api extends ApiSpec,
  Method extends ApiMethod,
  Path extends ApiGetPathsByMethod<Api, Method>
>(api: Api, method: Method, path: Path): ApiGetEndpointResponsesByPath<Api, Method, Path> {
  const endpoint = apiSpecGetEndpointByPath(api, method, path);
  return endpoint.responses as any;
}

export function apiGetEndpointResponse<
  Api extends ApiSpec,
  Endpoint extends keyof Api["endpoints"],
  StatusCode extends keyof ApiGetEndpointResponses<Api, Endpoint>
>(api: Api, endpointName: Endpoint, statusCode: StatusCode): ApiGetEndpointResponse<Api, Endpoint, StatusCode> {
  const endpoint = apiSpecGetEndpoint(api, endpointName);
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
  const endpoint = apiSpecGetEndpointByPath(api, method, path);
  return endpoint.responses?.[statusCode] as any;
}

export function apiGetEndpointResponseSchema<
  Api extends ApiSpec,
  Endpoint extends keyof Api["endpoints"],
  StatusCode extends keyof ApiGetEndpointResponses<Api, Endpoint>
>(api: Api, endpointName: Endpoint, statusCode: StatusCode): ApiGetEndpointResponseSchema<Api, Endpoint, StatusCode> {
  const endpoint = apiSpecGetEndpoint(api, endpointName);
  return getSchemaOf(endpoint.responses?.[statusCode]) as any;
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
  const endpoint = apiSpecGetEndpointByPath(api, method, path);
  return getSchemaOf(endpoint.responses?.[statusCode]) as any;
}
