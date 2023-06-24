# Typematic - TypeBox

TypeBox plugin for Typematic
Allows to use `TypeBox` as a validation library for Typematic

## Example

```typescript
import { Type } from "@sinclair/typebox";
import { TypeSystem } from "@sinclair/typebox/system";
import { apiSpecBuilder } from "@typematic/core";
import { ApiTypeboxSchema } from "@typematic/typebox";

const TypeBlob = TypeSystem.Type<Blob>("Blob", (options, value) => value instanceof Blob);

const TypeFile = TypeSystem.Type<File>("File", (options, value) => value instanceof File);

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
  schemaType: ApiTypeboxSchema,
})
  .addEndpoint("getPosts", {
    method: "GET",
    path: "/posts",
    query: {
      userId: Type.Optional(Type.Number()),
    },
    responses: {
      200: Type.Object({
        userId: Type.Number(),
        id: Type.Number(),
        title: Type.String(),
        body: Type.String(),
      }),
    },
  })
  .addEndpoint("getPostsById", {
    method: "GET",
    path: "/posts/:id",
    params: {
      id: Type.Number(),
    },
    responses: {
      /**
       * direct schema
       */
      200: Type.Object({
        userId: Type.Number(),
        id: Type.Number(),
        title: Type.String(),
        body: Type.String(),
      }),
      404: Type.Object({
        message: Type.String(),
      }),
    },
  })
  .addEndpoint("attachFile", {
    method: "POST",
    path: "/posts/:id/attachment",
    // we can use the schema directly if no need for metadata
    params: {
      id: Type.Number({
        minimum: 1,
      }),
    },
    body: {
      metadata: {
        description: "The file to attach",
        format: "form-data", // allows to specify the format of the body for the documentation and the client generation
      },
      schema: TypeFile(),
    },
    responses: {
      204: {
        metadata: {
          description: "No content",
        },
        schema: Type.Undefined(),
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
        schema: Type.Number({
          minimum: 1,
        }),
      },
    },
    responses: {
      200: {
        metadata: {
          description: "The file attached to the post",
          format: "blob", // allows to specify the format of the response for the documentation and the client generation
        },
        schema: TypeBlob(),
      },
      404: {
        metadata: {
          description: "Not found",
        },
        schema: Type.Object({
          message: Type.String(),
        }),
      },
    },
  })
  .build();
```
