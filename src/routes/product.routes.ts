import { Router } from 'express';
import productController from '../controllers/product.controller';

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Products
 *   description: Mahsulotlar boshqaruvi
 */

/**
 * @swagger
 * /products:
 *   get:
 *     summary: Mahsulotlar ro‘yxatini olish
 *     tags: [Products]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Sahifa raqami
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Har sahifadagi elementlar soni (max 100)
 *       - in: query
 *         name: sort
 *         schema:
 *           type: string
 *           example: "-createdAt,price"
 *         description: "Sort fieldlari (minus = DESC). Masalan: price,-createdAt"
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Nom, tavsif, kategoriya yoki SKU bo‘yicha qidiruv
 *       - in: query
 *         name: category
 *         schema:
 *           type: string
 *         description: Kategoriya bo‘yicha filtr
 *       - in: query
 *         name: minPrice
 *         schema:
 *           type: number
 *         description: Minimal narx
 *       - in: query
 *         name: maxPrice
 *         schema:
 *           type: number
 *         description: Maksimal narx
 *       - in: query
 *         name: inStock
 *         schema:
 *           type: string
 *           enum: [true, false]
 *         description: Omborda bor/yo‘q filtr
 *     responses:
 *       200:
 *         description: Muvaffaqiyatli
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 results:
 *                   type: integer
 *                 pagination:
 *                   type: object
 *                 data:
 *                   type: object
 *                   properties:
 *                     products:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/Product'
 */
router.get('/', productController.getProducts);

/**
 * @swagger
 * /products:
 *   post:
 *     summary: Yangi mahsulot qo‘shish
 *     tags: [Products]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - price
 *               - category
 *               - stock
 *             properties:
 *               name:
 *                 type: string
 *                 example: iPhone 15 Pro
 *               description:
 *                 type: string
 *                 example: Apple flagman smartfon
 *               price:
 *                 type: number
 *                 example: 1299.99
 *               category:
 *                 type: string
 *                 example: Electronics
 *               stock:
 *                 type: integer
 *                 example: 50
 *               images:
 *                 type: array
 *                 items:
 *                   type: string
 *               sku:
 *                 type: string
 *                 example: ELE-ABC123
 *               isActive:
 *                 type: boolean
 *                 default: true
 *     responses:
 *       201:
 *         description: Mahsulot yaratildi
 *       400:
 *         description: Validatsiya xatosi
 */
router.post('/', productController.createProduct);

export default router;
