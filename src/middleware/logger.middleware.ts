

export class LoggerMiddleware {

    constructor() {}

    logError = async (err: any) => {
        console.log('logger started');
        try {
            console.log("Error did not occur in the middleware. this is error. :", err.message);
        } catch(error: any) {
            console.log('Error message: ',error.message);
        } 
    };

    // getStudentById = async (req: Request<UserParams>, res: Response) => {
    //     res.send(`GET student with id ${req.params.id}`);
    // };

    // getEnrolledCourses = async (req:Request<UserParams>, res: Response) => {
    //     res.send(`GET courses of the student ${req.params.id}`);
    // };

    // registerStudent = async (req:Request, res: Response, next: NextFunction) => {
    //     // const user = .await this.studentService.registerStudent(req.body);
    //     // res.send(`Registered user. ID: ${user.id}`);
    //     try {
    //         console.log('Recieved: ', req.body);
    //         const user = await this.studentService.registerStudent(req.body);
    //         res.status(200).send(`Registered user. ID: ${user.id}`);
    //     } catch(err:any) {
    //         if (err.message === 'Email already in use') {
    //             res.status(400).send('Email already in use. Try a different email')
    //         }
    //         next(err);
    //     }
    // };

}