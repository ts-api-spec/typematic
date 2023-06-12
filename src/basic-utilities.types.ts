import type {
  ApiSpec,
  ApiMethod,
  ApiDataParameter,
  ApiBaseMetadata,
  ApiEndpoint,
  ApiParameter,
} from "./api-spec.types";
import type { InferInputTypeFromSchema, SchemaType } from "./schema-type.types";
import { ApiTypeScriptSchema } from "./schema-type-ts";

export type ApiGetEndpoint<
  Api extends ApiSpec,
  Endpoint extends keyof Api["endpoints"]
> = Api["endpoints"][Endpoint];

type ApiGetPathsByMethod<Api extends ApiSpec, Method extends ApiMethod> = {
  [Endpoint in keyof Api["endpoints"]]: ApiGetEndpoint<
    Api,
    Endpoint
  >["method"] extends Lowercase<Method> | Uppercase<Method>
    ? ApiGetEndpoint<Api, Endpoint>["path"]
    : never;
}[keyof Api["endpoints"]];

export type ApiGetEndpointByPath<
  Api extends ApiSpec,
  Method extends ApiMethod,
  Path extends ApiGetPathsByMethod<Api, Method>
> = {
  [Endpoint in keyof Api["endpoints"]]: ApiGetEndpoint<
    Api,
    Endpoint
  >["method"] extends Lowercase<Method> | Uppercase<Method>
    ? ApiGetEndpoint<Api, Endpoint>["path"] extends Path
      ? ApiGetEndpoint<Api, Endpoint>
      : never
    : never;
}[keyof Api["endpoints"]];

export type ApiGetEndpointBody<
  Api extends ApiSpec,
  Endpoint extends keyof Api["endpoints"]
> = ApiGetEndpoint<Api, Endpoint>["body"];

export type ApiGetEndpointParams<
  Api extends ApiSpec,
  Endpoint extends keyof Api["endpoints"]
> = ApiGetEndpoint<Api, Endpoint>["params"];

export type ApiGetEndpointQueries<
  Api extends ApiSpec,
  Endpoint extends keyof Api["endpoints"]
> = ApiGetEndpoint<Api, Endpoint>["query"];

export type ApiGetEndpointQuery<
  Api extends ApiSpec,
  Endpoint extends keyof Api["endpoints"],
  Query extends keyof ApiGetEndpoint<Api, Endpoint>["query"]
> = ApiGetEndpoint<Api, Endpoint>["query"][Query];

export type ApiGetEndpointHeaders<
  Api extends ApiSpec,
  Endpoint extends keyof Api["endpoints"]
> = ApiGetEndpoint<Api, Endpoint>["headers"];

export type ApiGetEndpointCookies<
  Api extends ApiSpec,
  Endpoint extends keyof Api["endpoints"]
> = ApiGetEndpoint<Api, Endpoint>["cookies"];

export type ApiGetEndpointResponseByStatus<
  Api extends ApiSpec,
  Endpoint extends keyof Api["endpoints"],
  StatusCode extends keyof ApiGetEndpoint<Api, Endpoint>["responses"]
> = ApiGetEndpoint<Api, Endpoint>["responses"][StatusCode];

export type ApiGetEndpointBodySchema<
  Api extends ApiSpec,
  Endpoint extends keyof Api["endpoints"]
> = ApiGetEndpointBody<Api, Endpoint> extends ApiDataParameter
  ? ApiGetEndpointBody<Api, Endpoint>["schema"]
  : never;

export type ApiGetSchemaType<
  Api extends ApiSpec,
  DefaultSchemaType extends SchemaType = typeof ApiTypeScriptSchema
> = Api["metadata"] extends infer Meta extends ApiBaseMetadata
  ? Meta["schemaType"] extends infer Type extends SchemaType
    ? Type
    : DefaultSchemaType
  : DefaultSchemaType;

