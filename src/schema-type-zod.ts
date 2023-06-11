import { SchemaType, ApiTypeProvider } from "./schema-type.types";

export interface ZodTypeProvider
  extends ApiTypeProvider<{ _input: unknown; _output: unknown }> {
  input: this["schema"]["_input"];
  output: this["schema"]["_output"];
}

export const ApiZodSchema: SchemaType<ZodTypeProvider> = {
  validate: (schema, input) => schema.safeParse(input),
  validateAsync: (schema, input) => schema.safeParseAsync(input),
};
