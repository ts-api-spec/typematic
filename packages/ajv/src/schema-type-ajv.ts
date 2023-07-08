import { SchemaType, ApiTypeProvider } from "@typematic/core";
import Ajv, { AnySchema, ErrorObject } from "ajv";
import { InferJsonSchema } from "./json-schema.types";

const ajv = new Ajv();

export interface JsonSchemaProvider extends ApiTypeProvider {
  input: InferJsonSchema<this["schema"]>;
  output: InferJsonSchema<this["schema"]>;
  error: ErrorObject[];
  base: AnySchema;
}

export const ApiJsonSchema: SchemaType<JsonSchemaProvider> = {
  validate: (schema, input) => {
    const validate = ajv.compile(schema);
    if (validate(input)) {
      return { success: true, data: input as any };
    } else {
      return { success: false, error: validate.errors! };
    }
  },
  validateAsync: async (schema, input) => {
    const validate = ajv.compile(schema);
    if (validate(input)) {
      return { success: true, data: input as any };
    } else {
      return { success: false, error: validate.errors! };
    }
  },
};
