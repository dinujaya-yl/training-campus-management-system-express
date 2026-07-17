import { Router } from 'express';
import { StudentController } from '../controllers/student.controller.js';
import studentServiceImpl from '../services/implementation/student.service.impl.js';
import { AuthController } from '../controllers/auth.controller.js';
import { validate } from '../middleware/validator.middleware.js';
import { CreateUserSchema } from '../schemas/user.schema.js';

const studentRouter: Router = Router();
const studentController = new StudentController(studentServiceImpl);
const authController = new AuthController;

interface userParams {
    id: string
}

// GET: all students
studentRouter.get('/',authController.protect, authController.restrictTo('lecturer', 'admin'), studentController.getAllStudents);

// GET: my details
studentRouter.get('/my', authController.protect, studentController.getSelfDetails)

// GET: specific student
studentRouter.get('/:id', authController.protect,  authController.restrictTo('self','lecturer', 'admin') ,studentController.getStudentById);

studentRouter.get('/my/courses', authController.protect, studentController.getSelfCourses)

// GET: courses of a specific student
studentRouter.get('/:id/courses/', authController.protect, authController.restrictTo('admin', 'lecturer', 'self') ,studentController.getEnrolledCourses);

studentRouter.post('/', validate(CreateUserSchema), studentController.registerStudent);

studentRouter.post('/login/', studentController.login)

export default studentRouter;