export interface ApiTypeProvider<Schema = unknown> {
  schema: Schema;
  input: unknown;
  output: unknown;
}
export type InferInputTypeFromSchema<
  TypeProvider extends ApiTypeProvider,
  Schema
> = (TypeProvider & { schema: Schema })["input"];

export type InferOutputTypeFromSchema<
  TypeProvider extends ApiTypeProvider,
  Schema
> = (TypeProvider & { schema: Schema })["output"];

export type SchemaValidationResult =
  | { success: true; data: any }
  | { success: false; error: any };

export interface SchemaType<
  TypeProvider extends ApiTypeProvider = ApiTypeProvider
> {
  readonly _provider?: TypeProvider;
  validate: (schema: any, input: unknown) => SchemaValidationResult;
  validateAsync: (
    schema: any,
    input: unknown
  ) => Promise<SchemaValidationResult>;
}
