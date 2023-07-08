# Typematic - Ajv json schema definition

Ajv plugin for Typematic
Allows to use `Json Schema AJV` as a validation library for Typematic

## Example

```typescript
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

import { ApiJsonSchema } from "@typematic/ajv";

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
  schemaType: ApiJsonSchema,
})
  .addEndpoint("getPosts", {
    method: "GET",
    path: "/posts",
    query: {
      userId: {
        type: "integer",
      },
    },
    responses: {
      200: {
        type: "array",
        items: {
          type: "object",
          properties: {
            userId: {
              type: "number",
            },
            id: {
              type: "number",
            },
            title: {
              type: "string",
            },
            body: {
              type: "string",
            },
          },
          required: ["userId", "id", "title", "body"],
        },
      },
    },
  })
  .addEndpoint("getPostsById", {
    method: "GET",
    path: "/posts/:id",
    params: {
      id: {
        type: "number",
        minimum: 1,
      },
    },
    responses: {
      /**
       * direct schema
       */
      200: {
        type: "object",
        properties: {
          userId: {
            type: "number",
          },
          id: {
            type: "number",
          },
          title: {
            type: "string",
          },
          body: {
            type: "string",
          },
        },
        required: ["userId", "id", "title", "body"],
      },
      404: {
        type: "object",
        properties: {
          message: {
            type: "string",
          },
        },
        required: ["message"],
      },
    },
  })
  .addEndpoint("attachFile", {
    method: "POST",
    path: "/posts/:id/attachment",
    // we can use the schema directly if no need for metadata
    params: {
      id: {
        type: "number",
        minimum: 1,
      },
    },
    body: {
      metadata: {
        description: "The file to attach",
        format: "form-data", // allows to specify the format of the body for the documentation and the client generation
      },
      schema: {
        type: "array",
        items: {
          type: "number",
        },
      },
    },
    responses: {
      204: {
        metadata: {
          description: "No content",
        },
        schema: {
          type: "null",
          nullable: true,
        },
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
        schema: {
          type: "number",
          minimum: 1,
        },
      },
    },
    responses: {
      200: {
        metadata: {
          description: "The file attached to the post",
          format: "blob", // allows to specify the format of the response for the documentation and the client generation
        },
        schema: {
          type: "array",
          items: {
            type: "number",
          },
        },
      },
      404: {
        metadata: {
          description: "Not found",
        },
        schema: {
          type: "object",
          properties: {
            message: {
              type: "string",
            },
          },
          required: ["message"],
        },
      },
    },
  })
  .build();
```
