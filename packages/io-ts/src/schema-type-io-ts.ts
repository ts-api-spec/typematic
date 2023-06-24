import { SchemaType, ApiTypeProvider } from "@typematic/core";
import * as t from "io-ts";
import * as E from "fp-ts/lib/Either";

export interface IoTsProvider extends ApiTypeProvider {
  input: this["schema"] extends t.Any ? t.TypeOf<this["schema"]> : never;
  output: this["schema"] extends t.Any ? t.OutputOf<this["schema"]> : never;
  error: t.Errors;
  base: t.Any;
}
export const ApiIoTsSchema: SchemaType<IoTsProvider> = {
  validate: (schema, input) => {
    const result = schema.decode(input);
    if (E.isRight(result)) {
      return { success: true, data: result.right };
    } else {
      return { success: false, error: result.left };
    }
  },
  validateAsync: async (schema, input) => {
    const result = schema.decode(input);
    if (E.isRight(result)) {
      return { success: true, data: result.right };
    } else {
      return { success: false, error: result.left };
    }
  },
};
