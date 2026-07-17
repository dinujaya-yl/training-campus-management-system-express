import type { Course } from "../models/course.model.js";
import type { Enrollment } from "../models/enrollment.model.js";
import type { User } from "../models/user.model.js";

export interface CourseServices {
    getAllCourses():Promise<Course[]>,
    getCourseById(id:string | undefined):Promise<Course | null>,
    getEnrollmentByStudentAndId(student: string | undefined, course: string | undefined): Promise<Enrollment | null>,
    registerCourse(user: Partial<User>,course:Partial<Enrollment>, reservationID: string):Promise<Enrollment>,
    addNewCourse(course: Partial<Course>): Promise<Course | null>,
    updateCourseById(id:string, update:Partial<Course>):Promise<Course | null>,
    deleteCourseById(id:string):Promise<Course | null>,
    unenrollStudent(enrollmentId: string):Promise<Enrollment | null>
}