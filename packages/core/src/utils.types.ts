/**
 * Pretify provided type by expanding all its properties
 * @param T - The type to pretify
 * @returns - The pretified type
 */
export type Pretify<T> = { [K in keyof T]: T[K] };

/**
 * Merge two types into one
 * @param T - The first type
 * @param U - The second type, it will override the properties of the first type if they are the same
 * @returns - The merged type
 */
export type Merge<T, U> = Pretify<Omit<T, keyof U> & U>;

/**
 * Split string into a tuple, using a simple string literal separator
 * @description - This is a simple implementation of split, it does not support multiple separators
 *  A more complete implementation is built on top of this one
 * @param Str - String to split
 * @param Sep - Separator, must be a string literal not a union of string literals
 * @returns Tuple of strings
 */
export type Split<Str, Sep extends string, Acc extends string[] = []> = Str extends ""
  ? Acc
  : Str extends `${infer T}${Sep}${infer U}`
  ? Split<U, Sep, [...Acc, T]>
  : [...Acc, Str];

type ConcatSplits<Parts extends string[], Seps extends string[], Acc extends string[] = []> = Parts extends [
  infer First extends string,
  ...infer Rest extends string[]
]
  ? ConcatSplits<Rest, Seps, [...Acc, ...SplitMany<First, Seps>]>
  : Acc;

/**
 * Split a string into a tuple.
 * @param Str - The string to split.
 * @param Sep - The separators to split on, a tuple of strings with one or more characters.
 * @returns The tuple of each split. if sep is an empty string, returns a tuple of each character.
 */
export type SplitMany<Str extends string, Sep extends string[], Acc extends string[] = []> = Sep extends [
  infer FirstSep extends string,
  ...infer RestSep extends string[]
]
  ? ConcatSplits<Split<Str, FirstSep>, RestSep>
  : [Str, ...Acc];
