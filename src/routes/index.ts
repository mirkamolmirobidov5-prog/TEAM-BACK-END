import { Router } from 'express';
import productRoutes from './product.routes';
import orderRoutes from './order.routes';
import statisticsRoutes from './statistics.routes';

const router = Router();

router.use('/products', productRoutes);
router.use('/orders', orderRoutes);
router.use('/statistics', statisticsRoutes);

export default router;
