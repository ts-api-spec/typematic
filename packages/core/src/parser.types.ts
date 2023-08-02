import type { ApiSpec, ApiMethod, ApiParameter } from "./types";
import type { Split, SplitMany } from "./utils.types";

/**
 * Generic schema type
 * used to detect if a schema intersects with ApiParameter type
 * because some libraries like superstruct use an internal schema property
 * that clashes with the ApiParameter type
 */
export type GenericSchema = { validate: (...arg: any) => any } | { parse: (...arg: any) => any };

/**
 * Get the schema of any request entry or response entry
 * @param T - Request entry or response entry
 * @returns Schema of the request entry or response entry
 */
export type ApiGetSchemaOf<T> = T extends ApiParameter ? (T extends GenericSchema ? T : T["schema"]) : T;

/**
 * List of all possible API Paths for an HTTP Method
 * @param Api - Api Spec
 * @param Method - HTTP Method
 * @returns List of all possible API Paths for the HTTP Method
 */
export type ApiGetPathsByMethod<Api extends ApiSpec, Method extends ApiMethod> = {
  [Endpoint in keyof Api["endpoints"]]: ApiGetEndpoint<Api, Endpoint>["method"] extends
  | Lowercase<Method>
  | Uppercase<Method>
  ? ApiGetEndpoint<Api, Endpoint>["path"]
  : never;
}[keyof Api["endpoints"]];

type PathSeparator = ["/", "?", "&", "#", "=", "(", ")", "[", "]", "<", ">", "%", "@"];

type FilterParams<Params, Acc extends string[] = []> = Params extends [infer First, ...infer Rest]
  ? First extends `:${infer Param}`
  ? FilterParams<Rest, [...Acc, ...Split<Param, ":">]>
  : FilterParams<Rest, Acc>
  : Acc;

/**
 * Extract Path Params from a path
 * @param Path - Path to extract params from
 * @returns Path params
 * @example
 * ```ts
 * type Path = "/users/:id/posts/:postId"
 * type PathParams = ApiPathToParams<Path>
 * // output: ["id", "postId"]
 * ```
 */
export type ApiPathToParams<Path extends string> = FilterParams<SplitMany<Path, PathSeparator>>;

/**
 * Get an endpoint type from an api spec using the endpoint name
 * @param Api - Api specification
 * @param Endpoint - Endpoint name
 * @returns Endpoint type
 */
export type ApiGetEndpoint<Api extends ApiSpec, Endpoint extends keyof Api["endpoints"]> = Api["endpoints"][Endpoint];

/**
 * Get an endpoint type from an api spec using the endpoint path
 * @param Api - Api specification
 * @param Method - HTTP method
 * @param Path - Endpoint path
 * @returns Endpoint type
 */
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

/**
 * Get all the expoint path parameters from an api spec using the endpoint name
 * @param Api - Api specification
 * @param Endpoint - Endpoint name
 * @returns All the endpoint path parameters
 */
export type ApiGetEndpointParams<Api extends ApiSpec, Endpoint extends keyof Api["endpoints"]> = ApiGetEndpoint<
  Api,
  Endpoint
>["params"];

/**
 * Get all the expoint path parameters from an api spec using the endpoint path
 * @param Api - Api specification
 * @param Method - HTTP method
 * @param Path - Endpoint path
 * @returns All the endpoint path parameters
 */
export type ApiGetEndpointParamsByPath<
  Api extends ApiSpec,
  Method extends ApiMethod,
  Path extends ApiGetPathsByMethod<Api, Method>
> = ApiGetEndpointByPath<Api, Method, Path>["params"];

/**
 * Get an endpoint path parameter from an api spec using the endpoint name and parameter name
 * @param Api - Api specification
 * @param Endpoint - Endpoint name
 * @param Param - Parameter name
 * @returns Endpoint path parameter
 */
export type ApiGetEndpointParam<
  Api extends ApiSpec,
  Endpoint extends keyof Api["endpoints"],
  Param extends keyof ApiGetEndpoint<Api, Endpoint>["params"]
> = ApiGetEndpoint<Api, Endpoint>["params"][Param];

