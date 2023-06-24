import { apiSpecBuilder } from "../src";
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
  ApiInferEndpointInputHeader,
  ApiInferEndpointInputParam,
  ApiInferEndpointInputQuery,
  ApiInferEndpointOutputResponse,
} from "../src";

import { tsSchema } from "../src";

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
})
  .addEndpoint("getPosts", {
    method: "GET",
    path: "/posts",
    query: {
      userId: tsSchema<number | undefined>(),
    },
    responses: {
      200: tsSchema<
        {
          userId: number;
          id: number;
          title: string;
          body: string;
        }[]
      >(),
    },
  })
  .addEndpoint("getPostsById", {
    method: "GET",
    path: "/posts/:id",
    params: {
      id: tsSchema<number>(),
    },
    headers: {
      authorization: tsSchema<`Bearer ${string}`>(), // common headers are proposed in auto-completion
      "x-custom": tsSchema<string>(), // custom headers are allowed
    },
    responses: {
      /**
       * direct schema
       */
      200: tsSchema<{
        userId: number;
        id: number;
        title: string;
        body: string;
      }>(),
      404: tsSchema<{ message: string }>(),
    },
  })
  .addEndpoint("attachFile", {
    method: "POST",
    path: "/posts/:id/attachment",
    // we can use the schema directly if no need for metadata
    params: {
      id: tsSchema<number>(),
    },
    body: {
      metadata: {
        description: "The file to attach",
        format: "form-data", // allows to specify the format of the body for the documentation and the client generation
      },
      schema: tsSchema<{
        file: File;
      }>(),
    },
    responses: {
      204: {
        metadata: {
          description: "No content",
        },
        schema: tsSchema<void>(),
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
        schema: tsSchema<number>(),
      },
    },
    responses: {
      200: {
        metadata: {
          description: "The file attached to the post",
          format: "blob", // allows to specify the format of the response for the documentation and the client generation
        },
        schema: tsSchema<Blob>(),
      },
      404: {
        metadata: {
          description: "Not found",
        },
        schema: tsSchema<{ message: string }>(),
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
type T10_1 = ApiInferEndpointInputHeader<typeof apiSpec, "getPostsById", "authorization">;
//   ^?
type T11 = ApiInferEndpointInputParam<typeof apiSpec, "attachFile", "id">;
//   ^?
type T12 = ApiInferEndpointInputQuery<typeof apiSpec, "getPosts", "userId">;
//   ^?
type T13 = ApiInferEndpointOutputResponse<typeof apiSpec, "getPosts", 200>;
//   ^?
