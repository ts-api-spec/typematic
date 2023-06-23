import { SchemaType, ApiTypeProvider } from "@typematic/core";
import { parseEither, type To, type From, type Schema } from "@effect/schema/Schema";
import { ParseError } from "@effect/schema/ParseResult";
import * as E from "@effect/data/Either";

export interface EffectTypeProvider extends ApiTypeProvider {
  input: this["schema"] extends Schema<any, any> ? From<this["schema"]> : never;
  output: this["schema"] extends Schema<any, any> ? To<this["schema"]> : never;
  error: ParseError["errors"];
  base: Schema<any, any>;
}
export const ApiEffectSchema: SchemaType<EffectTypeProvider> = {
  validate: (schema, input) => {
    const result = parseEither(schema)(input);
    if (E.isRight(result)) {
      return { success: true, data: result.right };
    } else {
      return { success: false, error: result.left.errors };
    }
  },
  validateAsync: async (schema, input) => {
    const result = parseEither(schema)(input);
    if (E.isRight(result)) {
      return { success: true, data: result.right };
    } else {
      return { success: false, error: result.left.errors };
    }
  },
};