/**
 * Get an endpoint path parameter from an api spec using the endpoint path and parameter name
 * @param Api - Api specification
 * @param Method - HTTP method
 * @param Path - Endpoint path
 * @param Param - Parameter name
 * @returns Endpoint path parameter
 */
export type ApiGetEndpointParamByPath<
  Api extends ApiSpec,
  Method extends ApiMethod,
  Path extends ApiGetPathsByMethod<Api, Method>,
  Param extends keyof ApiGetEndpointParamsByPath<Api, Method, Path>
> = ApiGetEndpointParamsByPath<Api, Method, Path>[Param];

/**
 * Get an endpoint path parameter schema from an api spec using the endpoint name and parameter name
 * @param Api - Api specification
 * @param Endpoint - Endpoint name
 * @param Param - Parameter name
 * @returns Endpoint path parameter schema
 */
export type ApiGetEndpointParamSchema<
  Api extends ApiSpec,
  Endpoint extends keyof Api["endpoints"],
  Param extends keyof ApiGetEndpoint<Api, Endpoint>["params"],
  $Param = ApiGetEndpointParam<Api, Endpoint, Param>
> = ApiGetSchemaOf<$Param>;

/**
 * Get an endpoint path parameter schema from an api spec using the endpoint path and parameter name
 * @param Api - Api specification
 * @param Method - HTTP method
 * @param Path - Endpoint path
 * @param Param - Parameter name
 * @returns Endpoint path parameter schema
 */
export type ApiGetEndpointParamSchemaByPath<
  Api extends ApiSpec,
  Method extends ApiMethod,
  Path extends ApiGetPathsByMethod<Api, Method>,
  Param extends keyof ApiGetEndpointParamsByPath<Api, Method, Path>,
  $Param = ApiGetEndpointParamByPath<Api, Method, Path, Param>
> = ApiGetSchemaOf<$Param>;

/**
 * Get all the endpoint query parameters from an api spec using the endpoint name
 * @param Api - Api specification
 * @param Endpoint - Endpoint name
 * @returns All the endpoint query parameters
 */
export type ApiGetEndpointQueries<Api extends ApiSpec, Endpoint extends keyof Api["endpoints"]> = ApiGetEndpoint<
  Api,
  Endpoint
>["query"];

/**
 * Get all the endpoint query parameters from an api spec using the endpoint path
 * @param Api - Api specification
 * @param Method - HTTP method
 * @param Path - Endpoint path
 * @returns All the endpoint query parameters
 */
export type ApiGetEndpointQueriesByPath<
  Api extends ApiSpec,
  Method extends ApiMethod,
  Path extends ApiGetPathsByMethod<Api, Method>
> = ApiGetEndpointByPath<Api, Method, Path>["query"];

/**
 * Get an endpoint query parameter from an api spec using the endpoint name and query parameter name
 * @param Api - Api specification
 * @param Endpoint - Endpoint name
 * @param Query - Query parameter name
 * @returns Endpoint query parameter
 */
export type ApiGetEndpointQuery<
  Api extends ApiSpec,
  Endpoint extends keyof Api["endpoints"],
  Query extends keyof ApiGetEndpoint<Api, Endpoint>["query"]
> = ApiGetEndpoint<Api, Endpoint>["query"][Query];

/**
 * Get an endpoint query parameter from an api spec using the endpoint path and query parameter name
 * @param Api - Api specification
 * @param Method - HTTP method
 * @param Path - Endpoint path
 * @param Query - Query parameter name
 * @returns Endpoint query parameter
 */
export type ApiGetEndpointQueryByPath<
  Api extends ApiSpec,
  Method extends ApiMethod,
  Path extends ApiGetPathsByMethod<Api, Method>,
  Query extends keyof ApiGetEndpointQueriesByPath<Api, Method, Path>
> = ApiGetEndpointQueriesByPath<Api, Method, Path>[Query];

/**
 * Get an endpoint query parameter schema from an api spec using the endpoint name and query parameter name
 * @param Api - Api specification
 * @param Endpoint - Endpoint name
 * @param Query - Query parameter name
 * @returns Endpoint query parameter schema
 */
