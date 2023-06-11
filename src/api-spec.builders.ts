import { ApiSpec } from "./api-spec.types";

export function makeApiSpec<const T extends ApiSpec>(spec: T): T {
  return spec;
}
