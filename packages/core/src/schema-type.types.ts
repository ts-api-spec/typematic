/**
 * Type Provider for HKT (Higher Kinded Types) in TypeScript
 * @param Schema - The schema type to resolve into native typescript types
 */
export interface ApiTypeProvider<Schema = unknown> {
  /**
   * The schema type to resolve into native typescript types
   */
  schema: Schema;
  /**
   * placeholder for resolved input type from the schema
   */
  input: unknown;
  /**
   * placeholder for resolved output type from the schema
   */
  output: unknown;
  /**
   * placeholder for resolved error type from the schema
   */
  error: any;

  /**
   * placeholder for schema base type
   */
  base: any;
}

/**
 * Infer the input type from a schema using the type provider
 * @param TypeProvider - The type provider to use to resolve the schema
 * @param Schema - The schema to resolve
 * @returns - the typescript input type for the provided schema
 */
export type InferInputTypeFromSchema<TypeProvider extends ApiTypeProvider, Schema> = (TypeProvider & {
  schema: Schema;
})["input"];

/**
 * Infer the output type from a schema using the type provider
 * @param TypeProvider - The type provider to use to resolve the schema
 * @param Schema - The schema to resolve
 * @returns - the typescript output type for the provided schema
 */
export type InferOutputTypeFromSchema<TypeProvider extends ApiTypeProvider, Schema> = (TypeProvider & {
  schema: Schema;
})["output"];

/**
 * Error type generated when an input is not validated against a schema
 */
export type SchemaValidationError<TypeProvider extends ApiTypeProvider> = TypeProvider["error"];

/**
 * Base type of all schemas from a type provider
 */
export type SchemaBaseType<TypeProvider extends ApiTypeProvider> = TypeProvider["base"];

/**
 * Interface for runtime schema validation
 * This is used as a common return type for all schema validation adapters
 */
export type SchemaValidationResult<Schema, TypeProvider extends ApiTypeProvider = ApiTypeProvider> =
  | { success: true; data: InferOutputTypeFromSchema<TypeProvider, Schema> }
  | { success: false; error: SchemaValidationError<TypeProvider> };

/**
 * Schema Type interface
 * It's used to define a schema validation adapter for both compile time and runtime
 *
 * _provider is undefined at runtime, it's used to old the type provider at compile time
 *
 * @param TypeProvider - The type provider for the schema type
 */
export interface SchemaType<TypeProvider extends ApiTypeProvider = ApiTypeProvider> {
  readonly _provider?: TypeProvider;
  validate: <Schema extends SchemaBaseType<TypeProvider>>(
    schema: Schema,
    input: unknown
  ) => SchemaValidationResult<Schema, TypeProvider>;
  validateAsync: <Schema extends SchemaBaseType<TypeProvider>>(
    schema: Schema,
    input: any
  ) => Promise<SchemaValidationResult<Schema, TypeProvider>>;
}
