import { AppError } from "../middleware/error.middleware.js";

export class ValidationError extends AppError {
    constructor(message = 'Validation failed') {
        super(message, 400);
    }
}

export class UnauthorizedError extends AppError {
    constructor(message = 'Unauthorized') {
        super(message, 404);
    }
}

export class ForbiddenError extends AppError {
    constructor(message = 'User not permittedd') {
        super(message, 403)
    }
}

export class NotAllowedError extends AppError {
    constructor(message = 'Method not allowed') {
        super(message, 405);
    }
}

// errors/NotFoundError.ts
export class NotFoundError extends AppError {
  constructor(message = 'Resource not found') {
    super(message, 404);
  }
} 

export class TimeouttError extends AppError {
    constructor(message = 'Requst timed out') {
        super(message, 408)
    }
}

export class ConflictError extends AppError {
    constructor(message='Conflict') {
        super(message, 409)
    }
}