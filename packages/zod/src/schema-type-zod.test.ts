import { describe, it, expect, assert, expectTypeOf } from "vitest";
import { z } from "zod";

import { ApiZodSchema } from "./index";

describe("ApiZodSchema", () => {
  it("should validate schema", () => {
    const schema = ApiZodSchema;
    const result = schema.validate(z.number().positive(), 123);
    assert(result.success);
    expectTypeOf(result.data).toEqualTypeOf<number>();
    expect(result).toEqual({ success: true, data: 123 });
  });

  it("should validate schema async", async () => {
    const schema = ApiZodSchema;
    const result = await schema.validateAsync(z.number().positive(), 123);
    assert(result.success);
    expectTypeOf(result.data).toEqualTypeOf<number>();
    expect(result).toEqual({ success: true, data: 123 });
  });

  it("should not validate schema with invalid input", () => {
    const schema = ApiZodSchema;
    const result = schema.validate(z.number().positive(), -123);
    assert(!result.success);
    expectTypeOf(result.error).toEqualTypeOf<z.ZodError>();
    expect(result.error.errors[0].message).toEqual("Number must be greater than 0");
  });
});
