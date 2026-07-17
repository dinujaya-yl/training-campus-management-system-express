import { Router} from 'express';
import { LecturerController } from '../controllers/lecturer.controller.js';
import lecturerServiceImpl from '../services/implementation/lecturer.service.impl.js';
import { AuthController } from '../controllers/auth.controller.js';


const lecturerRouter: Router = Router();
const lecturerController = new LecturerController(lecturerServiceImpl);
const authController = new AuthController;

// GET: all lecturers
lecturerRouter.get('/', authController.protect, authController.restrictTo('lecturer', 'admin'), lecturerController.getAllLecturers);

// GET: specific lecturer
lecturerRouter.get('/:id', lecturerController.getLecturerById);

// GET: courses of a specific lecturer
lecturerRouter.get('/:id/courses/', authController.protect ,lecturerController.getOwnedCourses);

export default lecturerRouter;