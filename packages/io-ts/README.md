# Typematic - io-ts

io-ts plugin for Typematic
Allows to use `io-ts` as a validation library for Typematic

## example

```typescript
import { apiSpecBuilder } from "@typematic/core";
import { ApiIoTsSchema } from "@typematic/io-ts";
import * as t from "io-ts";


function customType<A>(name: string, is: (u: unknown) => u is A): t.Type<A, A, unknown> {
  return new t.Type(name, is, (u, c) => (is(u) ? t.success(u) : t.failure(u, c)), t.identity);
}

const file = customType("File", (u): u is File => u instanceof File);

const blob = customType("Blob", (u): u is Blob => u instanceof Blob);

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
  schemaType: ApiIoTsSchema,
})
  .addEndpoint("getPosts", {
    method: "GET",
    path: "/posts",
    query: {
      userId: t.union([t.undefined, t.number]),
    },
    responses: {
      200: t.array(
        t.type({
          userId: t.number,
          id: t.number,
          title: t.string,
          body: t.string,
        })
      ),
    },
  })
  .addEndpoint("getPostsById", {
    method: "GET",
    path: "/posts/:id",
    params: {
      id: t.number,
    },
    responses: {
      /**
       * direct schema
       */
      200: t.type({
        userId: t.number,
        id: t.number,
        title: t.string,
        body: t.string,
      }),
      404: t.type({
        message: t.string,
      }),
    },
  })
  .addEndpoint("attachFile", {
    method: "POST",
    path: "/posts/:id/attachment",
    // we can use the schema directly if no need for metadata
    params: {
      id: t.number,
    },
    body: {
      metadata: {
        description: "The file to attach",
        format: "form-data", // allows to specify the format of the body for the documentation and the client generation
      },
      schema: t.type({
        file: file,
      }),
    },
    responses: {
      204: {
        metadata: {
          description: "No content",
        },
        schema: t.undefined,
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
        schema: t.number,
      },
    },
    responses: {
      200: {
        metadata: {
          description: "The file attached to the post",
          format: "blob", // allows to specify the format of the response for the documentation and the client generation
        },
        schema: blob,
      },
      404: {
        metadata: {
          description: "Not found",
        },
        schema: t.type({
          message: t.string,
        }),
      },
    },
  })
  .build();
```