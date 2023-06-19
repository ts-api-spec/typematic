# Typematic

This is a library to define a Typescript first API spec like OpenApi.
It will allow to define API servers, endpoints, rights, auth in a declarative way

## Objectives

- define an API spec that is agnostic to validation libraries
- be feature complete with OpenApi
- make it simpler to define an API spec in Typescript
- have battle tested typescript definitions
- have battle tested typescript utility types to enable typesafe API parsing at compile time
- have a simple way to generate documentation from the spec
- allow libraries to be created on top of this spec (eg like zodios, ts-rest)

## Non Objectives

- create a new validation library
- create a new server library
- create a new client library

## Why

- OpenApi is not Typescript first and people are using code generation to generate typescript definitions
- major REST APIs frameworks are not fully typesafe (but zodios and ts-rest are paving the way)

## How

This API Spec leverage the power of typescript and especially TS HKT Trick (Higher Kinded Types) to define a spec that is agnostic to the validation library used.
