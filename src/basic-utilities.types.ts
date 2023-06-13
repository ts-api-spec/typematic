import type { ApiSpec, ApiMethod, ApiDataParameter } from "./api-spec.types";

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
  [Endpoint in keyof Api["endpoints"]]: ApiGetEndpoint<Api, Endpoint>["method"] extends
    | Lowercase<Method>
    | Uppercase<Method>
    ? ApiGetEndpoint<Api, Endpoint>["path"] extends Path
      ? ApiGetEndpoint<Api, Endpoint>
      : never
    : never;
}[keyof Api["endpoints"]];

export type ApiGetEndpointBody<Api extends ApiSpec, Endpoint extends keyof Api["endpoints"]> = ApiGetEndpoint<
  Api,
  Endpoint
>["body"];

export type ApiGetEndpointParams<Api extends ApiSpec, Endpoint extends keyof Api["endpoints"]> = ApiGetEndpoint<
  Api,
  Endpoint
>["params"];

export type ApiGetEndpointParam<
  Api extends ApiSpec,
  Endpoint extends keyof Api["endpoints"],
  Param extends keyof ApiGetEndpoint<Api, Endpoint>["params"]
> = ApiGetEndpoint<Api, Endpoint>["params"][Param];

export type ApiGetEndpointQueries<Api extends ApiSpec, Endpoint extends keyof Api["endpoints"]> = ApiGetEndpoint<
  Api,
  Endpoint
>["query"];

export type ApiGetEndpointQuery<
  Api extends ApiSpec,
  Endpoint extends keyof Api["endpoints"],
  Query extends keyof ApiGetEndpoint<Api, Endpoint>["query"]
> = ApiGetEndpoint<Api, Endpoint>["query"][Query];

export type ApiGetEndpointHeaders<Api extends ApiSpec, Endpoint extends keyof Api["endpoints"]> = ApiGetEndpoint<
  Api,
  Endpoint
>["headers"];

export type ApiGetEndpointHeader<
  Api extends ApiSpec,
  Endpoint extends keyof Api["endpoints"],
  Header extends keyof ApiGetEndpoint<Api, Endpoint>["headers"]
> = ApiGetEndpoint<Api, Endpoint>["headers"][Header];

export type ApiGetEndpointCookies<Api extends ApiSpec, Endpoint extends keyof Api["endpoints"]> = ApiGetEndpoint<
  Api,
  Endpoint
>["cookies"];

export type ApiGetEndpointCookie<
  Api extends ApiSpec,
  Endpoint extends keyof Api["endpoints"],
  Cookie extends keyof ApiGetEndpoint<Api, Endpoint>["cookies"]
> = ApiGetEndpoint<Api, Endpoint>["cookies"][Cookie];

export type ApiGetEndpointResponses<Api extends ApiSpec, Endpoint extends keyof Api["endpoints"]> = ApiGetEndpoint<
  Api,
  Endpoint
>["responses"];

export type ApiGetEndpointResponse<
  Api extends ApiSpec,
  Endpoint extends keyof Api["endpoints"],
  StatusCode extends keyof ApiGetEndpoint<Api, Endpoint>["responses"]
> = ApiGetEndpoint<Api, Endpoint>["responses"][StatusCode];

export type ApiGetEndpointBodySchema<Api extends ApiSpec, Endpoint extends keyof Api["endpoints"]> = ApiGetEndpointBody<
  Api,
  Endpoint
> extends ApiDataParameter
  ? ApiGetEndpointBody<Api, Endpoint>["schema"]
  : never;
