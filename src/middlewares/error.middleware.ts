import { Request, Response, NextFunction } from 'express';
import { AppError } from '../utils/AppError';

export const notFound = (req: Request, res: Response, next: NextFunction): void => {
    next(new AppError(`Not Found - ${req.originalUrl}`, 404));
};

export const errorHandler = (err: any, req: Request, res: Response, next: NextFunction): void => {
    let error = { ...err };
    error.message = err.message;
    let statusCode = err.statusCode || 500;

    // Handle mongoose CastError (e.g. invalid ObjectId)
    if (err.name === 'CastError') {
        const message = 'Resource not found';
        error = new AppError(message, 404);
        statusCode = 404;
    }

    // Handle mongoose duplicate key
    if (err.code === 11000) {
        const message = 'Duplicate field value entered';
        error = new AppError(message, 400);
        statusCode = 400;
    }

    // Handle mongoose validation error
    if (err.name === 'ValidationError') {
        const message = Object.values(err.errors).map((val: any) => val.message).join(', ');
        error = new AppError(message, 400);
        statusCode = 400;
    }

    res.status(statusCode).json({
        success: false,
        message: error.message || 'Internal Server Error',
        stack: process.env.NODE_ENV === 'production' ? null : err.stack,
    });
};