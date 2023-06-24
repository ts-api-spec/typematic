# Typematic - Effect

Effect plugin for Typematic
Allows to use `@effect/schema` as a validation library for Typematic

## Example

```typescript
import { apiSpecBuilder } from "@typematic/core";
import { ApiEffectSchema } from "@typematic/effect";
import * as S from "@effect/schema/Schema";
import { pipe } from "@effect/data/Function";


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
  schemaType: ApiEffectSchema,
})
  .addEndpoint("getPosts", {
    method: "GET",
    path: "/posts",
    query: {
      userId: S.union(S.number, S.undefined),
    },
    responses: {
      200: S.array(
        S.struct({
          userId: S.number,
          id: S.number,
          title: S.string,
          body: S.string,
        })
      ),
    },
  })
  .addEndpoint("getPostsById", {
    method: "GET",
    path: "/posts/:id",
    params: {
      id: pipe(S.number, S.positive()),
    },
    responses: {
      /**
       * direct schema
       */
      200: S.struct({
        userId: S.number,
        id: S.number,
        title: S.string,
        body: S.string,
      }),
      404: S.struct({
        message: S.string,
      }),
    },
  })
  .addEndpoint("attachFile", {
    method: "POST",
    path: "/posts/:id/attachment",
    // we can use the schema directly if no need for metadata
    params: {
      id: pipe(S.number, S.positive()),
    },
    body: {
      metadata: {
        description: "The file to attach",
        format: "form-data", // allows to specify the format of the body for the documentation and the client generation
      },
      schema: S.struct({
        file: S.instanceOf(File),
      }),
    },
    responses: {
      204: {
        metadata: {
          description: "No content",
        },
        schema: S.undefined,
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
        schema: pipe(S.number, S.positive()),
      },
    },
    responses: {
      200: {
        metadata: {
          description: "The file attached to the post",
          format: "blob", // allows to specify the format of the response for the documentation and the client generation
        },
        schema: S.instanceOf(Blob),
      },
      404: {
        metadata: {
          description: "Not found",
        },
        schema: S.struct({
          message: S.string,
        }),
      },
    },
  })
  .build();
```
