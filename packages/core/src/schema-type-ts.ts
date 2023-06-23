import { SchemaValidationResult, ApiTypeProvider, SchemaType } from "./schema-type.types";

const genericTsSchema = {
  parse: (data: unknown): SchemaValidationResult<any> => ({
    success: true,
    data,
  }),
};

type TsSchema<Schema> = {
  readonly _schema: Schema;
  parse: (input: unknown) => SchemaValidationResult<Schema>;
};

/**
 * A basic typescript schema provider that does not do any validation but provides type inference
 * @returns - a schema that can be used with the `tsTypeProvider`
 */
export const tsSchema = <Schema>(): TsSchema<Schema> => genericTsSchema as any;
/**
 * An advanced typescript schema provider where the schema is inferred from the
 * output type of the throwing validation function
 * @param throwingValidator - a function that throws if the input is invalid and returns the output type if the input is valid
 * @returns - a schema that can be used with the `tsTypeProvider`
 */
export const tsFnSchema = <Schema>(throwingValidator: (data: unknown) => Schema): TsSchema<Schema> => ({
  _schema: undefined as Schema,
  parse: (data: unknown): SchemaValidationResult<Schema> => {
    try {
      return {
        success: true,
        data: throwingValidator(data),
      };
    } catch (error) {
      return {
        success: false,
        error,
      };
    }
  },
});

export interface TsTypeProvider extends ApiTypeProvider<{ _schema: unknown }> {
  input: this["schema"]["_schema"];
  output: this["schema"]["_schema"];
  error: never;
  base: TsSchema<any>;
}

/**
 * A native typescript type provider
 * to use with the `tsSchema` and `tsFnSchema` functions
 */
export const ApiTypeScriptSchema: SchemaType<TsTypeProvider> = {
  validate: (schema, input) => schema.parse(input) as any,
  validateAsync: (schema, input) => schema.parse(input) as any,
};
