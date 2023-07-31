import { describe, it, expect, assert, expectTypeOf } from "vitest";
import { Problems, type } from "arktype";

import { ApiArktypeSchema } from "./index";

describe("ApiArktypeSchema", () => {
  it("should validate schema", () => {
    const schema = ApiArktypeSchema;
    const result = schema.validate(type("number>=0"), 123);
    assert(result.success);
    expectTypeOf(result.data).toEqualTypeOf<number>();
    expect(result).toEqual({ success: true, data: 123 });
  });

  it("should validate schema async", async () => {
    const schema = ApiArktypeSchema;
    const result = await schema.validateAsync(type("number>=0"), 123);
    assert(result.success);
    expectTypeOf(result.data).toEqualTypeOf<number>();
    expect(result).toEqual({ success: true, data: 123 });
  });

  it("should not validate schema with invalid input", () => {
    const schema = ApiArktypeSchema;
    const result = schema.validate(type("number>=0"), -123);
    assert(!result.success);
    expectTypeOf(result.error).toEqualTypeOf<Problems>();
    expect(result.error.summary).toBe("Must be at least 0 (was -123)");
  });
});
