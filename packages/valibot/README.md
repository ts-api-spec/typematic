# Typematic - Zod

Valibot plugin for Typematic
Allows to use `Valibot` as a validation library for Typematic

## Example

```typescript
import { array, number, object, string, instance, minValue, optional, undefinedType } from "valibot";
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

import { ApiValibotSchema } from "@typematic/valibot";

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
  schemaType: ApiValibotSchema,
})
  .addEndpoint("getPosts", {
    method: "GET",
    path: "/posts",
    query: {
      userId: optional(number([minValue(1)])),
    },
    responses: {
      200: array(
        object({
          userid: number(),
          id: number(),
          title: string(),
          body: string(),
        })
      ),
    },
  })
  .addEndpoint("getPostsById", {
    method: "GET",
    path: "/posts/:id",
    params: {
      id: number([minValue(1)]),
    },
    responses: {
      /**
       * direct schema
       */
      200: object({
        userid: number(),
        id: number(),
        title: string(),
        body: string(),
      }),
      404: object({
        message: string(),
      }),
    },
  })
  .addEndpoint("attachFile", {
    method: "POST",
    path: "/posts/:id/attachment",
    // we can use the schema directly if no need for metadata
    params: {
      id: number([minValue(1)]),
    },
    body: {
      metadata: {
        description: "The file to attach",
        format: "form-data", // allows to specify the format of the body for the documentation and the client generation
      },
      schema: object({
        file: instance(File),
      }),
    },
    responses: {
      204: {
        metadata: {
          description: "No content",
        },
        schema: undefinedType(),
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
        schema: number([minValue(1)]),
      },
    },
    responses: {
      200: {
        metadata: {
          description: "The file attached to the post",
          format: "blob", // allows to specify the format of the response for the documentation and the client generation
        },
        schema: instance(Blob),
      },
      404: {
        metadata: {
          description: "Not found",
        },
        schema: object({
          message: string(),
        }),
      },
    },
  })
  .build();
```
