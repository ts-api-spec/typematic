import { z } from "zod";
import * as S from "@effect/schema/Schema";
import { pipe } from "@effect/data/Function";
import {
  ApiGetEndpoint,
  ApiGetEndpointBody,
  ApiGetEndpointByPath,
  ApiGetEndpointCookies,
  ApiGetEndpointHeaders,
  ApiGetEndpointParams,
  ApiGetEndpointQueries,
  ApiGetEndpointQuery,
  ApiGetEndpointResponse,
} from "../src/endpoint-utilities.types";
import {
  ApiInferEndpointInputBody,
  ApiInferEndpointInputParam,
  ApiInferEndpointInputQuery,
} from "../src/infer-utilities.types";
import { makeApiSpec } from "../src/api-spec.builders";
import { ApiZodSchema } from "../src/schema-type-zod";
import { ApiTypeScriptSchema, tsSchema } from "../src/schema-type-ts";
import { ApiEffectSchema } from "../src/schema-type-effect";

// example of a complete API specification
export const apiSpec = makeApiSpec(
  {
    getPosts: {
      metadata: {
        description: "Get all posts",
        schemaType: ApiTypeScriptSchema, // override the parent defined schema adapter (ZodSchemaAdapter)
      },
      method: "GET",
      path: "/posts",
      query: {
        userId: {
          metadata: {
            description: "The ID of the user", // allows to add a description to the parameter for the documentation outside of the schema
            schemaType: ApiZodSchema, // override the parent defined schema adapter (TypeScriptSchemaAdapter)
          },
          schema: z.number().optional(), // zod schema since the schema adapter is ZodSchemaAdapter
        },
        id: {
          metadata: {
            description: "The ID of the post",
          },
          schema: tsSchema<number>(), // typescript schema since the schema adapter is TypeScriptSchemaAdapter
        },
      },
      responses: {
        200: {
          schema: z.array(
            z.object({
              userId: z.number(),
              id: z.number(),
              title: z.string(),
              body: z.string(),
            })
          ),
        },
        404: {
          schema: z
            .object({
              message: z.string(),
            })
            .describe("Not found"),
        },
      },
    },
    getPost: {
      method: "GET",
      path: "/posts/:id",
      params: {
        id: {
          schema: z.number().int().positive().describe("The ID of the post"),
        },
      },
      responses: {
        200: {
          schema: z.object({
            userId: z.number(),
            id: z.number(),
            title: z.string(),
            body: z.string(),
          }),
        },
        404: {
          schema: z
            .object({
              message: z.string(),
            })
            .describe("Not found"),
        },
      },
    },
    attachFile: {
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
    },
    getAttachment: {
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
    },
  },
  {
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
    schemaType: ApiZodSchema, // optional, allows to specify the schema adapter to use, for all shemas in definitions, default to "zod"
  }
);

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
type T7 = ApiGetEndpointResponse<typeof apiSpec, "getPosts", 404>;
//   ^?

/**
 * Infer schema types
 */
type T8 = ApiInferEndpointInputBody<typeof apiSpec, "attachFile">; // schema with zod
//   ^?
type T9 = ApiInferEndpointInputParam<typeof apiSpec, "getAttachment", "id">; // schema with @effect/schema
//   ^?
type T10 = ApiInferEndpointInputParam<typeof apiSpec, "getPost", "id">; // schema with typescript
//   ^?
type T11 = ApiInferEndpointInputParam<typeof apiSpec, "attachFile", "id">; // direct schema without metadata
//   ^?
type T12 = ApiInferEndpointInputQuery<typeof apiSpec, "getPosts", "userId">; // schema with zod
//   ^?
type T13 = ApiInferEndpointInputQuery<typeof apiSpec, "getPosts", "id">; // schema with typescript
//   ^?
