import { Request, Response, NextFunction } from 'express';
import AppError from '../utils/appError';

const notFound = (req: Request, _res: Response, next: NextFunction) => {
  next(new AppError(`Bu marshrut topilmadi: ${req.originalUrl}`, 404));
};

export default notFound;