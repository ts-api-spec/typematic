import { SchemaType, ApiTypeProvider } from "@typematic/core";
import { Type } from "arktype";

export interface ArkTypeProvider extends ApiTypeProvider<Type> {
  input: this["schema"]["inferIn"];
  output: this["schema"]["infer"];
}

export const ApiArktypeSchema: SchemaType<ArkTypeProvider> = {
  validate: (schema, input) => {
    const result = (schema as Type)(input);
    if (result.problems) {
      return { success: false, error: new Error(result.problems.summary) };
    } else {
      return { success: true, data: result.data };
    }
  },
  validateAsync: async (schema, input) => {
    const result = (schema as Type)(input);
    if (result.problems) {
      return { success: false, error: new Error(result.problems.summary) };
    } else {
      return { success: true, data: result.data };
    }
  },
};
