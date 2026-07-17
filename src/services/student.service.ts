import type { Course } from "../models/course.model.js";
import type { User } from "../models/user.model.js";

export interface StudentServices {
    getAllStudents():Promise<User[] | null>,
    getStudentById(id:string | undefined):Promise<User | null>,
    getStudentByEmail(email:string):Promise<User | null>,
    getAllEnrollmentsById(id:string | undefined): Promise<Course[] | null>,
    registerStudent(user:Partial<User>):Promise<User>,
    updateStudentById(id:string, update:Partial<User>):Promise<User | null>,
    deleteStudentById(id:string):Promise<User | null>,
    login(email:string, password:string):Promise<{ token: string; user: User }>
}