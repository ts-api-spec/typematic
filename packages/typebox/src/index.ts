import { SchemaType, ApiTypeProvider } from "@typematic/core";
import { Static, TSchema } from "@sinclair/typebox";
import { TypeCompiler } from "@sinclair/typebox/compiler";

export interface TypeboxProvider extends ApiTypeProvider {
  input: this["schema"] extends TSchema ? Static<this["schema"]> : never;
  output: this["schema"] extends TSchema ? Static<this["schema"]> : never;
}

export const ApiTypeboxSchema: SchemaType<TypeboxProvider> = {
  validate: (schema, input) => {
    const result = TypeCompiler.Compile(schema);
    if (result.Check(input)) {
      return { success: true, data: input };
    } else {
      return { success: false, error: new Error(result.Errors(input).First()?.message) };
    }
  },
  validateAsync: async (schema, input) => {
    const result = TypeCompiler.Compile(schema);
    if (result.Check(input)) {
      return { success: true, data: input };
    } else {
      return { success: false, error: new Error(result.Errors(input).First()?.message) };
    }
  },
};
