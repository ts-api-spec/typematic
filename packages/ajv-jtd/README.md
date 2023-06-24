# Typematic - Ajv json type definition

Ajv plugin for Typematic
Allows to use `Ajv/jtd` as a validation library for Typematic

## Example

```typescript
import { apiSpecBuilder } from "@typematic/core";
import { ApiJsonTypeSchema } from "@typematic/ajv-jtd";

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
  schemaType: ApiJsonTypeSchema,
})
  .addEndpoint("getPosts", {
    method: "GET",
    path: "/posts",
    query: {
      userId: {
        type: "uint32",
      },
    },
    responses: {
      200: {
        elements: {
          properties: {
            userId: {
              type: "uint32",
            },
            id: {
              type: "uint32",
            },
            title: {
              type: "string",
            },
            body: {
              type: "string",
            },
          },
        },
      },
    },
  })
  .addEndpoint("getPostsById", {
    method: "GET",
    path: "/posts/:id",
    params: {
      id: {
        type: "uint32",
      },
    },
    responses: {
      /**
       * direct schema
       */
      200: {
        properties: {
          userId: {
            type: "uint32",
          },
          id: {
            type: "uint32",
          },
          title: {
            type: "string",
          },
          body: {
            type: "string",
          },
        },
      },
      404: {
        properties: {
          message: {
            type: "string",
          },
        },
      },
    },
  })
  .addEndpoint("attachFile", {
    method: "POST",
    path: "/posts/:id/attachment",
    // we can use the schema directly if no need for metadata
    params: {
      id: {
        type: "uint32",
      },
    },
    body: {
      metadata: {
        description: "The file to attach",
        format: "form-data", // allows to specify the format of the body for the documentation and the client generation
      },
      schema: {
        elements: {
          type: "uint8",
        },
      },
    },
    responses: {
      204: {
        metadata: {
          description: "No content",
        },
        schema: {
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
          type: "uint32",
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
          elements: {
            type: "uint8",
          },
        },
      },
      404: {
        metadata: {
          description: "Not found",
        },
        schema: {
          properties: {
            message: {
              type: "string",
            },
          },
        },
      },
    },
  })
  .build();
```
