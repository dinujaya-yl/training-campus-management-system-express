// enrollment.worker.ts
import { redis } from "./redis.client.js";
// import { enrollmentOrchestrator } from "./enrollment.orchestrator";
// import type { CourseServices } from "../services/course.service.js";
import { EventEmitter } from "events";
import courseServiceImpl from "../services/implementation/course.service.impl.js";

export const enrollmentEvents = new EventEmitter();

function queueKey(courseId: string) {
  return `enroll-queue:${courseId}`;
}

function lockKey(courseId: string) {
  return `queue-lock:${courseId}`;
}

export async function enqueueEnrollment(courseId: string, studentId: string, reservationId: string) {
  await redis.zadd(
    queueKey(courseId),
    Date.now(), 
    JSON.stringify({ studentId, reservationId })
  );
}

export async function processQueue(courseId: string) {
  const gotLock = await redis.set(lockKey(courseId),"1","EX",30,"NX");
  if (!gotLock) return;

  try {
    while (true) {
      const popped = await redis.zpopmin(queueKey(courseId)); // atomic pop of earliest item
      if (!popped || popped.length === 0) break;

      const [attempt] = popped;

      if (!attempt) break;

      const { studentId, reservationId } = JSON.parse(attempt);

      try {
        await courseServiceImpl.registerCourse({id: studentId}, {id: courseId}, reservationId);
        enrollmentEvents.emit(reservationId, { success: true, message: "Enrolled successfully" });
      } catch (err: any) {
        enrollmentEvents.emit(reservationId, { success: false, message: err.message });
      }
    }
  } finally {
    await redis.del(lockKey(courseId));
  }
}