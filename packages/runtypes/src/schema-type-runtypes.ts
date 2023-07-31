import type { SchemaType, ApiTypeProvider } from "@typematic/core";
import type { Runtype, Static, Failure } from "runtypes";

export interface RuntypesTypeProvider extends ApiTypeProvider {
  input: this["schema"] extends Runtype ? Static<this["schema"]> : never;
  output: this["schema"] extends Runtype ? Static<this["schema"]> : never;
  error: Failure;
  base: Runtype<any>;
}

export const ApiRuntypesSchema: SchemaType<RuntypesTypeProvider> = {
  validate: (schema, input) => {
    const result = schema.validate(input);
    if (result.success) {
      return { success: true, data: result.value };
    }
    return { success: false, error: result };
  },
  validateAsync: async (schema, input) => {
    const result = schema.validate(input);
    if (result.success) {
      return { success: true, data: result.value };
    }
    return { success: false, error: result };
  },
};
