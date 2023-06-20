import { describe, it, expect, expectTypeOf } from "vitest";
import * as S from "@effect/schema/Schema";
import { pipe } from "@effect/data/Function";

import { ApiEffectSchema } from "./index";
import { error } from "console";

describe("ApiEffectSchema", () => {
  it("should validate schema", () => {
    const schema = ApiEffectSchema;
    const result = schema.validate(pipe(S.number, S.positive()), 123);
    expect(result).toEqual({ success: true, data: 123 });
  });

  it("should validate schema async", async () => {
    const schema = ApiEffectSchema;
    const result = await schema.validateAsync(pipe(S.number, S.positive()), 123);
    expect(result).toEqual({ success: true, data: 123 });
  });

  it("should not validate schema with invalid input", () => {
    const schema = ApiEffectSchema;
    const result = schema.validate(pipe(S.number, S.positive()), -123);
    expect(result).toMatchObject({
      success: false,
      error: expect.objectContaining({ message: expect.stringContaining("Expected a positive number, actual -123") }),
    });
  });
});
