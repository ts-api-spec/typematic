import { SchemaType, ApiTypeProvider } from "@typematic/core";
import Ajv, { AnySchema, JTDDataType, ErrorObject } from "ajv/dist/jtd";

const ajv = new Ajv();

export interface JsonTypeProvider extends ApiTypeProvider<AnySchema> {
  input: JTDDataType<this["schema"]>;
  output: JTDDataType<this["schema"]>;
  error: ErrorObject[];
  base: AnySchema;
}

export const ApiJsonTypeSchema: SchemaType<JsonTypeProvider> = {
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
