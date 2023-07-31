import { describe, it, expect, assert, expectTypeOf } from "vitest";
import { Failure, Number } from "runtypes";

import { ApiRuntypesSchema } from "./index";

describe("ApiZodSchema", () => {
  it("should validate schema", () => {
    const schema = ApiRuntypesSchema;
    const result = schema.validate(
      Number.withConstraint(n => n > 0 || `${n} is not positive`),
      123
    );
    assert(result.success);
    expectTypeOf(result.data).toEqualTypeOf<number>();
    expect(result).toEqual({ success: true, data: 123 });
  });

  it("should validate schema async", async () => {
    const schema = ApiRuntypesSchema;
    const result = await schema.validateAsync(
      Number.withConstraint(n => n > 0 || `${n} is not positive`),
      123
    );
    assert(result.success);
    expectTypeOf(result.data).toEqualTypeOf<number>();
    expect(result).toEqual({ success: true, data: 123 });
  });

  it("should not validate schema with invalid input", () => {
    const schema = ApiRuntypesSchema;
    const result = schema.validate(
      Number.withConstraint(n => n > 0 || `${n} is not positive`),
      -123
    );
    assert(!result.success);
    expectTypeOf(result.error).toEqualTypeOf<Failure>();
    expect(result.error.message).toEqual("Failed constraint check for number: -123 is not positive");
  });
});
