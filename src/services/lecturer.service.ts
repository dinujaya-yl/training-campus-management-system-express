import type { User } from "../models/user.model.js";
import type { Course } from "../models/course.model.js";

export interface LecturerService {
    getAllLecturers():Promise<User[] | null>,
    getLecturerById(id:string | undefined):Promise<User | null>,
    getLecturerByEmail(email: string): Promise<User | null>,
    getOwnedCourses(id: string | undefined): Promise<Course[] | null>;
    registerLecturer(user:Partial<User>):Promise<User>,
    updateLecturerById(id:string, update:Partial<User>):Promise<User | null>,
    deleteLecturerById(id:string):Promise<User | null>
    // login(email:string, password:string):Promise<{ token: string; user: User }>
}