import type { NextFunction, Request , Response } from 'express';
import { CreateUserSchema, type CreateUserInput } from '../schemas/user.schema.js';
import type { StudentServices } from '../services/student.service.js';
import generateToken from '../utils/generateToken.util.js';
import type { AuthenticatedRequest } from '../types/express.js';
import type { TypedRequest } from '../types/typed-request.js';
import { NotFoundError, ValidationError } from '../errors/http.errors.js';
// import { UserService } from './services/UserService';
// import { User } from './models/User';

interface UserParams {
    id?: string;
}

export class StudentController {

    constructor(private studentServices: StudentServices) {}

    getAllStudents = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const users = await this.studentServices.getAllStudents();
            res.status(200).json(users);
        } catch(err) {
            next(err);
        }
    };

    getSelfDetails = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
        try {
            const mySelf = await this.studentServices.getStudentById(req.user?.id);

            if (!mySelf) {
                throw new NotFoundError('Your profile not found!')
                // res.status(404).send('Your profile not found!');
            } else {
                res.status(200).json(mySelf);
            }
        } catch(err) {
            next(err)
        }
    }

    getStudentById = async (req: Request<UserParams>, res: Response, next: NextFunction) => {
        try {
            const user = await this.studentServices.getStudentById(req.params.id);
            
            if (user == null) {
                throw new NotFoundError('Student not found!');
            } else {
                res.status(200).json(user);
            }

        } catch(err) {
            next(err);
        }
    };

    getEnrolledCourses = async (req:Request<UserParams>, res: Response, next: NextFunction) => {
        // build this after 
        try {
            const courses = await this.studentServices.getAllEnrollmentsById(req.params.id);
            res.status(200).json(courses);

        } catch(err) {
            next(err)
        }
    };

    getSelfCourses = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
        try {
            const myCourses = await this.studentServices.getAllEnrollmentsById(req.user?.id);
            res.status(200).json(myCourses);
        } catch(err) {
            next(err)
        }
    }

    registerStudent = async (req: Request<{}, {}, CreateUserInput>, res: Response, next: NextFunction) => {
        // const user = .await this.studentService.registerStudent(req.body);
        // res.send(`Registered user. ID: ${user.id}`);
        try {
            const{name, email, password} = req.body;

            if (!email || !password) {
                throw new ValidationError('Email and Password Required!')
            }

            const newUser = await this.studentServices.registerStudent({
                name: name,
                email: email,
                password: password,
            });

            newUser.password = undefined;

            const token = await generateToken(newUser.id, 'student');
            
            // TODO: Implement cookie after learning

            res.status(201).json({
                status: 'success',
                token,
                data: {
                    newUser
                }
            });
            
        } catch(err:any) {
            if (err.message === 'Email already in use') {
                res.status(400);
            };
            next(err);
        }
    };

    login = async(req:Request, res: Response, next: NextFunction) => {
        try {
            const {email, password} = req.body;
            
            if (!email || !password) {
                res.status(400);
                throw new Error('All fields required!');
            }

            const {token, user} = await this.studentServices.login(email, password);

            // TODO: Implement cookies

            res.status(200).json({
                token,
                message: 'Login successful',
                data: user
            })

        } catch (err: any) {
            if (err.message === 'Invalid email or password') {
                res.status(401)
            }
            next(err)
        }
    } 

}
