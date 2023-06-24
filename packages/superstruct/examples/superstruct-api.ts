import * as S from "superstruct";
import { apiSpecBuilder } from "@typematic/core";
import type {
  ApiGetEndpoint,
  ApiGetEndpointBody,
  ApiGetEndpointCookies,
  ApiGetEndpointHeaders,
  ApiGetEndpointParams,
  ApiGetEndpointQueries,
  ApiGetEndpointQuery,
  ApiGetEndpointResponse,
  ApiInferEndpointInputBody,
  ApiInferEndpointInputParam,
  ApiInferEndpointInputQuery,
  ApiInferEndpointOutputResponse,
} from "@typematic/core";

import { ApiSuperstructSchema } from "../src";

const apiSpec = apiSpecBuilder({
  name: "my-api",
  version: "1.0.0",
  description: "My API description",
  servers: [
    {
      url: "http://localhost:3000",
      name: "development",
    },
    {
      url: "https://jsonplaceholder.typicode.com",
      name: "production",
    },
  ],
  schemaType: ApiSuperstructSchema,
})
  .addEndpoint("getPosts", {
    method: "GET",
    path: "/posts",
    query: {
      userId: {
        schema: S.optional(S.min(S.number(), 1)),
      },
    },
    responses: {
      200: S.array(
        S.object({
          userId: S.number(),
          id: S.number(),
          title: S.string(),
          body: S.string(),
        })
      ),
    },
  })
  .addEndpoint("getPostsById", {
    method: "GET",
    path: "/posts/:id",
    params: {
      id: S.min(S.number(), 1),
    },
    responses: {
      /**
       * direct schema
       */
      200: S.object({
        userId: S.number(),
        id: S.number(),
        title: S.string(),
        body: S.string(),
      }),
      404: S.object({
        message: S.string(),
      }),
    },
  })
  .addEndpoint("attachFile", {
    method: "POST",
    path: "/posts/:id/attachment",
    // we can use the schema directly if no need for metadata
    params: {
      id: S.min(S.number(), 1),
    },
    body: {
      metadata: {
        description: "The file to attach",
        format: "form-data", // allows to specify the format of the body for the documentation and the client generation
      },
      schema: S.object({
        file: S.instance(File),
      }),
    },
    responses: {
      204: {
        metadata: {
          description: "No content",
        },
        schema: S.unknown(),
      },
    },
  })
  .addEndpoint("getAttachment", {
    method: "GET",
    path: "/posts/:id/attachment",
    params: {
      id: {
        metadata: {
          description: "The ID of the post",
        },
        schema: S.min(S.number(), 1),
      },
    },
    responses: {
      200: {
        metadata: {
          description: "The file attached to the post",
          format: "blob", // allows to specify the format of the response for the documentation and the client generation
        },
        schema: S.instance(Blob),
      },
      404: {
        metadata: {
          description: "Not found",
        },
        schema: S.object({
          message: S.string(),
        }),
      },
    },
  })
  .build();

type T0 = ApiGetEndpoint<typeof apiSpec, "getPosts">;
//   ^?
type T1 = ApiGetEndpointBody<typeof apiSpec, "getPosts">;
//   ^?
type T2 = ApiGetEndpointParams<typeof apiSpec, "getPosts">;
//   ^?
type T3 = ApiGetEndpointQueries<typeof apiSpec, "getPosts">;
//   ^?
type T3_1 = ApiGetEndpointQuery<typeof apiSpec, "getPosts", "userId">;
//   ^?
type T4 = ApiGetEndpointHeaders<typeof apiSpec, "getPosts">;
//   ^?
type T5 = ApiGetEndpointCookies<typeof apiSpec, "getPosts">;
//   ^?
type T6 = ApiGetEndpointResponse<typeof apiSpec, "getPosts", 200>;
//   ^?
type T7 = ApiGetEndpointResponse<typeof apiSpec, "getPostsById", 404>;
//   ^?

/**
 * Infer schema types
 */
type T8 = ApiInferEndpointInputBody<typeof apiSpec, "attachFile">;
//   ^?
type T9 = ApiInferEndpointInputParam<typeof apiSpec, "getAttachment", "id">;
//   ^?
type T10 = ApiInferEndpointInputParam<typeof apiSpec, "getPostsById", "id">;
//   ^?
type T11 = ApiInferEndpointInputParam<typeof apiSpec, "attachFile", "id">;
//   ^?
type T12 = ApiInferEndpointInputQuery<typeof apiSpec, "getPosts", "userId">;
//   ^?
type T13 = ApiInferEndpointOutputResponse<typeof apiSpec, "getPosts", 200>;
//   ^?
