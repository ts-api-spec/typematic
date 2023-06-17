import { z } from "zod";
import * as S from "@effect/schema/Schema";
import { pipe } from "@effect/data/Function";
import { apiSpecBuilder } from "../src/api-spec.builders";
import { ApiZodSchema } from "../src/schema-type-zod";
import { ApiTypeScriptSchema, tsSchema } from "../src/schema-type-ts";
import {
  ApiGetEndpoint,
  ApiGetEndpointBody,
  ApiGetEndpointCookies,
  ApiGetEndpointHeaders,
  ApiGetEndpointParams,
  ApiGetEndpointQueries,
  ApiGetEndpointQuery,
  ApiGetEndpointResponse,
} from "../src/endpoint-utilities.types";
import { ApiEffectSchema } from "../src/schema-type-effect";
import {
  ApiInferEndpointInputBody,
  ApiInferEndpointInputParam,
  ApiInferEndpointInputQuery,
} from "../src/infer-utilities.types";

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
  schemaType: ApiZodSchema,
})
  .addEndpoint("getPosts", {
    method: "GET",
    path: "/posts",
    query: {
      userId: z.number().optional(),
    },
    responses: {
      200: z.array(
        z.object({
          userId: z.number(),
          id: z.number(),
          title: z.string(),
          body: z.string(),
        })
      ),
    },
  })
  .addEndpoint("getPostsById", {
    method: "GET",
    path: "/posts/:id",
    params: {
      id: z.number(),
    },
    responses: {
      /**
       * direct schema
       */
      200: z.object({
        userId: z.number(),
        id: z.number(),
        title: z.string(),
        body: z.string(),
      }),
      /**
       * schema with metadata using typescript schema type
       */
      404: {
        metadata: {
          schemaType: ApiTypeScriptSchema,
        },
        schema: tsSchema<{ message: string }>(),
      },
    },
  })
  .addEndpoint("attachFile", {
    method: "POST",
    path: "/posts/:id/attachment",
    // we can use the schema directly if no need for metadata
    params: {
      id: z.number().int().positive().describe("The ID of the post"),
    },
    // or we can use a plain object with metadata
    // params: {
    //   id: {
    //     metadata: {
    //       description: "The ID of the post",
    //     },
    //     schema: z.number().int().positive(),
    //   },
    // },
    body: {
      metadata: {
        description: "The file to attach",
        format: "form-data", // allows to specify the format of the body for the documentation and the client generation
      },
      schema: z.object({
        file: z.instanceof(File),
      }),
    },
    responses: {
      204: {
        schema: z.undefined().describe("No content"),
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
          schemaType: ApiEffectSchema,
        },
        schema: S.union(pipe(S.number, S.positive()), S.undefined), // we can mix any schema type if we specify it in the metadata
      },
    },
    responses: {
      200: {
        metadata: {
          description: "The file attached to the post",
          format: "blob", // allows to specify the format of the response for the documentation and the client generation
        },
        schema: z.instanceof(Blob),
      },
      404: {
        schema: z
          .object({
            message: z.string(),
          })
          .describe("Not found"),
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
type T8 = ApiInferEndpointInputBody<typeof apiSpec, "attachFile">; // schema with zod
//   ^?
type T9 = ApiInferEndpointInputParam<typeof apiSpec, "getAttachment", "id">; // schema with @effect/schema
//   ^?
type T10 = ApiInferEndpointInputParam<typeof apiSpec, "getPostsById", "id">; // schema with typescript
//   ^?
type T11 = ApiInferEndpointInputParam<typeof apiSpec, "attachFile", "id">; // direct schema without metadata
//   ^?
type T12 = ApiInferEndpointInputQuery<typeof apiSpec, "getPosts", "userId">; // schema with zod
//   ^?
