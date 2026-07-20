import UserRepository from "../../repositories/user.repository.js";
import type { User } from "../../models/user.model.js";
import type { StudentServices } from "../student.service.js";
import bcrypt from 'bcrypt';
import generateToken from "../../utils/generateToken.util.js";
import type { Course } from "../../models/course.model.js";
// import courseRepository from "../../repositories/course.repository";
// import enrollmentModel from "../../models/enrollment.model";
import enrollmentRepository from "../../repositories/enrollment.repository.js";
import { ConflictError, UnauthorizedError, ValidationError } from "../../errors/http.errors.js";
// import type { Enrollment } from "../../models/enrollment.model.js";
// import { comparedPassword, hashPassword } from "../../config/bcrypt";
// import generateToken from "../../util/generateToken";


class StudentServicesImpl implements StudentServices {

    async  getAllStudents(): Promise<User[] | null> {
        return UserRepository.findByRole('student');
    }

    async  getStudentById(id: string): Promise<User | null> {
        return UserRepository.findById(id);
    }

    async  getStudentByEmail(email: string): Promise<User | null> {
        return UserRepository.findByEmail(email);
    }
    
    async getAllEnrollmentsById(id: string | undefined): Promise< Course[] | null> {
        if (!id) {
            throw new Error('ID not valid!!')
        }
        const courses = enrollmentRepository.getCoursesByStudentId(id);
        
        return courses;
    }

    async registerStudent (user: Partial<User>): Promise<User>{

        const student = {
                ...user,
                role: 'student'
            };
        
        const existingStudent = await UserRepository.findByEmail(student.email!);

        if (existingStudent) {
            throw new ConflictError('Email already in use');
        }

        // user.password = await hashPassword(user.password!);
        return UserRepository.register(student);
    };

     async login(email: string, password: string): Promise<{ token: string, user: User }> {
        const user = await UserRepository.findByEmail(email);
        if (!user) {
            throw new ValidationError('Invalid email or password');
        }

        const isPasswordValid = await bcrypt.compare(password, user.password || 'no password')

        // const isPasswordValid = await comparedPassword(password, user.password);
        if (!isPasswordValid) {
            throw new UnauthorizedError('Invalid email or password');
        }

        const token = await generateToken(user.id, user.role);

        const { password: _, ...userWithoutPassword } = user.toObject();

        return {token, user:userWithoutPassword};
    }

    async updateStudentById(id: string, update: Partial<User>): Promise<User| null> {
        
        // if(update.password){
        //     update.password = await hashPassword(update.password)
        // }
        return UserRepository.updateById(id, update)
    }

    async deleteStudentById(id: string): Promise< User | null> {
        return UserRepository.deleteById(id)
    }
    
}

export default new StudentServicesImpl();