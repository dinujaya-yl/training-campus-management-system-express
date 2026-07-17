import UserRepository from "../../repositories/user.repository.js";
import courseRepository from "../../repositories/course.repository.js";
import type { User } from "../../models/user.model.js";
import type { LecturerService } from "../lecturer.service.js";
import type { Course } from "../../models/course.model.js";
// import { comparedPassword, hashPassword } from "../../config/bcrypt";
// import generateToken from "../../util/generateToken";



class LecturerServicesImpl implements LecturerService {

    async  getAllLecturers(): Promise<User[] | null> {
        return UserRepository.findByRole('lecturer');
    }

    async  getLecturerById(id: string): Promise<User | null> {
        return UserRepository.findById(id);
    }

    async  getLecturerByEmail(email: string): Promise<User | null> {
        return UserRepository.findByEmail(email);
    };
    
    async  getOwnedCourses(id: string): Promise<Course[] | null> {
        return courseRepository.findByLecturerId(id);
    }  

    async registerLecturer (user: Partial<User>): Promise<User>{

        const lecturer = {
                ...user,
                role: 'lecturer'
            };
        
        const existingUser = await UserRepository.findByEmail(lecturer.email!);
        if (existingUser) {
            throw new Error('Email already in use');
        }
        // user.password = await hashPassword(user.password!);
        return UserRepository.register(lecturer);
    };

    //  async login(email: string, password: string): Promise<{ token: string, user: User }> {
    //     const user = await userRepository.findByEmail(email);
    //     if (!user) {
    //         throw new Error('Invalid email or password');
    //     }

    //     const isPasswordValid = await comparedPassword(password, user.password);
    //     if (!isPasswordValid) {
    //         throw new Error('Invalid email or password');
    //     }

    //     const token = await generateToken(user.id)

    //     const { password: _, ...userWithoutPassword } = user.toObject();

    //     return {token, user:userWithoutPassword};
    // }

    async updateLecturerById(id: string, update: Partial<User>): Promise<User| null> {
        
        // if(update.password){
        //     update.password = await hashPassword(update.password)
        // }
        return UserRepository.updateById(id, update)
    }

    async deleteLecturerById(id: string): Promise< User | null> {
        return UserRepository.deleteById(id)
    }
    
}

export default new LecturerServicesImpl();