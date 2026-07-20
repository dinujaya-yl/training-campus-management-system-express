import type { Request, Response, NextFunction } from "express";
import { ZodError } from "zod";
import logger from "../logger/logger.js";
import { stat } from "node:fs";
import config from "../env.js";
import { CourseFullOrDuplicateError } from "../repositories/course.repository.js";


export class AppError extends Error {
  public readonly statusCode : number;
  public readonly isOpereational : boolean;

  constructor(message: string, statusCode: number, isOperational = true) {
    super(message);
    this.statusCode = statusCode;
    this.isOpereational = isOperational;

    Object.setPrototypeOf(this, new.target.prototype);
    Error.captureStackTrace(this, this.constructor);
  }
}

export function errorHandler(
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) {
  let statusCode = 500;
  let message = 'Internal server error';
  let isOperational  = false;

  if (err instanceof AppError) {
    logger.info('App error. Code: ', err.statusCode)
    statusCode = err.statusCode;
    message = err.message;
    isOperational = err.isOpereational
  } else if (err instanceof ZodError) {
    statusCode = 400;
    message = 'Validation failed';
  } else if (err instanceof CourseFullOrDuplicateError) {
    statusCode = 409,
    message = 'Course if full!'
  }

  logger.error({
    message: err.message,
    stack: err.stack,
    statusCode,
    path: req.path,
    isOperational
  });

  res.status(statusCode).json({
    status: 'error', 
    message,
    ...(config.NODE_ENV === 'development' && { stack: err.stack})
  })
}