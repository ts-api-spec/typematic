import type { ApiSpec, ApiMethod, ApiDataParameter, ApiParameter } from "./api-spec.types";

export type ApiGetEndpoint<Api extends ApiSpec, Endpoint extends keyof Api["endpoints"]> = Api["endpoints"][Endpoint];

type ApiGetPathsByMethod<Api extends ApiSpec, Method extends ApiMethod> = {
  [Endpoint in keyof Api["endpoints"]]: ApiGetEndpoint<Api, Endpoint>["method"] extends
    | Lowercase<Method>
    | Uppercase<Method>
    ? ApiGetEndpoint<Api, Endpoint>["path"]
    : never;
}[keyof Api["endpoints"]];

export type ApiGetEndpointByPath<
  Api extends ApiSpec,
  Method extends ApiMethod,
  Path extends ApiGetPathsByMethod<Api, Method>
> = {
  [Endpoint in keyof Api["endpoints"]]: Lowercase<ApiGetEndpoint<Api, Endpoint>["method"]> extends Lowercase<Method>
    ? ApiGetEndpoint<Api, Endpoint>["path"] extends Path
      ? ApiGetEndpoint<Api, Endpoint>
      : never
    : never;
}[keyof Api["endpoints"]];

export type ApiGetEndpointParams<Api extends ApiSpec, Endpoint extends keyof Api["endpoints"]> = ApiGetEndpoint<
  Api,
  Endpoint
>["params"];

export type ApiGetEndpointParamsByPath<
  Api extends ApiSpec,
  Method extends ApiMethod,
  Path extends ApiGetPathsByMethod<Api, Method>
> = ApiGetEndpointByPath<Api, Method, Path>["params"];

export type ApiGetEndpointParam<
  Api extends ApiSpec,
  Endpoint extends keyof Api["endpoints"],
  Param extends keyof ApiGetEndpoint<Api, Endpoint>["params"]
> = ApiGetEndpoint<Api, Endpoint>["params"][Param];

export type ApiGetEndpointParamByPath<
  Api extends ApiSpec,
  Method extends ApiMethod,
  Path extends ApiGetPathsByMethod<Api, Method>,
  Param extends keyof ApiGetEndpointParamsByPath<Api, Method, Path>
> = ApiGetEndpointParamsByPath<Api, Method, Path>[Param];

export type ApiGetEndpointParamSchema<
  Api extends ApiSpec,
  Endpoint extends keyof Api["endpoints"],
  Param extends keyof ApiGetEndpoint<Api, Endpoint>["params"]
> = ApiGetEndpointParam<Api, Endpoint, Param> extends ApiParameter
  ? ApiGetEndpointParam<Api, Endpoint, Param>["schema"]
  : never;

export type ApiGetEndpointParamSchemaByPath<
  Api extends ApiSpec,
  Method extends ApiMethod,
  Path extends ApiGetPathsByMethod<Api, Method>,
  Param extends keyof ApiGetEndpointParamsByPath<Api, Method, Path>
> = ApiGetEndpointParamByPath<Api, Method, Path, Param> extends ApiParameter
  ? ApiGetEndpointParamByPath<Api, Method, Path, Param>["schema"]
  : never;

export type ApiGetEndpointQueries<Api extends ApiSpec, Endpoint extends keyof Api["endpoints"]> = ApiGetEndpoint<
  Api,
  Endpoint
>["query"];

export type ApiGetEndpointQueriesByPath<
  Api extends ApiSpec,
  Method extends ApiMethod,
  Path extends ApiGetPathsByMethod<Api, Method>
> = ApiGetEndpointByPath<Api, Method, Path>["query"];

export type ApiGetEndpointQuery<
  Api extends ApiSpec,
  Endpoint extends keyof Api["endpoints"],
  Query extends keyof ApiGetEndpoint<Api, Endpoint>["query"]
> = ApiGetEndpoint<Api, Endpoint>["query"][Query];

