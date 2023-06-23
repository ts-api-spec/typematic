import { describe, it, expect, expectTypeOf } from "vitest";
import { Type } from "@sinclair/typebox";

import { ApiTypeboxSchema } from "./index";

describe("ApiEffectSchema", () => {
  it("should validate schema", () => {
    const schema = ApiTypeboxSchema;
    const result = schema.validate(Type.Number({ minimum: 0 }), 123);
    expect(result).toEqual({ success: true, data: 123 });
  });

  it("should validate schema async", async () => {
    const schema = ApiTypeboxSchema;
    const result = await schema.validateAsync(Type.Number({ minimum: 0 }), 123);
    expect(result).toEqual({ success: true, data: 123 });
  });

  it("should not validate schema with invalid input", () => {
    const schema = ApiTypeboxSchema;
    const result = schema.validate(Type.Number({ minimum: 0 }), -123);
    expect(result).toMatchObject({
      success: false,
      error: expect.objectContaining({
        message: expect.stringContaining("Expected number to be greater or equal to 0"),
      }),
    });
  });
});
