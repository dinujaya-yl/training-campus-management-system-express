import type { Request } from "express";
import type { z, ZodType } from "zod";
import type { AuthenticatedRequest } from "./express.js";

type RequestSchema = ZodType<{
    body?: unknown,
    query?: unknown,
    params?: unknown
}>

export type TypedRequest<T extends RequestSchema> = Request<
z.infer<T>['params'],
any,
z.infer<T>['body']
// z.infer<T> extends { query: infer Q} ? Q : {}
> & {
    validatedQuery?: z.infer<T>['query'];
};

export type AuthenticatedTypedRequest<T extends RequestSchema> = AuthenticatedRequest<
  z.infer<T>['params']
> & Pick<Request<z.infer<T>['params'], any, z.infer<T>['body'], z.infer<T>['query']>, 'body' | 'query'>;