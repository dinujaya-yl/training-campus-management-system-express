import type { NextFunction, Request , Response } from 'express';
import type { JwtPayload} from 'jsonwebtoken';
import jwt from 'jsonwebtoken';
import type { AuthenticatedRequest } from "../types/express.js";
import type { User } from '../models/user.model.js';

interface UserParams {
    id: string
}

export class AuthController {

    protect = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
        try {
            //
            let token;

            if ( req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
                token = req.headers.authorization.split(' ')[1];
            }

            if (!token) {
                res.status(401);
                throw Error('Not logged in. Please log in to get access!');
            }
            const SECRET_KEY = process.env.JWT_SECRET || '12345678901234567890123456789012';
            // console.log('Secret: ', SECRET_KEY);
            const decoded = jwt.verify(token, SECRET_KEY) as JwtPayload & { id: string, role: string };
            // console.log('Decoded: ', decoded);

            const currentUser: Partial<User> = {
                id: decoded.id,
                role: decoded.role
            };
            req.user = currentUser;
            
            next();


        } catch(err) {
            next(err);
        }
    };

    restrictTo = (...roles: string[]) => {
    return (
        req: AuthenticatedRequest,
        res: Response,
        next: NextFunction
    ) => {
        try {
            if (roles.includes('self')) {
                if (req.user?.id === req.params.id) {
                    // pass
                } else if (!req.user?.role || !roles.includes(req.user.role)) {
                    throw new Error('Not Permitted. Restricted data!');
                } else {
                    //pass
                }
            } else if (!req.user?.role || !roles.includes(req.user.role)) {
                throw new Error('Not authenticated for the permitted role!');
            }
        next();
    } catch(err) {
        next(err);
    }
    };
};
}