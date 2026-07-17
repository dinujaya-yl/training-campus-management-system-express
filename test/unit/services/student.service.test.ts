import {describe, it, expect,beforeEach, jest} from "@jest/globals";
import type { StudentServices } from "../../../src/services/student.service.js";
import UserRepository from "../../../src/repositories/user.repository.js";
import studentServiceImpl from "../../../src/services/implementation/student.service.impl.js";

describe ("Student Services", () => {

    let studentServices : StudentServices;

    beforeEach( () => {

        // studentServices = new studentServiceImpl

    })

    describe ("Get all students", () => {

        it ("Should return all the students", async () => {

            // await studentServices.getAllStudents();


        });
    });

    describe ("Get student by ID", () => {

        it ("Should return the student if available", () => {

        });

        it ("Should return error if student is not available", () => {

        });
    });

    describe ("Get all enrolled courses by ID", () => {

        it ("Should return only the courses that the student is enrolled", () => {

        });

        it ("Should return error if id is not available", () => {

        });
    });

    describe ("Retister student", () => {

        it ("Should create a student record if no current user", () => {



        });

        it ("Should return error if current user exists", () => {

        });
    });

    describe ("Log in a user", () => {

        it ("Should check whether the user still available", () => {

        });

        it ("Should check for password validation using hash", () => {

        });

        it ("Should throw an error when the password is wrong", () => {

        });
    })
})