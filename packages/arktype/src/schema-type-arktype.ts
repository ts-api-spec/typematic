import { SchemaType, ApiTypeProvider } from "@typematic/core";
import { Type, Problems } from "arktype";

export interface ArkTypeProvider extends ApiTypeProvider<Type> {
  input: this["schema"]["inferIn"];
  output: this["schema"]["infer"];
  error: Problems;
  base: Type;
}

export const ApiArktypeSchema: SchemaType<ArkTypeProvider> = {
  validate: (schema, input) => {
    const result = schema(input);
    if (result.problems) {
      return { success: false, error: result.problems };
    } else {
      return { success: true, data: result.data as any };
    }
  },
  validateAsync: async (schema, input) => {
    const result = schema(input);
    if (result.problems) {
      return { success: false, error: result.problems };
    } else {
      return { success: true, data: result.data as any };
    }
  },
};
