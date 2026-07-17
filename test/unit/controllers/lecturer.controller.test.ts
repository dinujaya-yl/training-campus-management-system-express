import {describe, it, expect,beforeEach, jest} from "@jest/globals";
import type { Request, Response, NextFunction } from "express";
import type { LecturerService } from "../../../src/services/lecturer.service.js";
import type { AuthenticatedRequest } from "../../../src/types/express.js";
import { LecturerController } from "../../../src/controllers/lecturer.controller.js";

describe("Lecturer Controller" , () => {

    let lecturerController : LecturerController;

    interface UserParams {
        id : string
    }

    let mockedLecturerService : jest.Mocked<LecturerService>;

    let res : Partial<Response>;

    let nextMock: jest.Mock;

    beforeEach(() => {

        mockedLecturerService = {
            getAllLecturers: jest.fn(),
            getLecturerById: jest.fn(),
            getOwnedCourses: jest.fn()
        } as unknown as jest.Mocked<LecturerService>;

        lecturerController = new LecturerController(mockedLecturerService);

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

    describe ('Get all the lecturers', () => {

        it ('should return all the available lecturers', async () => {

            const req = {} as Request;

            const mockLecturersList = [
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

            mockedLecturerService.getAllLecturers.mockResolvedValue(mockLecturersList);

            // exec

            await lecturerController.getAllLecturers(
                req as Request,
                res as Response,
                nextMock
            );

            // expect

            expect(
                mockedLecturerService.getAllLecturers
            ).toHaveBeenCalled();

            expect(
                res.status
            ).toHaveBeenCalledWith(200);

            expect(
                res.json
            ).toHaveBeenCalledWith(mockLecturersList);

        });

    });

    describe ('Get a lecturer by his id', () => {

        it ('Should return the details of the lecturer', () => {


        });

        it ('Should return an error if not available', () => {

        });
    });

    describe ('Get owned courses of the lecturer', () => {

        it ('Should return the list of courses of the lecturer if available', () => {

        });

        it ('Should give not found error, if the lecturer is not available', () => {

        });
    })

})
