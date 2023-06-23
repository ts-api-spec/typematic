import { SchemaType, ApiTypeProvider } from "@typematic/core";
import { z } from "zod";

export interface ZodTypeProvider extends ApiTypeProvider {
  input: this["schema"] extends z.ZodTypeAny ? z.input<this["schema"]> : never;
  output: this["schema"] extends z.ZodTypeAny ? z.output<this["schema"]> : never;
  error: z.ZodError;
  base: z.ZodTypeAny;
}

export const ApiZodSchema: SchemaType<ZodTypeProvider> = {
  validate: (schema, input) => schema.safeParse(input),
  validateAsync: (schema, input) => schema.safeParseAsync(input),
};
