import type { Course } from "../../models/course.model.js";
import type { CourseServices } from "../course.service.js";
import courseRepository from "../../repositories/course.repository.js";
import enrollmentRepository from "../../repositories/enrollment.repository.js";
import type { User } from "../../models/user.model.js";
import type { Enrollment } from "../../models/enrollment.model.js";
import { ConflictError, ValidationError } from "../../errors/http.errors.js";
// import type { networkInterfaces } from "os";
// import { comparedPassword, hashPassword } from "../../config/bcrypt";
// import generateToken from "../../util/generateToken";



class CourseServicesImpl implements CourseServices {

    async  getAllCourses(): Promise<Course[]> {
        return courseRepository.findAll();
    }

    async  getCourseById(id: string): Promise<Course | null> {
        return courseRepository.findById(id);
    }

    async getEnrollmentByStudentAndId(student: string | undefined, course: string | undefined): Promise<Enrollment | null> {
        if (student && course) {
            return enrollmentRepository.findByStudentAndCourse(student, course);
        } else {
            throw new ValidationError('Invalid course ID');
        }
        
    }

    async registerCourse (user: Partial<User>,course: Partial<Enrollment>, reservationID: string): Promise<Enrollment>{

        if (user.id && course.id ) {
            const enrolledStudents = await enrollmentRepository.getEnrolledStudents(course.id);
            const courseData = await courseRepository.findById(course.id);
            // console.log('Course limit of students: ', courseData);

            if (courseData?.max_students && courseData?.max_students <= enrolledStudents) {
                throw new ConflictError('Maximum seat limit exceeded!');
            };

            const isRegistered = await enrollmentRepository.checkDuplicateEnrollment(user.id, course.id);
            // console.log('Is Registered: ', )
            if (isRegistered) {
                throw new ConflictError('User already registered for the course!');
            }

            await courseRepository.reserveSeat(course.id, user.id, reservationID);

            let enrollment : Enrollment;

            try {
                enrollment = await enrollmentRepository.register({student: user.id, course: course.id, reservationId: reservationID})

            } catch (err) {
                await courseRepository.releaseSeat(course.id, reservationID);
                throw new ConflictError('Could not find a seat!')

            }

            await courseRepository.confirmSeat(course.id, reservationID)

            // console.log('Student and course id: ', user.id)
            return enrollment
        } else {
            throw new ValidationError('Invalid user or course ID')
        }
        
        
    };

    async updateCourseById(id: string, update: Partial<Course>): Promise<Course| null> {
        return courseRepository.updateById(id, update)
    }

    async deleteCourseById(id: string): Promise< Course | null> {
        return courseRepository.deleteById(id)
    }

    async unenrollStudent(enrollmentId: string) {
        return enrollmentRepository.deleteById(enrollmentId);
    }

    async addNewCourse(course: Partial<Course>): Promise<Course | null> {
        return courseRepository.register(course);
    }
    
}

export default new CourseServicesImpl();