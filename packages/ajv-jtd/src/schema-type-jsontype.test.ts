import { describe, it, expect, expectTypeOf } from "vitest";

import { ApiJsonTypeSchema } from "./index";

describe("ApiJsonTypeSchema", () => {
  it("should validate schema", () => {
    const schema = ApiJsonTypeSchema;
    const result = schema.validate(
      {
        type: "uint32",
      },
      123
    );
    expect(result).toEqual({ success: true, data: 123 });
  });

  it("should validate schema async", async () => {
    const schema = ApiJsonTypeSchema;
    const result = await schema.validateAsync(
      {
        type: "uint32",
      },
      123
    );
    expect(result).toEqual({ success: true, data: 123 });
  });

  it("should not validate schema with invalid input", () => {
    const schema = ApiJsonTypeSchema;
    const result = schema.validate(
      {
        type: "uint32",
      },
      -123
    );
    expect(result).toMatchObject({
      success: false,
      error: expect.arrayContaining([
        {
          instancePath: "",
          keyword: "type",
          message: "must be uint32",
          params: {
            nullable: false,
            type: "uint32",
          },
          schemaPath: "/type",
        },
      ]),
    });
  });
});
