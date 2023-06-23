import { describe, it, expect, expectTypeOf, assert } from "vitest";

import { ApiJsonTypeSchema } from "./index";
import { ErrorObject } from "ajv/dist/jtd";

describe("ApiJsonTypeSchema", () => {
  it("should validate schema", () => {
    const schema = ApiJsonTypeSchema;
    const result = schema.validate(
      {
        type: "uint32",
      } as const,
      123
    );
    assert(result.success);
    expectTypeOf(result.data).toEqualTypeOf<number>();
    expect(result).toEqual({ success: true, data: 123 });
  });

  it("should validate schema async", async () => {
    const schema = ApiJsonTypeSchema;
    const result = await schema.validateAsync(
      {
        type: "uint32",
      } as const,
      123
    );
    assert(result.success);
    expectTypeOf(result.data).toEqualTypeOf<number>();
    expect(result).toEqual({ success: true, data: 123 });
  });

  it("should not validate schema with invalid input", () => {
    const schema = ApiJsonTypeSchema;
    const result = schema.validate(
      {
        type: "uint32",
      },
      -123
    );
    assert(!result.success);
    expectTypeOf(result.error).toEqualTypeOf<ErrorObject[]>();
    expect(result).toMatchObject({
      success: false,
      error: expect.arrayContaining([
        {
          instancePath: "",
          keyword: "type",
          message: "must be uint32",
          params: {
            nullable: false,
            type: "uint32",
          },
          schemaPath: "/type",
        },
      ]),
    });
  });
});
