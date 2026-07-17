import type { NextFunction, Request , Response } from 'express';
import type { LecturerService } from '../services/lecturer.service.js';
import type { AuthenticatedRequest } from '../types/express.js';
// import { UserService } from './services/UserService';
// import { User } from './models/User';

interface UserParams {
    id?: string;
}

export class LecturerController {

    constructor(private lecturerService: LecturerService) {
        this.lecturerService = lecturerService;
    }

    getAllLecturers = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const users = await this.lecturerService.getAllLecturers();
            res.status(200).json(users);
        } catch(err) {
            next(err);
        }
    };

    getLecturerById = async (req: Request<UserParams>, res: Response, next: NextFunction) => {
        try {
            const user = await this.lecturerService.getLecturerById(req.params.id);
            res.status(200).json(user);
        } catch(err) {
            next(err);
        }
    };

    getOwnedCourses = async (req:Request<UserParams>, res: Response, next: NextFunction) => {
        try {
            const courses = await this.lecturerService.getOwnedCourses(req.params.id);
            res.status(200).json(courses);
        } catch(err) {
            next(err);
        }
    };
}
