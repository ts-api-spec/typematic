# Typematic - Zod

Zod plugin for Typematic
Allows to use `Zod` as a validation library for Typematic

## Example

```typescript
import { z } from "zod";
import { apiSpecBuilder } from "@typematic/core";
import { ApiZodSchema } from "@typematic/zod";

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
      id: z.number().min(1),
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
      404: z.object({
        message: z.string(),
      }),
    },
  })
  .addEndpoint("attachFile", {
    method: "POST",
    path: "/posts/:id/attachment",
    // we can use the schema directly if no need for metadata
    params: {
      id: z.number().min(1),
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
        metadata: {
          description: "No content",
        },
        schema: z.undefined(),
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
        schema: z.number().min(1),
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
        metadata: {
          description: "Not found",
        },
        schema: z.object({
          message: z.string(),
        }),
      },
    },
  })
  .build();
```
