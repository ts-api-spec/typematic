import { SchemaType, ApiTypeProvider } from "@typematic/core";
import { Static, TSchema } from "@sinclair/typebox";
import { TypeCompiler, TypeCheck } from "@sinclair/typebox/compiler";

export interface TypeboxProvider extends ApiTypeProvider {
  input: this["schema"] extends TSchema ? Static<this["schema"]> : never;
  output: this["schema"] extends TSchema ? Static<this["schema"]> : never;
  error: ReturnType<TypeCheck<TSchema>["Errors"]>;
  base: TSchema;
}

export const ApiTypeboxSchema: SchemaType<TypeboxProvider> = {
  validate: (schema, input) => {
    const result = TypeCompiler.Compile(schema);
    if (result.Check(input)) {
      return { success: true, data: input as any };
    } else {
      return { success: false, error: result.Errors(input) };
    }
  },
  validateAsync: async (schema, input) => {
    const result = TypeCompiler.Compile(schema);
    if (result.Check(input)) {
      return { success: true, data: input as any };
    } else {
      return { success: false, error: result.Errors(input) };
    }
  },
};
