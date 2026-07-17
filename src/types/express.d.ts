import { Request } from 'express';
import { ParamsDictionary } from 'express-serve-static-core'; 
import type { User } from '../models/user.model.js';

export interface AuthenticatedRequest<P= ParamsDictionary> extends Request<P> {
    user?: Partial<User> | null;
}

declare global {
    namespace Express {
        interface Request {
            validatedQuery?: unknown
        }
    }
}