# Typematic - Arktype

Arktype plugin for Typematic
Allows to use `Arktype` as a validation library for Typematic

## Example

```typescript
import { type, arrayOf, instanceOf } from "arktype";
import { apiSpecBuilder } from "@typematic/core";
import { ApiArktypeSchema } from "@typematic/arktype";

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
  schemaType: ApiArktypeSchema,
})
  .addEndpoint("getPosts", {
    method: "GET",
    path: "/posts",
    query: {
      userId: type("number | undefined"),
    },
    responses: {
      200: type(
        arrayOf({
          userId: "number",
          id: "number",
          title: "string",
          body: "string",
        })
      ),
    },
  })
  .addEndpoint("getPostsById", {
    method: "GET",
    path: "/posts/:id",
    params: {
      id: type("number"),
    },
    responses: {
      /**
       * direct schema
       */
      200: type({
        userId: "number",
        id: "number",
        title: "string",
        body: "string",
      }),
      404: type("string"),
    },
  })
  .addEndpoint("attachFile", {
    method: "POST",
    path: "/posts/:id/attachment",
    // we can use the schema directly if no need for metadata
    params: {
      id: type("integer > 0"),
    },
    body: {
      metadata: {
        description: "The file to attach",
        format: "form-data", // allows to specify the format of the body for the documentation and the client generation
      },
      schema: type(instanceOf(File)),
    },
    responses: {
      204: {
        metadata: {
          description: "No content",
        },
        schema: type("void"),
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
        schema: type("integer > 0"),
      },
    },
    responses: {
      200: {
        metadata: {
          description: "The file attached to the post",
          format: "blob", // allows to specify the format of the response for the documentation and the client generation
        },
        schema: type(instanceOf(Blob)),
      },
      404: {
        metadata: {
          description: "Not found",
        },
        schema: type({
          message: "string",
        }),
      },
    },
  })
  .build();
```