export type ApiGetEndpointQuerySchema<
  Api extends ApiSpec,
  Endpoint extends keyof Api["endpoints"],
  Query extends keyof ApiGetEndpoint<Api, Endpoint>["query"],
  $Query = ApiGetEndpointQuery<Api, Endpoint, Query>
> = ApiGetSchemaOf<$Query>;

/**
 * Get an endpoint query parameter schema from an api spec using the endpoint path and query parameter name
 * @param Api - Api specification
 * @param Method - HTTP method
 * @param Path - Endpoint path
 * @param Query - Query parameter name
 * @returns Endpoint query parameter schema
 */
export type ApiGetEndpointQuerySchemaByPath<
  Api extends ApiSpec,
  Method extends ApiMethod,
  Path extends ApiGetPathsByMethod<Api, Method>,
  Query extends keyof ApiGetEndpointQueriesByPath<Api, Method, Path>,
  $Query = ApiGetEndpointQueryByPath<Api, Method, Path, Query>
> = ApiGetSchemaOf<$Query>;

/**
 * Get all the endpoint headers from an api spec using the endpoint name
 * @param Api - Api specification
 * @param Endpoint - Endpoint name
 * @returns All the endpoint headers
 */
export type ApiGetEndpointHeaders<Api extends ApiSpec, Endpoint extends keyof Api["endpoints"]> = ApiGetEndpoint<
  Api,
  Endpoint
>["headers"];

/**
 * Get all the endpoint headers from an api spec using the endpoint path
 * @param Api - Api specification
 * @param Method - HTTP method
 * @param Path - Endpoint path
 * @returns All the endpoint headers
 */
export type ApiGetEndpointHeadersByPath<
  Api extends ApiSpec,
  Method extends ApiMethod,
  Path extends ApiGetPathsByMethod<Api, Method>
> = ApiGetEndpointByPath<Api, Method, Path>["headers"];

/**
 * Get an endpoint header from an api spec using the endpoint name and header name
 * @param Api - Api specification
 * @param Endpoint - Endpoint name
 * @param Header - Header name
 * @returns Endpoint header
 */
export type ApiGetEndpointHeader<
  Api extends ApiSpec,
  Endpoint extends keyof Api["endpoints"],
  Header extends keyof ApiGetEndpoint<Api, Endpoint>["headers"]
> = ApiGetEndpoint<Api, Endpoint>["headers"][Header];

/**
 * Get an endpoint header from an api spec using the endpoint path and header name
 * @param Api - Api specification
 * @param Method - HTTP method
 * @param Path - Endpoint path
 * @param Header - Header name
 * @returns Endpoint header
 */
export type ApiGetEndpointHeaderByPath<
  Api extends ApiSpec,
  Method extends ApiMethod,
  Path extends ApiGetPathsByMethod<Api, Method>,
  Header extends keyof ApiGetEndpointHeadersByPath<Api, Method, Path>
> = ApiGetEndpointHeadersByPath<Api, Method, Path>[Header];

/**
 * Get an endpoint header schema from an api spec using the endpoint name and header name
 * @param Api - Api specification
 * @param Endpoint - Endpoint name
 * @param Header - Header name
 * @returns Endpoint header schema
 */
export type ApiGetEndpointHeaderSchema<
  Api extends ApiSpec,
  Endpoint extends keyof Api["endpoints"],
  Header extends keyof ApiGetEndpoint<Api, Endpoint>["headers"],
  $Header = ApiGetEndpointHeader<Api, Endpoint, Header>
> = ApiGetSchemaOf<$Header>;

/**
 * Get an endpoint header schema from an api spec using the endpoint path and header name
 * @param Api - Api specification
 * @param Method - HTTP method
 * @param Path - Endpoint path
 * @param Header - Header name
 * @returns Endpoint header schema
 */
export type ApiGetEndpointHeaderSchemaByPath<
  Api extends ApiSpec,
  Method extends ApiMethod,
  Path extends ApiGetPathsByMethod<Api, Method>,
  Header extends keyof ApiGetEndpointHeadersByPath<Api, Method, Path>,
  $Header = ApiGetEndpointHeaderByPath<Api, Method, Path, Header>
> = ApiGetSchemaOf<$Header>;

