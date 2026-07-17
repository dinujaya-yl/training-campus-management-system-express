import express from 'express';
import studentRouter from './routes/student.routes.js';
import lecturerRouter from './routes/lecturer.routes.js';
import { errorValidation } from './middleware/error.middleware.js';
import courseRouter from './routes/course.routes.js';

const app = express();

app.use(express.json());
// app.use(express.urlencoded({ extended: true }));

app.use('/students/', studentRouter);
app.use('/lecturers/', lecturerRouter);
app.use('/courses/', courseRouter)
app.use(errorValidation)


export default app;