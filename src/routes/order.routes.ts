import { Router } from 'express';
import orderController from '../controllers/order.controller';

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Orders
 *   description: Buyurtmalar boshqaruvi
 */

/**
 * @swagger
 * /orders:
 *   post:
 *     summary: Yangi buyurtma yaratish
 *     tags: [Orders]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - customerName
 *               - items
 *             properties:
 *               customerName:
 *                 type: string
 *                 example: Ali Valiyev
 *               customerPhone:
 *                 type: string
 *                 example: "+998901234567"
 *               customerEmail:
 *                 type: string
 *                 example: ali@example.com
 *               notes:
 *                 type: string
 *                 example: Tez yetkazib bering
 *               status:
 *                 type: string
 *                 enum: [pending, confirmed, shipped, delivered, cancelled]
 *                 default: pending
 *               items:
 *                 type: array
 *                 minItems: 1
 *                 items:
 *                   type: object
 *                   required:
 *                     - product
 *                     - quantity
 *                   properties:
 *                     product:
 *                       type: string
 *                       description: Product ObjectId
 *                       example: "671f0a1b2c3d4e5f67890123"
 *                     quantity:
 *                       type: integer
 *                       minimum: 1
 *                       example: 2
 *     responses:
 *       201:
 *         description: Buyurtma yaratildi (stock avtomatik kamaytiriladi)
 *       400:
 *         description: Stock yetarli emas yoki validatsiya xatosi
 *       404:
 *         description: Mahsulot topilmadi
 */
router.post('/', orderController.createOrder);

export default router;
