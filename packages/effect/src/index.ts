import { SchemaType, ApiTypeProvider } from "@typematic/core";
import { parseEither, type To, type From } from "@effect/schema/Schema";
import { formatErrors } from "@effect/schema/TreeFormatter";
import * as E from "@effect/data/Either";

export interface EffectTypeProvider
  extends ApiTypeProvider<{
    readonly From: (...args: unknown[]) => unknown;
    readonly To: (...args: unknown[]) => unknown;
  }> {
  input: From<this["schema"]>;
  output: To<this["schema"]>;
}

export const ApiEffectSchema: SchemaType<EffectTypeProvider> = {
  validate: (schema, input) => {
    const result = parseEither(schema)(input);
    if (E.isRight(result)) {
      return { success: true, data: result.right };
    } else {
      return { success: false, error: new Error(formatErrors(result.left.errors)) };
    }
  },
  validateAsync: async (schema, input) => {
    const result = parseEither(schema)(input);
    if (E.isRight(result)) {
      return { success: true, data: result.right };
    } else {
      return { success: false, error: result.left };
    }
  },
};
