import { describe, it, expect, assert, expectTypeOf } from "vitest";
import { TSchema, Type } from "@sinclair/typebox";

import { ApiTypeboxSchema } from "./index";
import { TypeCheck } from "@sinclair/typebox/compiler";

describe("ApiTypeboxSchema", () => {
  it("should validate schema", () => {
    const schema = ApiTypeboxSchema;
    const result = schema.validate(Type.Number({ minimum: 0 }), 123);
    assert(result.success);
    expectTypeOf(result.data).toEqualTypeOf<number>();
    expect(result).toEqual({ success: true, data: 123 });
  });

  it("should validate schema async", async () => {
    const schema = ApiTypeboxSchema;
    const result = await schema.validateAsync(Type.Number({ minimum: 0 }), 123);
    assert(result.success);
    expectTypeOf(result.data).toEqualTypeOf<number>();
    expect(result).toEqual({ success: true, data: 123 });
  });

  it("should not validate schema with invalid input", () => {
    const schema = ApiTypeboxSchema;
    const result = schema.validate(Type.Number({ minimum: 0 }), -123);
    assert(!result.success);
    expectTypeOf(result.error).toEqualTypeOf<ReturnType<TypeCheck<TSchema>["Errors"]>>();
    expect(result.error.First()?.message).toBe("Expected number to be greater or equal to 0");
  });
});
