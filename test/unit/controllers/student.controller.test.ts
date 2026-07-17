import {describe, it, expect,beforeEach, jest} from "@jest/globals";
import type { Request, Response, NextFunction } from "express";
import type { StudentServices } from "../../../src/services/student.service.js";
// import { mock } from "node:test";
import type { AuthenticatedRequest } from "../../../src/types/express.js";
import type { StudentController } from "../../../src/controllers/student.controller.js";
import { error } from "node:console";
// import type { Course } from "../../../src/models/course.model.js";


///////////////////////////////////////////////////////////////////////////////////

jest.unstable_mockModule('../../../src/utils/generateToken.util.js', () => ({
  default: jest.fn(),
}));

const generateTokenModule = await import('../../../src/utils/generateToken.util.js');
const generateToken = generateTokenModule.default;

////////////////////////////////////////////////////////////////////////////////////

const { StudentController: StudentControllerClass } = await import('../../../src/controllers/student.controller.js');

///////////////////////////////////////////////////////////////////////////////////


describe("StudentController", () => {

    let studentController : StudentController;

    interface UserParams {
        id: string
    };
    
    let mockStudentService : jest.Mocked<StudentServices>;

    let res : Partial<Response>;

    let nextMock: jest.Mock;

    beforeEach(() => {

        mockStudentService = {
            getStudentById: jest.fn(),
            getAllEnrollmentsById: jest.fn(),
            getAllStudents: jest.fn(),
            registerStudent: jest.fn()
            
        } as unknown as jest.Mocked<StudentServices>;


        studentController = new StudentControllerClass(mockStudentService);
        
        res = {
            status: jest.fn(
                (_code: number) => res as Response
            ),
            json: jest.fn(
                (_body: unknown) => res as Response
            )
        };

        nextMock = jest.fn();
    })


    describe("get all students", () => {

        it("should return a list of all students", async () => {

            const req = {} as Request;

            const mockStudentList = [
                {
                    "_id": "6a50d5991e9a12905e59b2d2",
                    "name": "dinujaya",
                    "email": "student@dinujaya.me",
                    "password": "$2b$12$f5oMnbNGtSlbopWvsAYv9.80UtJr2HM5FMk7/Ru2nhdhFIHblimz2",
                    "role": "student",
                    "createdAt": "2026-07-10T11:20:57.445Z",
                    "updatedAt": "2026-07-10T11:20:57.445Z",
                },
                {
                    "_id": "6a512881d496bb2483acc479",
                    "name": "dinujayaw",
                    "email": "student2@dinujaya.me",
                    "password": "$2b$12$kuNyP.c3ofrpKETtLhLCHe9tq2azLdLqdbVbyqbMkVXXF2eHBU9NW",
                    "role": "student",
                    "createdAt": "2026-07-10T17:14:41.067Z",
                    "updatedAt": "2026-07-10T17:14:41.067Z",
                }
            ] as any;

            mockStudentService.getAllStudents.mockResolvedValue(mockStudentList);

            // exec

            await studentController.getAllStudents(
                req as Request,
                res as Response,
                nextMock
            )

            // expect

            expect(
                mockStudentService.getAllStudents
            ).toHaveBeenCalled();

            expect(
                res.status
            ).toHaveBeenCalledWith(200);

            expect(
                res.json
            ).toHaveBeenCalledWith(mockStudentList);

            expect(
                nextMock
            ).not.toHaveBeenCalled();

        });

        it("should return an empty list when no students", () => {

        })
    });

    describe("get my details.", () => {

        it("should give the correct user\'s details.", async () => {

            const req = {
                user: {
                    id: "6a50d5991e9a12905e59b2d2"
                }
            } as AuthenticatedRequest;

            const mockStudent = {
                id: "6a50d5991e9a12905e59b2d2",
                name: "dinujaya",
                email: "student@dinujaya.me",
                password: "password",
                role: "student",
                createdAt: "2026-07-10T11:20:57.445Z",
                updatedAt: "2026-07-10T11:20:57.445Z",
            } as any;

            mockStudentService.getStudentById.mockResolvedValue(mockStudent);

            // Act

            await studentController.getSelfDetails(
                req as AuthenticatedRequest,
                res as Response,
                nextMock as unknown as NextFunction
            );

            // Expect

            expect(
                mockStudentService.getStudentById
            ).toHaveBeenCalledWith(
                "6a50d5991e9a12905e59b2d2"
            );

            expect(
                res.status
            ).toHaveBeenCalledWith(
                200
            );

            expect(
                res.json
            ).toHaveBeenCalledWith(
                mockStudent
            )
            
            expect(
                nextMock
            ).not.toHaveBeenCalled()

        });
    });

    describe("get details of specific student", () => {

        it("should return the details of the student if available", async () => {

            const req = {
                params: {
                    id: "6a50d5991e9a12905e59b2d2"
                }
            } as Request<UserParams>;

            const mockStudent = {
                id: "6a50d5991e9a12905e59b2d2",
                name: "dinujaya",
                email: "student@dinujaya.me",
                password: "password",
                role: "student",
                createdAt: "2026-07-10T11:20:57.445Z",
                updatedAt: "2026-07-10T11:20:57.445Z",
            } as any;

            mockStudentService.getStudentById.mockResolvedValue(mockStudent);

            // Act

            await studentController.getStudentById(
                req as Request<UserParams>,
                res as Response,
                nextMock as unknown as NextFunction
            );

            // Assert

            expect(
                mockStudentService.getStudentById
            ).toHaveBeenCalledWith(
                "6a50d5991e9a12905e59b2d2"
            );

            expect(
                res.status
            ).toHaveBeenCalledWith(
                200
            );

            expect(
                res.json
            ).toHaveBeenCalledWith(
                mockStudent
            );

            expect(
                nextMock
            ).not.toHaveBeenCalled();

        });

        it("should return error if the user not available", async () => {

            const req = {
                params: {
                    id: "6a50d5991e9a12905e59b2d3"
                }
            } as Request<UserParams>;

            const expected = {
                    "status": "Error",
                    "message": "Student not found!"
            }

            mockStudentService.getStudentById.mockResolvedValue(null);

            // exec

            await studentController.getStudentById(
                req as Request<UserParams>,
                res as Response,
                nextMock
            )

            // expect

            expect(
                mockStudentService.getStudentById
            ).toHaveBeenCalledWith(
                "6a50d5991e9a12905e59b2d3"
            );

            expect(
                res.status
            ).toHaveBeenCalledWith(
                404
            );

            expect(
                res.json
            ).toHaveBeenCalledWith(expected);

            expect(
                nextMock
            ).not.toHaveBeenCalled()

        });

    });

    // describe("get enrolled courses of a student", () => {

    //     it("should return the specific student\'s enrollments", () => {

    //     });

    //     it("should return not enrolled message, if non available", () => {

    //     });

    // });

    describe("get enrolled courses of the self", () => {

        it("should return all the enrollments as a list", async () => {

            const req = {
                user: {
                    id: "6a50d5991e9a12905e59b2d2"
                }
            } as AuthenticatedRequest;

            const expected = [{
                "id": "6a50d5991e9a12905e59b2d2",
                "name": "Science",
                "lecturer": "6a52642bcd3ba34f1e1fbf9f",
                "max_students": 2,
                "createdAt": "2026-07-11T21:26:39.185Z",
                "updatedAt": "2026-07-11T21:26:39.185Z"
            }] as any;

            mockStudentService.getAllEnrollmentsById.mockResolvedValue(expected);

            // act

            await studentController.getSelfCourses(
                req as AuthenticatedRequest,
                res as Response,
                nextMock
            )

            // expect

            expect(
                mockStudentService.getAllEnrollmentsById
            ).toHaveBeenCalledWith("6a50d5991e9a12905e59b2d2");

            expect(
                res.status
            ).toHaveBeenCalledWith(200);

            expect(
                res.json
            ).toHaveBeenCalledWith(expected);

            expect(
                nextMock
            ).not.toHaveBeenCalled();

        });

    });

    describe("register as a new student", () => {

        it("should create new student, for proper providence of credentials", async () => {

            const req = {
                body: {
                    "name": "dinujayaw",
                    "email": "student3@dinujaya.me",
                    "password": "helloworld3",
                    "confirmPassword": "helloworld3"
                }
            } as Request;

            const mockRegistration = {
                    "status": "success",
                    "token": "mock-token",
                    "data": {
                        "newUser": {
                            "name": "dinujayaw",
                            "email": "student3@dinujaya.me",
                            "role": "student",
                            "_id": "6a568029c48dbb2d4eef4c88",
                            "createdAt": "2026-07-14T18:30:01.455Z",
                            "updatedAt": "2026-07-14T18:30:01.455Z",
                            "__v": 0
                        }
                    }
                } as any;

            const mockUser = {
                    "name": "dinujayaw",
                    "email": "student3@dinujaya.me",
                    "role": "student",
                    "_id": "6a568029c48dbb2d4eef4c88",
                    "createdAt": "2026-07-14T18:30:01.455Z",
                    "updatedAt": "2026-07-14T18:30:01.455Z",
                    "__v": 0
                } as any;

            const mockedGenerateToken = jest.mocked(generateToken);

            mockedGenerateToken.mockResolvedValue("mock-token");

            mockStudentService.registerStudent.mockResolvedValue(mockUser);


            // execute

            await studentController.registerStudent(
                req as Request,
                res as Response,
                nextMock
            )

            // expect

            expect(
                mockStudentService.registerStudent
            ).toHaveBeenCalledWith({
                name: req.body.name,
                email: req.body.email,
                password: req.body.password
            });

            expect(
                res.status
            ).toHaveBeenCalledWith(201);

            expect(
                res.json
            ).toHaveBeenCalledWith(mockRegistration);

            expect(
                nextMock
            ).not.toHaveBeenCalled();

        });

        it("should reject creation if the user already registered", async () => {
            const req = {
                body: {
                    "name": "dinujayaw",
                    "email": "student4@dinujaya.me",
                    "password": "helloworld4",
                    "confirmPassword": "helloworld4"
                }
            } as Request;

            // const error_msg = new Error('Email already in use');

            mockStudentService.registerStudent.mockImplementation( () => {
                throw new Error('Email already in use');
            }
            );

            // execute

            await studentController.registerStudent(
                req as Request,
                res as Response,
                nextMock
            );

            // expect

            expect(
                mockStudentService.registerStudent
            ).toHaveBeenCalledWith({
                name: req.body.name,
                email: req.body.email,
                password: req.body.password,
            });

            expect(
                res.status
            ).toHaveBeenCalledWith(400);

            expect(
                nextMock
            ).toHaveBeenCalled();


        });

        it("should reject creation if the passwords don't match", async () => {

            const req = {
                body: {
                    "name": "dinujayaw",
                    "email": "student4@dinujaya.me",
                    "password": "helloworld4",
                    "confirmPassword": "helloworld5"
                }
            } as Request;

            // execute

            await studentController.registerStudent(
                req as Request,
                res as Response,
                nextMock
            );

            // expect

            expect(
                mockStudentService.registerStudent
            ).not.toHaveBeenCalled();

            expect(
                res.status
            ).toHaveBeenCalledWith(400);

            expect(
                nextMock
            ).toHaveBeenCalled();

        });

    });

    // describe("login of an existing user", () => {

    //     it("should log the user in, if password is correct", () => {

    //     });

    //     it("should reject login for wrong password", () => {
            
    //     });

    // })

});