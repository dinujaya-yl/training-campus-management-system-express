import type { NextFunction, Request , Response } from 'express';
import { CreateUserSchema, type CreateUserInput } from '../schemas/user.schema.js';
import type { StudentServices } from '../services/student.service.js';
import generateToken from '../utils/generateToken.util.js';
import type { AuthenticatedRequest } from '../types/express.js';
import type { TypedRequest } from '../types/typed-request.js';
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
                res.status(404).send('Your profile not found!');
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
                res.status(404).json({
                    "status": "Error",
                    "message": "Student not found!"
                });
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
                res.status(400)
                throw new Error('Email and Password Required!')
            }

            // if (password != confirmPassword) {
            //     res.status(400)
            //     throw new Error('Password and confirmation should match!')
            // }

            const newUser = await this.studentServices.registerStudent({
                name: name,
                email: email,
        // res.send(`Registered user. ID: ${user.id}`);.email,
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
