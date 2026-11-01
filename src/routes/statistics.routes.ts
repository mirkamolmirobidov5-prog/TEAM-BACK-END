import { Router } from 'express';
import statisticsController from '../controllers/statistics.controller';

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Statistics
 *   description: Savdo statistikasi (Aggregation)
 */

/**
 * @swagger
 * /statistics:
 *   get:
 *     summary: To‘liq savdo statistikasi dashboardi
 *     tags: [Statistics]
 *     responses:
 *       200:
 *         description: Statistikalar muvaffaqiyatli qaytarildi
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 data:
 *                   type: object
 *                   properties:
 *                     overview:
 *                       type: object
 *                       properties:
 *                         totalOrders:
 *                           type: integer
 *                         totalRevenue:
 *                           type: number
 *                         averageOrderValue:
 *                           type: number
 *                         totalProductsSold:
 *                           type: integer
 *                     byStatus:
 *                       type: array
 *                       items:
 *                         type: object
 *                     topProducts:
 *                       type: array
 *                       items:
 *                         type: object
 *                     categoryStats:
 *                       type: array
 *                     recentDailySales:
 *                       type: array
 *                     lowStockProducts:
 *                       type: array
 */
router.get('/', statisticsController.getStatistics);

export default router;
