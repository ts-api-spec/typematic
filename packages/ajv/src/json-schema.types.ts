import type { JSONType } from "ajv";

type Pretify<T> = { [K in keyof T]: T[K] } & {};

interface JSONSchemaWithType {
  readonly type: JSONType;
}

interface JSONSchemaWithTypes {
  readonly type: readonly JSONType[];
}

interface JSONSchemaNullable {
  readonly nullable: true;
}

interface JSONSchemaObjectRequired {
  readonly type: "object";
  readonly properties: {
    readonly [key: string]: AnyJSONSchema;
  };
  readonly required: readonly string[];
}

interface JSONSchemaObject {
  readonly type: "object";
  readonly properties: {
    readonly [key: string]: AnyJSONSchema;
  };
}

interface JSONSchemaArray {
  readonly type: "array";
  readonly items: AnyJSONSchema;
}

interface JSONSchemaTuple {
  readonly type: "array";
  readonly prefixItems: readonly AnyJSONSchema[];
}

interface JSONSchemaString {
  readonly type: "string";
}

interface JSONSchemaNumber {
  readonly type: "number";
}

interface JSONSchemaInteger {
  readonly type: "integer";
}

interface JSONSchemaBoolean {
  readonly type: "boolean";
}

interface JSONSchemaNull {
  readonly type: "null";
}

interface JSONSchemaEnum {
  readonly enum: readonly any[];
}

interface JSONSchemaConst {
  readonly const: any;
}

interface JSONSchemaRef {
  readonly $ref: string;
}

interface JSONSchemaAnyOf {
  readonly anyOf: readonly AnyJSONSchema[];
}

interface JSONSchemaAllOf {
  readonly allOf: readonly AnyJSONSchema[];
}

interface JSONSchemaOneOf {
  readonly oneOf: readonly AnyJSONSchema[];
}

interface JSONSchemaNot {
  readonly not: AnyJSONSchema;
}

type AnyJSONSchema =
  | JSONSchemaWithType
  | JSONSchemaWithTypes
  | JSONSchemaConst
  | JSONSchemaEnum
  | JSONSchemaRef
  | JSONSchemaAnyOf
  | JSONSchemaAllOf
  | JSONSchemaOneOf
  | JSONSchemaNot;

type JSONTypeOf<T extends JSONType> = T extends "string"
  ? string
  : T extends "number"
  ? number
  : T extends "integer"
  ? number
  : T extends "boolean"
  ? boolean
  : T extends "null"
  ? null
  : T extends "object"
  ? { [key: string | number]: unknown }
  : T extends "array"
  ? unknown[]
  : never;

type InferAllOf<T extends readonly AnyJSONSchema[], Acc = never> = T extends readonly [
  infer Head extends AnyJSONSchema,
  ...infer Tail extends readonly AnyJSONSchema[]
]
  ? [Acc] extends [never]
    ? InferAllOf<Tail, InferJsonSchema<Head>>
    : [Acc, InferJsonSchema<Head>] extends [
        infer First extends Record<string, unknown>,
        infer Second extends Record<string, unknown>
      ]
    ? InferAllOf<Tail, Pretify<First & Second>>
    : InferAllOf<Tail, Acc & InferJsonSchema<Head>>
  : Acc;

type ItemIfOneTuple<T> = T extends readonly [infer Head] ? Head : T;

type FilterNull<
  T extends readonly any[],
  Acc extends unknown[] = [],
  Match extends boolean = false
> = T extends readonly [infer Head, ...infer Tail extends readonly any[]]
  ? Head extends "null"
    ? FilterNull<Tail, Acc, true>
    : FilterNull<Tail, [...Acc, Head], Match>
  : { Acc: ItemIfOneTuple<Acc>; Match: Match };

type SetProperty<T, Key, Value> = {
  [K in keyof T]: K extends Key ? Value : T[K];
};

type InferJsonSchemaNotNull<T> = T extends AnyJSONSchema
  ? T extends JSONSchemaConst
    ? T["const"]
    : T extends JSONSchemaEnum
    ? T["enum"][number]
    : T extends JSONSchemaRef
    ? unknown
    : T extends JSONSchemaNull
    ? null
    : T extends JSONSchemaBoolean
    ? boolean
    : T extends JSONSchemaInteger | JSONSchemaNumber
    ? number
    : T extends JSONSchemaString
    ? string
    : T extends JSONSchemaAllOf
    ? InferAllOf<T["allOf"]>
    : T extends JSONSchemaOneOf
    ? T["oneOf"][number] extends infer Type extends AnyJSONSchema
      ? InferJsonSchema<Type>
      : never
    : T extends JSONSchemaAnyOf
    ? T["anyOf"][number] extends infer Type extends AnyJSONSchema
      ? InferJsonSchema<Type>
      : never
    : T extends JSONSchemaNot
    ? unknown
    : T extends JSONSchemaWithTypes
    ? T["type"][number] extends infer Type extends JSONType
      ? JSONTypeOf<Type>
      : never
    : T extends JSONSchemaObjectRequired
    ? Pretify<
        Pick<
          {
            [K in keyof T["properties"]]: InferJsonSchema<T["properties"][K]>;
          },
          T["required"][number]
        > &
          Omit<
            {
              [K in keyof T["properties"]]?: InferJsonSchema<T["properties"][K]>;
            },
            T["required"][number]
          >
      >
    : T extends JSONSchemaObject
    ? {
        [K in keyof T["properties"]]?: InferJsonSchema<T["properties"][K]>;
      }
    : T extends JSONSchemaArray
    ? InferJsonSchema<T["items"]>[]
    : T extends JSONSchemaTuple
    ? InferJsonTuple<T["prefixItems"]>
    : `Error: Not a valid Schema or not yet supported`
  : `Error: Not a valid Schema or not yet supported`;

type InferJsonTuple<T, Acc extends unknown[] = []> = T extends readonly [infer A, ...infer B]
  ? InferJsonTuple<B, [...Acc, InferJsonSchema<A>]>
  : Acc;

export type InferJsonSchema<T> = T extends JSONSchemaNullable
  ? null | InferJsonSchemaNotNull<T>
  : T extends JSONSchemaWithTypes
  ? FilterNull<T["type"]> extends { Acc: infer Type; Match: true }
    ? null | InferJsonSchemaNotNull<SetProperty<T, "type", Type>>
    : InferJsonSchemaNotNull<T>
  : InferJsonSchemaNotNull<T>;
