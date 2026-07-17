import { Router} from 'express';
import { CourseController } from '../controllers/course.controller.js';
import courseServiceImpl from '../services/implementation/course.service.impl.js';
import { AuthController } from '../controllers/auth.controller.js';

const courseRouter: Router = Router();
const courseController = new CourseController(courseServiceImpl); 
const authController = new AuthController;

// GET: all courses
courseRouter.get('/', authController.protect, courseController.getAllCourses );

// GET: specific course details
courseRouter.get('/:id', authController.protect, courseController.getCourseById);

// POST: enroll to a course
courseRouter.post('/:id/enrollments/', authController.protect, authController.restrictTo('student', 'admin'), courseController.enrollStudent);

// DELETE: unenroll to a course
courseRouter.delete('/:id/enrollments/',authController.protect, authController.restrictTo('admin', 'self') , courseController.withdrawStudent);

// CREATE a new course : for admin
courseRouter.post('/', authController.protect, authController.restrictTo('admin'), courseController.addNewCourse);

export default courseRouter;