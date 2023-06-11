import { z } from "zod";
import {
  ApiGetEndpoint,
  ApiGetEndpointBody,
  ApiGetEndpointByPath,
  ApiGetEndpointCookies,
  ApiGetEndpointHeaders,
  ApiGetEndpointParams,
  ApiGetEndpointQueries,
  ApiGetEndpointQuery,
  ApiGetEndpointResponseByStatus,
} from "../src/api-spec.types";
import { makeApiSpec } from "../src/api-spec.builders";
import { ApiZodSchema } from "../src/schema-type-zod";
import { ApiTypeScriptSchema, tsSchema } from "../src/schema-type-ts";

// example of a complete API specification
export const apiSpec = makeApiSpec({
  metadata: {
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
  },
  // endpoints with aliases
  endpoints: {
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
      params: {
        id: {
          schema: z.number().int().positive().describe("The ID of the post"),
        },
      },
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
        403: {
          schema: z
            .object({
              message: z.string(),
            })
            .describe("Forbidden"),
        },
      },
    },
    getAttachment: {
      method: "GET",
      path: "/posts/:id/attachment",
      params: {
        id: {
          schema: z.number().int().positive().describe("The ID of the post"),
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
});

type T0 = ApiGetEndpoint<typeof apiSpec, "getPosts">;
type T1 = ApiGetEndpointBody<typeof apiSpec, "getPosts">;
type T2 = ApiGetEndpointParams<typeof apiSpec, "getPosts">;
type T3 = ApiGetEndpointQueries<typeof apiSpec, "getPosts">;
type T3_1 = ApiGetEndpointQuery<typeof apiSpec, "getPosts", "userId">;
type T4 = ApiGetEndpointHeaders<typeof apiSpec, "getPosts">;
type T5 = ApiGetEndpointCookies<typeof apiSpec, "getPosts">;
type T6 = ApiGetEndpointResponseByStatus<typeof apiSpec, "getPosts", 200>;
type T7 = ApiGetEndpointResponseByStatus<typeof apiSpec, "getPosts", 404>;