/**
 * Get all the endpoint cookies from an api spec using the endpoint name
 * @param Api - Api specification
 * @param Endpoint - Endpoint name
 * @returns All the endpoint cookies
 */
export type ApiGetEndpointCookies<Api extends ApiSpec, Endpoint extends keyof Api["endpoints"]> = ApiGetEndpoint<
  Api,
  Endpoint
>["cookies"];

/**
 * Get all the endpoint cookies from an api spec using the endpoint path
 * @param Api - Api specification
 * @param Method - HTTP method
 * @param Path - Endpoint path
 * @returns All the endpoint cookies
 */
export type ApiGetEndpointCookiesByPath<
  Api extends ApiSpec,
  Method extends ApiMethod,
  Path extends ApiGetPathsByMethod<Api, Method>
> = ApiGetEndpointByPath<Api, Method, Path>["cookies"];

/**
 * Get an endpoint cookie from an api spec using the endpoint name and cookie name
 * @param Api - Api specification
 * @param Endpoint - Endpoint name
 * @param Cookie - Cookie name
 * @returns Endpoint cookie
 */
export type ApiGetEndpointCookie<
  Api extends ApiSpec,
  Endpoint extends keyof Api["endpoints"],
  Cookie extends keyof ApiGetEndpoint<Api, Endpoint>["cookies"]
> = ApiGetEndpoint<Api, Endpoint>["cookies"][Cookie];

/**
 * Get an endpoint cookie from an api spec using the endpoint path and cookie name
 * @param Api - Api specification
 * @param Method - HTTP method
 * @param Path - Endpoint path
 * @param Cookie - Cookie name
 * @returns Endpoint cookie
 */
export type ApiGetEndpointCookieByPath<
  Api extends ApiSpec,
  Method extends ApiMethod,
  Path extends ApiGetPathsByMethod<Api, Method>,
  Cookie extends keyof ApiGetEndpointCookiesByPath<Api, Method, Path>
> = ApiGetEndpointCookiesByPath<Api, Method, Path>[Cookie];

/**
 * Get an endpoint cookie schema from an api spec using the endpoint name and cookie name
 * @param Api - Api specification
 * @param Endpoint - Endpoint name
 * @param Cookie - Cookie name
 * @returns Endpoint cookie schema
 */
export type ApiGetEndpointCookieSchema<
  Api extends ApiSpec,
  Endpoint extends keyof Api["endpoints"],
  Cookie extends keyof ApiGetEndpoint<Api, Endpoint>["cookies"],
  $Cookie = ApiGetEndpointCookie<Api, Endpoint, Cookie>
> = ApiGetSchemaOf<$Cookie>;

/**
 * Get an endpoint cookie schema from an api spec using the endpoint path and cookie name
 * @param Api - Api specification
 * @param Method - HTTP method
 * @param Path - Endpoint path
 * @param Cookie - Cookie name
 * @returns Endpoint cookie schema
 */
export type ApiGetEndpointCookieSchemaByPath<
  Api extends ApiSpec,
  Method extends ApiMethod,
  Path extends ApiGetPathsByMethod<Api, Method>,
  Cookie extends keyof ApiGetEndpointCookiesByPath<Api, Method, Path>,
  $Cookie = ApiGetEndpointCookieByPath<Api, Method, Path, Cookie>
> = ApiGetSchemaOf<$Cookie>;

/**
 * Get all the endpoint responses from an api spec using the endpoint name
 * @param Api - Api specification
 * @param Endpoint - Endpoint name
 * @returns All the endpoint responses
 */
export type ApiGetEndpointResponses<Api extends ApiSpec, Endpoint extends keyof Api["endpoints"]> = ApiGetEndpoint<
  Api,
  Endpoint
>["responses"];

/**
 * Get all the endpoint responses from an api spec using the endpoint path
 * @param Api - Api specification
 * @param Method - HTTP method
 * @param Path - Endpoint path
 * @returns All the endpoint responses
 */
export type ApiGetEndpointResponsesByPath<
  Api extends ApiSpec,
  Method extends ApiMethod,
  Path extends ApiGetPathsByMethod<Api, Method>
> = ApiGetEndpointByPath<Api, Method, Path>["responses"];

