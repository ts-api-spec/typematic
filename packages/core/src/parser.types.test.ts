import { describe, it, expectTypeOf } from "vitest";
import type { ApiPathToParams } from "./parser.types";

describe("ApiPathToParams", () => {
  it("should parse path with path params", () => {
    type Test = ApiPathToParams<"/users/:id/posts/:postId">;
    //    ^?
    expectTypeOf<Test>().toEqualTypeOf<["id", "postId"]>();
  });

  it("should parse path with no path params", () => {
    type Test = ApiPathToParams<"/users">;
    //    ^?
    expectTypeOf<Test>().toEqualTypeOf<[]>();
  });

  it("should parse path with path params in query params", () => {
    type Test = ApiPathToParams<"/users?test=:test">;
    //    ^?
    expectTypeOf<Test>().toEqualTypeOf<["test"]>();
  });

  it("should parse path with path params in hash params", () => {
    type Test = ApiPathToParams<"/users#/test=:test">;
    //    ^?
    expectTypeOf<Test>().toEqualTypeOf<["test"]>();
  });

  it("should parse path with path params in parenthesis", () => {
    type Test = ApiPathToParams<"/users/:id/posts/:postId/:test(test)?test2=(:hello&:world)">;
    //    ^?
    expectTypeOf<Test>().toEqualTypeOf<["id", "postId", "test", "hello", "world"]>();
  });

  it("should parse path with path params in query and hash params", () => {
    type Test = ApiPathToParams<"/users?test=:test#/test2=:test2">;
    //    ^?
    expectTypeOf<Test>().toEqualTypeOf<["test", "test2"]>();
  });

  it("should parse path with path params in query and hash params and path params", () => {
    type Test = ApiPathToParams<"/users/:id?test=:test#/test2=:test2">;
    //    ^?
    expectTypeOf<Test>().toEqualTypeOf<["id", "test", "test2"]>();
  });

  it("should parse path with many path params in query and hash params and path params", () => {
    type Test = ApiPathToParams<"/users/:id?test[]=:test&test2=:test2#/test3/:test3">;
    //    ^?
    expectTypeOf<Test>().toEqualTypeOf<["id", "test", "test2", "test3"]>();
  });

  it("should parse path with many params following each other", () => {
    type Test = ApiPathToParams<"/users/:id:otherId">;
    //    ^?
    expectTypeOf<Test>().toEqualTypeOf<["id", "otherId"]>();
  });
});
