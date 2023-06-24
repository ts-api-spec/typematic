import { SchemaType, ApiTypeProvider } from "@typematic/core";
import { Schema, InferType, ValidationError } from "yup";

export interface YupTypeProvider extends ApiTypeProvider {
  input: this["schema"] extends Schema ? InferType<this["schema"]> : never;
  output: this["schema"] extends Schema ? InferType<this["schema"]> : never;
  error: ValidationError;
  base: Schema;
}

export const ApiZodSchema: SchemaType<YupTypeProvider> = {
  validate: (schema, input) => {
    try {
      const result = schema.validateSync(input);
      return { success: true, data: result as any };
    } catch (e) {
      return { success: false, error: e as ValidationError };
    }
  },
  validateAsync: async (schema, input) => {
    try {
      const result = await schema.validate(input);
      return { success: true, data: result as any };
    } catch (e) {
      return { success: false, error: e as ValidationError };
    }
  },
};
