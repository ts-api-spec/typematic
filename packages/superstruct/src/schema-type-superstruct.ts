import { SchemaType, ApiTypeProvider } from "@typematic/core";
import * as S from "superstruct";

export interface SuperstructProvider extends ApiTypeProvider {
  input: this["schema"] extends S.Struct<any, any> ? S.Infer<this["schema"]> : never;
  output: this["schema"] extends S.Struct<any, any> ? S.Infer<this["schema"]> : never;
  error: S.StructError;
  base: S.Struct<any, any>;
}

export const ApiSuperstructSchema: SchemaType<SuperstructProvider> = {
  validate: (schema, input) => {
    const result = schema.validate(input);
    if (result[1]) {
      return { success: true, data: result[1] };
    } else {
      return { success: false, error: result[0]! };
    }
  },
  validateAsync: async (schema, input) => {
    const result = schema.validate(input);
    if (result[1]) {
      return { success: true, data: result[1] };
    } else {
      return { success: false, error: result[0]! };
    }
  },
};