export type ApiGetEndpointSchemaType<
  Api extends ApiSpec,
  Endpoint extends keyof Api["endpoints"],
  DefaultSchemaType extends SchemaType = typeof ApiTypeScriptSchema,
  ComputedEndpoint extends ApiEndpoint = ApiGetEndpoint<Api, Endpoint>
> = ComputedEndpoint["metadata"] extends infer Meta extends ApiBaseMetadata
  ? Meta["schemaType"] extends infer Type extends SchemaType
    ? Type
    : ApiGetSchemaType<Api, DefaultSchemaType>
  : ApiGetSchemaType<Api, DefaultSchemaType>;

export type ApiGetEndpointBodySchemaType<
  Api extends ApiSpec,
  Endpoint extends keyof Api["endpoints"],
  DefaultSchemaType extends SchemaType = typeof ApiTypeScriptSchema
> = ApiGetEndpointBody<
  Api,
  Endpoint
> extends infer Param extends ApiDataParameter
  ? Param["metadata"] extends infer Meta extends ApiBaseMetadata
    ? Meta["schemaType"] extends infer Type extends SchemaType
      ? Type
      : ApiGetEndpointSchemaType<Api, Endpoint, DefaultSchemaType>
    : ApiGetEndpointSchemaType<Api, Endpoint, DefaultSchemaType>
  : ApiGetEndpointSchemaType<Api, Endpoint, DefaultSchemaType>;

export type ApiGetEndpointParamSchemaType<
  Api extends ApiSpec,
  Endpoint extends keyof Api["endpoints"],
  PathParam extends keyof ApiGetEndpointParams<Api, Endpoint>,
  DefaultSchemaType extends SchemaType = typeof ApiTypeScriptSchema
> = ApiGetEndpointParams<
  Api,
  Endpoint
>[PathParam] extends infer Param extends ApiDataParameter
  ? Param["metadata"] extends infer Meta extends ApiBaseMetadata
    ? Meta["schemaType"] extends infer Type extends SchemaType
      ? Type
      : ApiGetEndpointSchemaType<Api, Endpoint, DefaultSchemaType>
    : ApiGetEndpointSchemaType<Api, Endpoint, DefaultSchemaType>
  : ApiGetEndpointSchemaType<Api, Endpoint, DefaultSchemaType>;

export type ApiInferEndpointBody<
  Api extends ApiSpec,
  Endpoint extends keyof Api["endpoints"],
  DefaultSchemaType extends SchemaType = typeof ApiTypeScriptSchema
> = ApiGetEndpointBody<
  Api,
  Endpoint
> extends infer Param extends ApiDataParameter
  ? InferInputTypeFromSchema<
      NonNullable<
        ApiGetEndpointBodySchemaType<
          Api,
          Endpoint,
          DefaultSchemaType
        >["_provider"]
      >,
      Param["schema"]
    >
  : InferInputTypeFromSchema<
      NonNullable<
        ApiGetEndpointSchemaType<Api, Endpoint, DefaultSchemaType>["_provider"]
      >,
      ApiGetEndpointBody<Api, Endpoint>
    >;

export type ApiInferEndpointParam<
  Api extends ApiSpec,
  Endpoint extends keyof Api["endpoints"],
  PathParam extends keyof ApiGetEndpointParams<Api, Endpoint>,
  DefaultSchemaType extends SchemaType = typeof ApiTypeScriptSchema,
  ComputedParam = ApiGetEndpointParams<Api, Endpoint>[PathParam]
> = ComputedParam extends ApiParameter
  ? InferInputTypeFromSchema<
      NonNullable<
        ApiGetEndpointParamSchemaType<
          Api,
          Endpoint,
          PathParam,
          DefaultSchemaType
        >["_provider"]
      >,
      ComputedParam["schema"]
    >
  : InferInputTypeFromSchema<
      NonNullable<
        ApiGetEndpointParamSchemaType<
          Api,
          Endpoint,
          PathParam,
          DefaultSchemaType
        >["_provider"]
      >,
      ComputedParam
    >;
