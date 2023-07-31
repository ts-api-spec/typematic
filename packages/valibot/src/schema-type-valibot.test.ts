import { describe, it, expect, assert, expectTypeOf } from "vitest";
import { number, minValue, ValiError } from "valibot";

import { ApiValibotSchema } from "./index";

describe("ApiValibotSchema", () => {
  it("should validate schema", () => {
    const schema = ApiValibotSchema;
    const result = schema.validate(number([minValue(1)]), 123);
    assert(result.success);
    expectTypeOf(result.data).toEqualTypeOf<number>();
    expect(result).toEqual({ success: true, data: 123 });
  });

  it("should validate schema async", async () => {
    const schema = ApiValibotSchema;
    const result = await schema.validateAsync(number([minValue(1)]), 123);
    assert(result.success);
    expectTypeOf(result.data).toEqualTypeOf<number>();
    expect(result).toEqual({ success: true, data: 123 });
  });

  it("should not validate schema with invalid input", () => {
    const schema = ApiValibotSchema;
    const result = schema.validate(number([minValue(1)]), -123);
    assert(!result.success);
    expectTypeOf(result.error).toEqualTypeOf<ValiError>();
    expect(result.error.message).toEqual("Invalid value");
  });
});
