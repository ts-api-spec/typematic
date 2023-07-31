import { describe, it, expect, expectTypeOf, assert } from "vitest";

import { ApiJsonSchema } from "./index";
import { ErrorObject } from "ajv";

describe("ApiJsonSchema", () => {
  it("should validate schema", () => {
    const schema = ApiJsonSchema;
    const result = schema.validate(
      {
        type: "integer",
        minimum: 0,
      } as const,
      123
    );
    assert(result.success);
    expectTypeOf(result.data).toEqualTypeOf<number>();
    expect(result).toEqual({ success: true, data: 123 });
  });

  it("should validate schema async", async () => {
    const schema = ApiJsonSchema;
    const result = await schema.validateAsync(
      {
        type: "integer",
        minimum: 0,
      } as const,
      123
    );
    assert(result.success);
    expectTypeOf(result.data).toEqualTypeOf<number>();
    expect(result).toEqual({ success: true, data: 123 });
  });

  it("should not validate schema with invalid input", () => {
    const schema = ApiJsonSchema;
    const result = schema.validate(
      {
        type: "integer",
        minimum: 0,
      } as const,
      -123
    );
    assert(!result.success);
    expectTypeOf(result.error).toEqualTypeOf<ErrorObject[]>();
    expect(result).toMatchObject({
      success: false,
      error: expect.arrayContaining([
        {
          instancePath: "",
          keyword: "minimum",
          message: "must be >= 0",
          params: {
            comparison: ">=",
            limit: 0,
          },
          schemaPath: "#/minimum",
        },
      ]),
    });
  });
});
