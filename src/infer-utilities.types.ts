import type {
  ApiBaseMetadata,
  ApiDataParameter,
  ApiEndpoint,
  ApiParameter,
  ApiSpec,
} from "./api-spec.types";
import type {
  ApiGetEndpoint,
  ApiGetEndpointBody,
  ApiGetEndpointParam,
  ApiGetEndpointParams,
  ApiGetEndpointQueries,
  ApiGetEndpointQuery,
} from "./basic-utilities.types";
import type { InferInputTypeFromSchema, SchemaType } from "./schema-type.types";
import { ApiTypeScriptSchema } from "./schema-type-ts";

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
>[PathParam] extends infer Param extends ApiParameter
  ? Param["metadata"] extends infer Meta extends ApiBaseMetadata
    ? Meta["schemaType"] extends infer Type extends SchemaType
      ? Type
      : ApiGetEndpointSchemaType<Api, Endpoint, DefaultSchemaType>
    : ApiGetEndpointSchemaType<Api, Endpoint, DefaultSchemaType>
  : ApiGetEndpointSchemaType<Api, Endpoint, DefaultSchemaType>;

export type ApiGetEndpointQuerySchemaType<
  Api extends ApiSpec,
  Endpoint extends keyof Api["endpoints"],
  QueryParam extends keyof ApiGetEndpointQueries<Api, Endpoint>,
  DefaultSchemaType extends SchemaType = typeof ApiTypeScriptSchema
> = ApiGetEndpointQueries<
  Api,
  Endpoint
>[QueryParam] extends infer Param extends ApiParameter
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
  ComputedParam = ApiGetEndpointParam<Api, Endpoint, PathParam>
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

export type ApiInferEndpointQuery<
  Api extends ApiSpec,
  Endpoint extends keyof Api["endpoints"],
  QueryParam extends keyof ApiGetEndpointQueries<Api, Endpoint>,
  DefaultSchemaType extends SchemaType = typeof ApiTypeScriptSchema,
  ComputedQuery = ApiGetEndpointQuery<Api, Endpoint, QueryParam>
> = ComputedQuery extends ApiParameter
  ? InferInputTypeFromSchema<
      NonNullable<
        ApiGetEndpointQuerySchemaType<
          Api,
          Endpoint,
          QueryParam,
          DefaultSchemaType
        >["_provider"]
      >,
      ComputedQuery["schema"]
    >
  : InferInputTypeFromSchema<
      NonNullable<
        ApiGetEndpointQuerySchemaType<
          Api,
          Endpoint,
          QueryParam,
          DefaultSchemaType
        >["_provider"]
      >,
      ComputedQuery
    >;