/**
 * Get an endpoint response from an api spec using the endpoint name and response status code
 * @param Api - Api specification
 * @param Endpoint - Endpoint name
 * @param StatusCode - Response status code
 * @returns Endpoint response
 */
export type ApiGetEndpointResponse<
  Api extends ApiSpec,
  Endpoint extends keyof Api["endpoints"],
  StatusCode extends keyof ApiGetEndpoint<Api, Endpoint>["responses"]
> = ApiGetEndpoint<Api, Endpoint>["responses"][StatusCode];

/**
 * Get an endpoint response from an api spec using the endpoint path and response status code
 * @param Api - Api specification
 * @param Method - HTTP method
 * @param Path - Endpoint path
 * @param StatusCode - Response status code
 * @returns Endpoint response
 */
export type ApiGetEndpointResponseByPath<
  Api extends ApiSpec,
  Method extends ApiMethod,
  Path extends ApiGetPathsByMethod<Api, Method>,
  StatusCode extends keyof ApiGetEndpointResponsesByPath<Api, Method, Path>
> = ApiGetEndpointResponsesByPath<Api, Method, Path>[StatusCode];

/**
 * Get an endpoint response schema from an api spec using the endpoint name and response status code
 * @param Api - Api specification
 * @param Endpoint - Endpoint name
 * @param StatusCode - Response status code
 * @returns Endpoint response schema
 */
export type ApiGetEndpointResponseSchema<
  Api extends ApiSpec,
  Endpoint extends keyof Api["endpoints"],
  StatusCode extends keyof ApiGetEndpoint<Api, Endpoint>["responses"],
  $Response = ApiGetEndpointResponse<Api, Endpoint, StatusCode>
> = ApiGetSchemaOf<$Response>;

/**
 * Get an endpoint response schema from an api spec using the endpoint path and response status code
 * @param Api - Api specification
 * @param Method - HTTP method
 * @param Path - Endpoint path
 * @param StatusCode - Response status code
 * @returns Endpoint response schema
 */
export type ApiGetEndpointResponseSchemaByPath<
  Api extends ApiSpec,
  Method extends ApiMethod,
  Path extends ApiGetPathsByMethod<Api, Method>,
  StatusCode extends keyof ApiGetEndpointResponsesByPath<Api, Method, Path>,
  $Response = ApiGetEndpointResponseByPath<Api, Method, Path, StatusCode>
> = ApiGetSchemaOf<$Response>;

/**
 * Get the endpoint body from an api spec using the endpoint name
 * @param Api - Api specification
 * @param Endpoint - Endpoint name
 * @returns Endpoint body
 */
export type ApiGetEndpointBody<Api extends ApiSpec, Endpoint extends keyof Api["endpoints"]> = ApiGetEndpoint<
  Api,
  Endpoint
>["body"];

/**
 * Get the endpoint body from an api spec using the endpoint path
 * @param Api - Api specification
 * @param Method - HTTP method
 * @param Path - Endpoint path
 * @returns Endpoint body
 */
export type ApiGetEndpointBodyByPath<
  Api extends ApiSpec,
  Method extends ApiMethod,
  Path extends ApiGetPathsByMethod<Api, Method>
> = ApiGetEndpointByPath<Api, Method, Path>["body"];

/**
 * Get the endpoint body schema from an api spec using the endpoint name
 * @param Api - Api specification
 * @param Endpoint - Endpoint name
 * @returns Endpoint body schema
 */
export type ApiGetEndpointBodySchema<
  Api extends ApiSpec,
  Endpoint extends keyof Api["endpoints"],
  $Body = ApiGetEndpointBody<Api, Endpoint>
> = ApiGetSchemaOf<$Body>;

/**
 * Get the endpoint body schema from an api spec using the endpoint path
 * @param Api - Api specification
 * @param Method - HTTP method
 * @param Path - Endpoint path
 * @returns Endpoint body schema
 */
export type ApiGetEndpointBodySchemaByPath<
  Api extends ApiSpec,
  Method extends ApiMethod,
  Path extends ApiGetPathsByMethod<Api, Method>,
  $Body = ApiGetEndpointBodyByPath<Api, Method, Path>
> = ApiGetSchemaOf<$Body>;
