import { describe, it, expectTypeOf, expect } from "vitest";
import { apiSpecBuilder } from "./builders";
import { tsSchema, TsSchema } from "./schema-type-ts";
import { apiGetEndpoint, apiGetEndpointByPath } from "./parser";
import { ApiGetEndpoint, ApiGetEndpointByPath } from "./parser.types";

describe("Api Parse Spec", () => {
  const spec = apiSpecBuilder({ name: "Test API", version: "1.0.0" })
    .addEndpoint("getUsers", {
      method: "GET",
      path: "/users",
      responses: {
        200: tsSchema<Array<{ id: string; name: string }>>(),
        default: tsSchema<{ message: string }>(),
      },
    })
    .addEndpoint("createUser", {
      method: "POST",
      path: "/users",
      body: tsSchema<{ name: string }>(),
      responses: {
        200: tsSchema<{ id: string; name: string }>(),
        default: tsSchema<{ message: string }>(),
      },
    })
    .addEndpoint("searchUsers", {
      method: "get",
      path: "/users#search",
      query: tsSchema<{ name: string }>(),
      responses: {
        200: tsSchema<Array<{ id: string; name: string }>>(),
        default: tsSchema<{ message: string }>(),
      },
    })
    .build();

  describe("ApiGetEndpoint", () => {
    it("should get endpoint", () => {
      const endpoint = apiGetEndpoint(spec, "getUsers");
      expectTypeOf(endpoint).toEqualTypeOf<{
        readonly method: "GET";
        readonly path: "/users";
        readonly responses: {
          readonly 200: TsSchema<Array<{ id: string; name: string }>>;
          readonly default: TsSchema<{ message: string }>;
        };
      }>();
      expect(endpoint).toEqual({
        method: "GET",
        path: "/users",
        responses: {
          200: tsSchema<Array<{ id: string; name: string }>>(),
          default: tsSchema<{ message: string }>(),
        },
      });
    });

    it("should not get invalid endpoint", () => {
      expect(() => apiGetEndpoint(spec, "getUsers2" as any)).toThrowErrorMatchingInlineSnapshot(
        `"Endpoint not found: getUsers2"`
      );
    });
  });

  describe("ApiGetEndpointByPath", () => {
    it("should get endpoint", () => {
      const endpoint = apiGetEndpointByPath(spec, "get", "/users");
      expectTypeOf(endpoint).toEqualTypeOf<{
        readonly method: "GET";
        readonly path: "/users";
        readonly responses: {
          readonly 200: TsSchema<Array<{ id: string; name: string }>>;
          readonly default: TsSchema<{ message: string }>;
        };
      }>();
      expect(endpoint).toEqual({
        method: "GET",
        path: "/users",
        responses: {
          200: tsSchema<Array<{ id: string; name: string }>>(),
          default: tsSchema<{ message: string }>(),
        },
      });
    });

    it("should not get invalid endpoint", () => {
      expect(() => apiGetEndpointByPath(spec, "get", "/users2" as any)).toThrowErrorMatchingInlineSnapshot(
        `"Endpoint not found: get /users2"`
      );
    });
  });
});
