import express from 'express';
import studentRouter from './routes/student.routes.js';
import lecturerRouter from './routes/lecturer.routes.js';
import { errorHandler } from './middleware/error.middleware.js';
import courseRouter from './routes/course.routes.js';
import morganLogger from './logger/http.logger.js';

const app = express();

app.use(express.json());
// app.use(express.urlencoded({ extended: true }));

app.use(morganLogger)

app.use('/students/', studentRouter);
app.use('/lecturers/', lecturerRouter);
app.use('/courses/', courseRouter)
app.use(errorHandler)


export default app;