export type ApiGetEndpointQueryByPath<
  Api extends ApiSpec,
  Method extends ApiMethod,
  Path extends ApiGetPathsByMethod<Api, Method>,
  Query extends keyof ApiGetEndpointQueriesByPath<Api, Method, Path>
> = ApiGetEndpointQueriesByPath<Api, Method, Path>[Query];

export type ApiGetEndpointQuerySchema<
  Api extends ApiSpec,
  Endpoint extends keyof Api["endpoints"],
  Query extends keyof ApiGetEndpoint<Api, Endpoint>["query"]
> = ApiGetEndpointQuery<Api, Endpoint, Query> extends ApiParameter
  ? ApiGetEndpointQuery<Api, Endpoint, Query>["schema"]
  : never;

export type ApiGetEndpointQuerySchemaByPath<
  Api extends ApiSpec,
  Method extends ApiMethod,
  Path extends ApiGetPathsByMethod<Api, Method>,
  Query extends keyof ApiGetEndpointQueriesByPath<Api, Method, Path>
> = ApiGetEndpointQueryByPath<Api, Method, Path, Query> extends ApiParameter
  ? ApiGetEndpointQueryByPath<Api, Method, Path, Query>["schema"]
  : never;

export type ApiGetEndpointHeaders<Api extends ApiSpec, Endpoint extends keyof Api["endpoints"]> = ApiGetEndpoint<
  Api,
  Endpoint
>["headers"];

export type ApiGetEndpointHeadersByPath<
  Api extends ApiSpec,
  Method extends ApiMethod,
  Path extends ApiGetPathsByMethod<Api, Method>
> = ApiGetEndpointByPath<Api, Method, Path>["headers"];

export type ApiGetEndpointHeader<
  Api extends ApiSpec,
  Endpoint extends keyof Api["endpoints"],
  Header extends keyof ApiGetEndpoint<Api, Endpoint>["headers"]
> = ApiGetEndpoint<Api, Endpoint>["headers"][Header];

export type ApiGetEndpointHeaderByPath<
  Api extends ApiSpec,
  Method extends ApiMethod,
  Path extends ApiGetPathsByMethod<Api, Method>,
  Header extends keyof ApiGetEndpointHeadersByPath<Api, Method, Path>
> = ApiGetEndpointHeadersByPath<Api, Method, Path>[Header];

export type ApiGetEndpointHeaderSchema<
  Api extends ApiSpec,
  Endpoint extends keyof Api["endpoints"],
  Header extends keyof ApiGetEndpoint<Api, Endpoint>["headers"]
> = ApiGetEndpointHeader<Api, Endpoint, Header> extends ApiParameter
  ? ApiGetEndpointHeader<Api, Endpoint, Header>["schema"]
  : never;

export type ApiGetEndpointHeaderSchemaByPath<
  Api extends ApiSpec,
  Method extends ApiMethod,
  Path extends ApiGetPathsByMethod<Api, Method>,
  Header extends keyof ApiGetEndpointHeadersByPath<Api, Method, Path>
> = ApiGetEndpointHeaderByPath<Api, Method, Path, Header> extends ApiParameter
  ? ApiGetEndpointHeaderByPath<Api, Method, Path, Header>["schema"]
  : never;

export type ApiGetEndpointCookies<Api extends ApiSpec, Endpoint extends keyof Api["endpoints"]> = ApiGetEndpoint<
  Api,
  Endpoint
>["cookies"];

export type ApiGetEndpointCookiesByPath<
  Api extends ApiSpec,
  Method extends ApiMethod,
  Path extends ApiGetPathsByMethod<Api, Method>
> = ApiGetEndpointByPath<Api, Method, Path>["cookies"];

export type ApiGetEndpointCookie<
  Api extends ApiSpec,
  Endpoint extends keyof Api["endpoints"],
  Cookie extends keyof ApiGetEndpoint<Api, Endpoint>["cookies"]
> = ApiGetEndpoint<Api, Endpoint>["cookies"][Cookie];

