import { describe, it, expect, expectTypeOf, assert } from "vitest";
import * as t from "io-ts";

import { ApiIoTsSchema } from "./index";

describe("ApiIoTsSchema", () => {
  it("should validate schema", () => {
    const schema = ApiIoTsSchema;
    const result = schema.validate(t.number, 123);
    assert(result.success);
    expectTypeOf(result.data).toEqualTypeOf<number>();
    expect(result).toEqual({ success: true, data: 123 });
  });

  it("should validate schema async", async () => {
    const schema = ApiIoTsSchema;
    const result = await schema.validateAsync(t.number, 123);
    assert(result.success);
    expectTypeOf(result.data).toEqualTypeOf<number>();
    expect(result).toEqual({ success: true, data: 123 });
  });

  it("should not validate schema with invalid input", () => {
    const schema = ApiIoTsSchema;
    const result = schema.validate(t.number, "hello");
    assert(!result.success);
    expectTypeOf(result.error).toEqualTypeOf<t.Errors>;
    expect(result.error).toBeDefined();
  });
});
