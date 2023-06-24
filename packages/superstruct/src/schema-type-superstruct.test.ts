import { describe, it, expect, assert, expectTypeOf } from "vitest";
import * as S from "superstruct";

import { ApiSuperstructSchema } from "./index";

describe("ApiEffectSchema", () => {
  it("should validate schema", () => {
    const schema = ApiSuperstructSchema;
    const result = schema.validate(S.min(S.number(), 1), 123);
    assert(result.success);
    expectTypeOf(result.data).toEqualTypeOf<number>();
    expect(result).toEqual({ success: true, data: 123 });
  });

  it("should validate schema async", async () => {
    const schema = ApiSuperstructSchema;
    const result = await schema.validateAsync(S.min(S.number(), 1), 123);
    assert(result.success);
    expectTypeOf(result.data).toEqualTypeOf<number>();
    expect(result).toEqual({ success: true, data: 123 });
  });

  it("should not validate schema with invalid input", () => {
    const schema = ApiSuperstructSchema;
    const result = schema.validate(S.min(S.number(), 0), -123);
    assert(!result.success);
    expectTypeOf(result.error).toEqualTypeOf<S.StructError>();
    expect(result.error.message).toBe("Expected a number greater than or equal to 0 but received `-123`");
  });
});