export type ApiGetEndpointCookieByPath<
  Api extends ApiSpec,
  Method extends ApiMethod,
  Path extends ApiGetPathsByMethod<Api, Method>,
  Cookie extends keyof ApiGetEndpointCookiesByPath<Api, Method, Path>
> = ApiGetEndpointCookiesByPath<Api, Method, Path>[Cookie];

export type ApiGetEndpointCookieSchema<
  Api extends ApiSpec,
  Endpoint extends keyof Api["endpoints"],
  Cookie extends keyof ApiGetEndpoint<Api, Endpoint>["cookies"]
> = ApiGetEndpointCookie<Api, Endpoint, Cookie> extends ApiParameter
  ? ApiGetEndpointCookie<Api, Endpoint, Cookie>["schema"]
  : never;

export type ApiGetEndpointResponses<Api extends ApiSpec, Endpoint extends keyof Api["endpoints"]> = ApiGetEndpoint<
  Api,
  Endpoint
>["responses"];

export type ApiGetEndpointResponsesByPath<
  Api extends ApiSpec,
  Method extends ApiMethod,
  Path extends ApiGetPathsByMethod<Api, Method>
> = ApiGetEndpointByPath<Api, Method, Path>["responses"];

export type ApiGetEndpointResponse<
  Api extends ApiSpec,
  Endpoint extends keyof Api["endpoints"],
  StatusCode extends keyof ApiGetEndpoint<Api, Endpoint>["responses"]
> = ApiGetEndpoint<Api, Endpoint>["responses"][StatusCode];

export type ApiGetEndpointResponseByPath<
  Api extends ApiSpec,
  Method extends ApiMethod,
  Path extends ApiGetPathsByMethod<Api, Method>,
  StatusCode extends keyof ApiGetEndpointResponsesByPath<Api, Method, Path>
> = ApiGetEndpointResponsesByPath<Api, Method, Path>[StatusCode];

export type ApiGetEndpointResponseSchema<
  Api extends ApiSpec,
  Endpoint extends keyof Api["endpoints"],
  StatusCode extends keyof ApiGetEndpoint<Api, Endpoint>["responses"]
> = ApiGetEndpointResponse<Api, Endpoint, StatusCode> extends ApiDataParameter
  ? ApiGetEndpointResponse<Api, Endpoint, StatusCode>["schema"]
  : never;

export type ApiGetEndpointResponseSchemaByPath<
  Api extends ApiSpec,
  Method extends ApiMethod,
  Path extends ApiGetPathsByMethod<Api, Method>,
  StatusCode extends keyof ApiGetEndpointResponsesByPath<Api, Method, Path>
> = ApiGetEndpointResponseByPath<Api, Method, Path, StatusCode> extends ApiDataParameter
  ? ApiGetEndpointResponseByPath<Api, Method, Path, StatusCode>["schema"]
  : never;

export type ApiGetEndpointBody<Api extends ApiSpec, Endpoint extends keyof Api["endpoints"]> = ApiGetEndpoint<
  Api,
  Endpoint
>["body"];

export type ApiGetEndpointBodyByPath<
  Api extends ApiSpec,
  Method extends ApiMethod,
  Path extends ApiGetPathsByMethod<Api, Method>
> = ApiGetEndpointByPath<Api, Method, Path>["body"];

export type ApiGetEndpointBodySchema<Api extends ApiSpec, Endpoint extends keyof Api["endpoints"]> = ApiGetEndpointBody<
  Api,
  Endpoint
> extends ApiDataParameter
  ? ApiGetEndpointBody<Api, Endpoint>["schema"]
  : never;

export type ApiGetEndpointBodySchemaByPath<
  Api extends ApiSpec,
  Method extends ApiMethod,
  Path extends ApiGetPathsByMethod<Api, Method>
> = ApiGetEndpointBodyByPath<Api, Method, Path> extends ApiDataParameter
  ? ApiGetEndpointBodyByPath<Api, Method, Path>["schema"]
  : never;
