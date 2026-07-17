import type { Course } from "../models/course.model.js";
import ENROLLMENT_MODEL from "../models/enrollment.model.js";
import type { Enrollment } from "../models/enrollment.model.js";

class EnrollmentRepository {
    async findAll(): Promise<Enrollment[]> {
        return ENROLLMENT_MODEL.find().exec();
    }

    async findById(id: string): Promise<Enrollment | null> {
        return ENROLLMENT_MODEL.findById(id).exec();
    }

    async findByStudentAndCourse(student: string, course: string): Promise<Enrollment | null> {
        return ENROLLMENT_MODEL.findOne({
            student: student,
            course: course
        })
    }

    async checkDuplicateEnrollment(user:string, course: string): Promise<Enrollment|null> {
        return ENROLLMENT_MODEL.findOne({
            student: user,
            course: course,
        })
    }

    async getCoursesByStudentId(id:string): Promise<Course[] | null> {
        const courseEnrollments = await ENROLLMENT_MODEL.find({
            student: id
        }).populate<{course: Course}>('course');

        return courseEnrollments.map(
            enrollment => enrollment.course
        )
    }

    async register(Enrollment: Partial<Enrollment>): Promise<Enrollment> {
        return ENROLLMENT_MODEL.create(Enrollment);
    }

    async updateById(id: string, update: Partial<Enrollment>): Promise<Enrollment | null> {
        return ENROLLMENT_MODEL.findByIdAndUpdate(id, update, { new: true }).exec();
    }

    async deleteById(id: string): Promise<Enrollment | null> {
        return ENROLLMENT_MODEL.findByIdAndDelete(id).exec();
    }

    async deleteByStudentAndCourse(student: string, course: string): Promise<Enrollment | null> {
        return ENROLLMENT_MODEL.findOneAndDelete({
            student: student,
            course: course
        })
    }

    async getEnrolledStudents(course: string): Promise<number> {
        return ENROLLMENT_MODEL.countDocuments({course: course});
    }
}

export default new EnrollmentRepository();