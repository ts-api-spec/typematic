import { describe, it, expect, expectTypeOf, assert } from "vitest";
import * as S from "@effect/schema/Schema";
import { pipe } from "@effect/data/Function";
import { formatErrors } from "@effect/schema/TreeFormatter";
import { ParseError } from "@effect/schema/ParseResult";

import { ApiEffectSchema } from "./index";

describe("ApiEffectSchema", () => {
  it("should validate schema", () => {
    const schema = ApiEffectSchema;
    const result = schema.validate(pipe(S.number, S.positive()), 123);
    assert(result.success);
    expectTypeOf(result.data).toEqualTypeOf<number>();
    expect(result).toEqual({ success: true, data: 123 });
  });

  it("should validate schema async", async () => {
    const schema = ApiEffectSchema;
    const result = await schema.validateAsync(pipe(S.number, S.positive()), 123);
    assert(result.success);
    expectTypeOf(result.data).toEqualTypeOf<number>();
    expect(result).toEqual({ success: true, data: 123 });
  });

  it("should not validate schema with invalid input", () => {
    const schema = ApiEffectSchema;
    const result = schema.validate(pipe(S.number, S.positive()), -123);
    assert(!result.success);
    expectTypeOf(result.error).toEqualTypeOf<ParseError["errors"]>;
    expect(formatErrors(result.error)).toContain("Expected a positive number, actual -123");
  });
});
