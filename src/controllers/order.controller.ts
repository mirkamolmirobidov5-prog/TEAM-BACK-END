import { Request, Response, NextFunction } from 'express';
import orderService from '../services/order.service';
import catchAsync from '../utils/catchAsync';
import { OrderInput } from '../types';

class OrderController {
  /**
   * POST /orders
   */
  createOrder = catchAsync(async (req: Request, res: Response, _next: NextFunction) => {
    const data = req.body as OrderInput;
    const order = await orderService.createOrder(data);

    res.status(201).json({
      status: 'success',
      data: {
        order,
      },
    });
  });
}

export default new OrderController();
