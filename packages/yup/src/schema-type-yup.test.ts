import { describe, it, expect, assert, expectTypeOf } from "vitest";
import * as y from "yup";

import { ApiZodSchema } from "./index";

describe("ApiEffectSchema", () => {
  it("should validate schema", () => {
    const schema = ApiZodSchema;
    const result = schema.validate(y.number().positive().required(), 123);
    assert(result.success);
    expectTypeOf(result.data).toEqualTypeOf<number>();
    expect(result).toEqual({ success: true, data: 123 });
  });

  it("should validate schema async", async () => {
    const schema = ApiZodSchema;
    const result = await schema.validateAsync(y.number().positive().required(), 123);
    assert(result.success);
    expectTypeOf(result.data).toEqualTypeOf<number>();
    expect(result).toEqual({ success: true, data: 123 });
  });

  it("should not validate schema with invalid input", () => {
    const schema = ApiZodSchema;
    const result = schema.validate(y.number().positive().required(), -123);
    assert(!result.success);
    expectTypeOf(result.error).toEqualTypeOf<y.ValidationError>();
    expect(result.error.errors[0]).toEqual("this must be a positive number");
  });
});
