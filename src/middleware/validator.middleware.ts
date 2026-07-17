import type { Request, Response, NextFunction, RequestHandler } from "express";
import { ZodError } from "zod";
import type { ZodType, ZodTypeAny, z } from "zod";

type ValidationSchemas = {
  body?: ZodTypeAny;
  query?: ZodTypeAny;
  params?: ZodTypeAny;
};

declare global {
  namespace Express {
    interface Request {
      validatedBody?: unknown;
      validatedQuery?: unknown;
      validatedParams?: unknown;
    }
  }
}

export function validate(schemas: ValidationSchemas): RequestHandler {
    return (req: Request, res: Response, next: NextFunction) => {
        try {

            if (schemas.body) {
                req.body = schemas.body.parse(req.body);
            } 
            if (schemas.query) {
                const parsed = schemas.query.parse(req.query);

                Object.keys(req.query).forEach((key) => delete (req.query as any)[key]);
                Object.assign(req.query, parsed);
                req.query = schemas.query.parse(req.query) as any;
            } 
            if (schemas.params) {
                const parsed = schemas.params.parse(req.params);

                Object.assign(req.params, parsed)
            }

            next();

        } catch (err) {

            if (err instanceof ZodError) {
                return res.status(400).json({
                    error: 'Validation failed',
                    details: err.issues.map((issue) => ({
                        path: issue.path.join('.'),
                        message: issue.message
                    }))
                })
            }
            next(err)

        }
    }
}