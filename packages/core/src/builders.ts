import type { ApiEndpoint, ApiMetadata, ApiMethod, ApiSpec } from "./types";
import type { Merge } from "./utils.types";

export type EndpointGetPathsByMethod<Endpoints extends Record<string, ApiEndpoint>, Method extends ApiMethod> = {
  [Endpoint in keyof Endpoints]: Endpoints[Endpoint]["method"] extends Lowercase<Method> | Uppercase<Method>
    ? Endpoints[Endpoint]["path"]
    : never;
}[keyof Endpoints];

/**
 * create an api spec
 * @param spec - the api spec to infer
 * @returns - the api spec inferred
 * @example
 * ```ts
 * const apiSpec = makeApiSpec({
 *  getPosts: {
 *    method: 'GET',
 *    path: '/posts',
 *    responses: {
 *      200: z.array(postSchema),
 *    },
 *  },
 * });
 * ```
 */
export function makeApiSpec<const Endpoints extends Record<string, ApiEndpoint>>(
  endpoints: Endpoints
): { endpoints: Endpoints };
export function makeApiSpec<const Endpoints extends Record<string, ApiEndpoint>, const Metadata extends ApiMetadata>(
  endpoints: Endpoints,
  metadata: Metadata
): { endpoints: Endpoints; metadata: Metadata };
export function makeApiSpec<Endpoints extends Record<string, ApiEndpoint>, Metadata extends ApiMetadata>(
  endpoints: Endpoints,
  metadata?: ApiMetadata
) {
  return {
    metadata,
    endpoints,
  };
}

/**
 * Api spec builder
 * simplifies the creation of an api spec
 * with good type inference and intellisense
 */
export class ApiSpecBuilder<Metadata extends ApiMetadata | undefined, Endpoints extends ApiSpec["endpoints"] = {}> {
  private spec: ApiSpec = {
    endpoints: {},
  };

  constructor(metadata?: Metadata) {
    // @ts-expect-error we are in the constructor, we can mutate the spec
    this.spec.metadata = metadata;
  }

  /**
   * add an endpoint to the spec by alias
   * @param alias - the alias of the endpoint
   * @param endpoint - the endpoint to add
   * @returns - the updated builder
   * @example
   * ```ts
   * const apiSpec = apiSpecBuilder()
   *  .addEndpoint('getPosts', {
   *   method: 'GET',
   *   path: '/posts',
   *   responses: {
   *    200: z.array(postSchema),
   *   },
   * })
   * .build();
   * ```
   */
  addEndpoint<const Alias, const Endpoint>(
    alias: Alias extends string
      ? Alias extends keyof Endpoints
        ? `Error: '${Alias}' is already defined`
        : Alias
      : string,
    endpoint: Endpoint extends ApiEndpoint
      ? Endpoint extends {
          method: Endpoint["method"];
          path: EndpointGetPathsByMethod<Endpoints, Endpoint["method"]>;
        }
        ? ApiEndpoint & {
            path: `Error: '${Endpoint["method"]} ${Endpoint["path"]}' is already defined. if you need to define the same endpoint with different responses, try appending a fragment to differentiate them. example: '${Endpoint["method"]} ${Endpoint["path"]}#fragment'`;
          }
        : Endpoint
      : ApiEndpoint
  ): ApiSpecBuilder<
    Metadata,
    Merge<
      Endpoints,
      Alias extends string
        ? {
            [key in Alias]: Endpoint;
          }
        : never
    >
  > {
    this.spec.endpoints[alias] = endpoint;
    return this as any;
  }

  /**
   * build the api spec
   * @returns - the api spec
   */
  build(): Metadata extends undefined
    ? {
        endpoints: Endpoints;
      }
    : {
        metadata: Metadata;
        endpoints: Endpoints;
      } {
    return this.spec as any;
  }
}

/**
 * Build an api spec with builder pattern
 * @example
 * ```ts
 * const apiSpec = apiSpecBuilder({
 *   name: "my-api",
 *   version: "1.0.0",
 *   description: "My API description",
 *   servers: [
 *     {
 *       url: "http://localhost:3000",
 *       name: "development",
 *     },
 *     {
 *       url: "https://jsonplaceholder.typicode.com",
 *       name: "production",
 *     },
 *   ],
 *   schemaType: ApiZodSchema, // optional, allows to specify the schema adapter to use, for all shemas in definitions, default to ApiTypesriptSchema
 * })
 * .addEndpoint('getPosts', {
 *     metadata: {
 *       description: "Get all posts",
 *       schemaType: ApiTypeScriptSchema, // override the parent defined schema adapter (ZodSchemaAdapter)
 *     },
 *     method: "GET",
 *     path: "/posts",
 *     query: {
 *       userId: {
 *         metadata: {
 *           description: "The ID of the user", // allows to add a description to the parameter for the documentation outside of the schema
 *           schemaType: ApiZodSchema, // override the parent defined schema adapter (TypeScriptSchemaAdapter)
 *         },
 *         schema: z.number().optional(), // zod schema since the schema adapter is ZodSchemaAdapter
 *       },
 *       id: {
 *         metadata: {
 *           description: "The ID of the post",
 *         },
 *         schema: tsSchema<number>(), // typescript schema since the schema adapter is TypeScriptSchemaAdapter
 *       },
 *     },
 *     responses: {
 *       200: {
 *         schema: z.array(
 *           z.object({
 *             userId: z.number(),
 *             id: z.number(),
 *             title: z.string(),
 *             body: z.string(),
 *           })
 *         ),
 *       },
 *       404: {
 *         schema: z
 *           .object({
 *             message: z.string(),
 *           })
 *           .describe("Not found"),
 *       },
 *     },
 *   })
 *   .build()
 * ```
 */
export function apiSpecBuilder(): ApiSpecBuilder<undefined>;
export function apiSpecBuilder<const Metadata extends ApiMetadata>(metadata: Metadata): ApiSpecBuilder<Metadata>;
export function apiSpecBuilder<Metadata extends ApiMetadata | undefined>(metadata?: Metadata) {
  return new ApiSpecBuilder(metadata);
}
