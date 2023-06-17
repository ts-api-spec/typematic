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
