import { Request, Response, NextFunction } from 'express';
import statisticsService from '../services/statistics.service';
import catchAsync from '../utils/catchAsync';

class StatisticsController {
  /**
   * GET /statistics
   * Aggregation-based sales dashboard data
   */
  getStatistics = catchAsync(async (_req: Request, res: Response, _next: NextFunction) => {
    const stats = await statisticsService.getStatistics();

    res.status(200).json({
      status: 'success',
      data: stats,
    });
  });
}

export default new StatisticsController();