import COURSE_MODEL from "../models/course.model.js";
import type {Course } from "../models/course.model.js";

class CourseRepository {
    async findAll(): Promise<Course[]> {
        return COURSE_MODEL.find().exec();
    }

    async findById(id: string): Promise<Course | null> {
        return COURSE_MODEL.findById(id).exec();
    }

    async findByIdList(idList: string[] | null): Promise<Course[] | null> {
        if (!idList) {
            return []
        }
        return COURSE_MODEL.find({
            id: {$in: idList}
        })
    }

    async findByLecturerId(lecturerId: string): Promise<Course[] | null> {
        return COURSE_MODEL.find({ lectuer: lecturerId})
    }

    async register(Course: Partial<Course>): Promise<Course> {
        return COURSE_MODEL.create(Course);
    }

    async updateById(id: string, update: Partial<Course>): Promise<Course | null> {
        return COURSE_MODEL.findByIdAndUpdate(id, update, { new: true }).exec();
    }

    async deleteById(id: string): Promise<Course | null> {
        return COURSE_MODEL.findByIdAndDelete(id).exec();
    }

    async reserveSeat(courseId: string, studentId: string, reservationId: string): Promise<Course | null> {
        const course = await COURSE_MODEL.findOneAndUpdate(
            {
            _id: courseId,
            $expr: { $lt: ["$enrolledCount", "$max_students"] },
            "pendingReservations.reservationId": { $ne: reservationId },
            },
            {
            $inc: { enrolledCount: 1 },
            $push: { pendingReservations: { reservationId, studentId, createdAt: new Date() } },
            },
            { new: true }
        );

        if (!course) throw new CourseFullOrDuplicateError();

        return course;

    }

    async releaseSeat(courseId: string, reservationId: string): Promise<void> {
        await COURSE_MODEL.updateOne(
            {
                _id: courseId,
                "pendingReservations.reservationId": reservationId,
            },
            {
                $inc: { enrolledCount: -1 },
                $pull: {
                    pendingReservations: { reservationId },
                },
            }
        );
    }

    async confirmSeat(courseId: string, reservationId: string): Promise<void> {
        await COURSE_MODEL.updateOne(
            { _id: courseId },
            { $pull: { pendingReservations: { reservationId } } }
        );
        }
    }

export class CourseFullOrDuplicateError extends Error {
    constructor() {
        super("Course is full or reservation already exists");
        this.name = "CourseFullOrDuplicateError";
    }
}

export default new CourseRepository();