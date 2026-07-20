import type { NextFunction, Request , Response } from 'express';
import type { CourseServices } from '../services/course.service.js';
import type { AuthenticatedRequest } from '../types/express.js';
import { v4 as uuidv4 } from "uuid";
import { enqueueEnrollment, enrollmentEvents, processQueue } from '../utils/enrollment.worker.js';
import { ConflictError, TimeouttError, UnauthorizedError } from '../errors/http.errors.js';
// import { User } from '../models/user.model';
// import { UserService } from './services/UserService';
// import { User } from './models/User';

interface UserParams {
    id?: string;
}

export class CourseController {

    constructor(private courseServices: CourseServices) {
        this.courseServices = courseServices;
    }

    getAllCourses = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const courses = await this.courseServices.getAllCourses();
            res.status(200).json(courses);
        } catch(err) {
            next(err);
        }
    };

    getCourseById = async (req: Request<UserParams>, res: Response, next: NextFunction) => {
        try {
            const course = await this.courseServices.getCourseById(req.params.id);
            res.status(200).json(course);
        } catch(err) {
            next(err);

        }
    };

    addNewCourse = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const course = await this.courseServices.addNewCourse(req.body)
            res.status(200).json(course);
        } catch(err) {
            next(err)
        }
    }

    getAllEnrollments = async (req:Request<UserParams>, res: Response) => {
        res.send(`GET courses of the lecturer ${req.params.id}`);
    };

    getCourseRoster = async (req:Request<UserParams>, res: Response) => {
        res.send(`GET courses of the lecturer ${req.params.id}`);
    };

    enrollStudent = async (req:AuthenticatedRequest<UserParams>, res: Response, next: NextFunction) => {
        try {
            if (!req.user?.id || !req.params.id) {
                throw new UnauthorizedError('Please log in!');
                // res.status(401).send("Please log in!");
            } else {
                const reservationId = uuidv4();

                const courseId = req.params.id;

                await enqueueEnrollment(courseId, req.user?.id, reservationId);

                processQueue(courseId).catch((err) => console.error("Processing error: ", err));

                const result = await new Promise<{ success: boolean; message: string}>((resolve, reject) => {
                    const timer = setTimeout(() => {
                        enrollmentEvents.removeAllListeners(reservationId);
                        reject(new TimeouttError("Enrollment request timed out"));
                    }, 15000)

                    enrollmentEvents.once(reservationId, (outcome) => {
                        clearTimeout(timer),
                        resolve(outcome)
                    });
                });

                return res.status(result.success ? 200 : 409).json(result);
            }
            
        } catch(err) {
            next(err)
        }
    };

    withdrawStudent = async (req:AuthenticatedRequest<UserParams>, res: Response, next: NextFunction) => {
        try {
            const enrollment = await this.courseServices.getEnrollmentByStudentAndId(req.user?.id, req.params.id);
            if (!enrollment){
                throw new ConflictError('Can\'t withdraw from a course before enrolling');
                // throw new Error('Can\'t withdraw from a course before enrolling!')
            }
            const deleted = await this.courseServices.unenrollStudent(enrollment.id);

            res.status(204).json(deleted)
        } catch(err) {
            next(err)
        }
    };
}
