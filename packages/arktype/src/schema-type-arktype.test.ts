import { describe, it, expect, expectTypeOf } from "vitest";
import { type } from "arktype";

import { ApiArktypeSchema } from "./index";

describe("ApiEffectSchema", () => {
  it("should validate schema", () => {
    const schema = ApiArktypeSchema;
    const result = schema.validate(type("number>=0"), 123);
    expect(result).toEqual({ success: true, data: 123 });
  });

  it("should validate schema async", async () => {
    const schema = ApiArktypeSchema;
    const result = await schema.validateAsync(type("number>=0"), 123);
    expect(result).toEqual({ success: true, data: 123 });
  });

  it("should not validate schema with invalid input", () => {
    const schema = ApiArktypeSchema;
    const result = schema.validate(type("number>=0"), -123);
    expect(result).toMatchObject({
      success: false,
      error: expect.objectContaining({ message: expect.stringContaining("Must be at least 0 (was -123)") }),
    });
  });
});
