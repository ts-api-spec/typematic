# Typematic - Yup

Yup plugin for Typematic
Allows to use `Yup` as a validation library for Typematic

## Example

```typescript
import * as y from "yup";
import { apiSpecBuilder } from "@typematic/core";
import { ApiZodSchema } from "@typematic/yup";

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
      userId: y.number(),
    },
    responses: {
      200: y
        .array(
          y.object({
            userId: y.number().required(),
            id: y.number().required(),
            title: y.string().required(),
            body: y.string().required(),
          })
        )
        .required(),
    },
  })
  .addEndpoint("getPostsById", {
    method: "GET",
    path: "/posts/:id",
    params: {
      id: y.number().min(1).required(),
    },
    responses: {
      /**
       * direct schema
       */
      200: y
        .object({
          userId: y.number().required(),
          id: y.number().required(),
          title: y.string().required(),
          body: y.string().required(),
        })
        .required(),
      404: y
        .object({
          message: y.string().required(),
        })
        .required(),
    },
  })
  .addEndpoint("attachFile", {
    method: "POST",
    path: "/posts/:id/attachment",
    // we can use the schema directly if no need for metadata
    params: {
      id: y.number().min(1).required(),
    },
    body: {
      metadata: {
        description: "The file to attach",
        format: "form-data", // allows to specify the format of the body for the documentation and the client generation
      },
      schema: y.object({
        file: y.mixed((input): input is File => input instanceof File).required(),
      }),
    },
    responses: {
      204: {
        metadata: {
          description: "No content",
        },
        schema: y.object({}),
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
        schema: y.number().min(1).required(),
      },
    },
    responses: {
      200: {
        metadata: {
          description: "The file attached to the post",
          format: "blob", // allows to specify the format of the response for the documentation and the client generation
        },
        schema: y.mixed((input): input is Blob => input instanceof Blob).required(),
      },
      404: {
        metadata: {
          description: "Not found",
        },
        schema: y.object({
          message: y.string().required(),
        }),
      },
    },
  })
  .build();
```
