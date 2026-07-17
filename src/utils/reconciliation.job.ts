// reconciliation.job.ts
import COURSE_MODEL from "../models/course.model.js"
import ENROLLMENT_MODEL from "../models/enrollment.model.js";
import courseRepository from "../repositories/course.repository.js";
import courseModel from "../models/course.model.js";

const STALE_THRESHOLD_MS = 5 * 60 * 1000; // 5 minutes

export async function reconcilePendingReservations() {
  const cutoff = new Date(Date.now() - STALE_THRESHOLD_MS);

  const courses = await COURSE_MODEL.find({
    "pendingReservations.createdAt": { $lt: cutoff },
  });

  for (const course of courses) {
    for (const res of course.pendingReservations) {
      if (res.createdAt >= cutoff) continue;

      const enrollment = await ENROLLMENT_MODEL.findOne({ reservationId: res.reservationId });

      if (enrollment) {
        // Step 2 actually succeeded but confirmation step never ran — confirm now
        await courseRepository.confirmSeat(course._id.toString(), res.reservationId);
      } else {
        // Step 2 never happened — release the phantom seat
        await courseRepository.releaseSeat(course._id.toString(), res.reservationId);
      }
    }
  }
}