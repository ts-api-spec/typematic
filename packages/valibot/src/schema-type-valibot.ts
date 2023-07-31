import type { SchemaType, ApiTypeProvider } from "@typematic/core";
import type { BaseSchema, BaseSchemaAsync, Input, Output, ValiError } from "valibot";
import { safeParse, safeParseAsync } from "valibot";

export interface ValibotTypeProvider extends ApiTypeProvider {
  input: this["schema"] extends BaseSchema | BaseSchemaAsync ? Input<this["schema"]> : never;
  output: this["schema"] extends BaseSchema | BaseSchemaAsync ? Output<this["schema"]> : never;
  error: ValiError;
  base: BaseSchema | BaseSchemaAsync;
}

export const ApiValibotSchema: SchemaType<ValibotTypeProvider> = {
  validate: (schema, input) => safeParse(schema as BaseSchema, input),
  validateAsync: (schema, input) => safeParseAsync(schema, input),
};
