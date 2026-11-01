import Order from '../models/order.model';
import Product from '../models/product.model';

interface SalesOverview {
  totalOrders: number;
  totalRevenue: number;
  averageOrderValue: number;
  totalProductsSold: number;
}

interface StatusBreakdown {
  _id: string;
  count: number;
  revenue: number;
}

interface TopProduct {
  productId: string;
  name: string;
  totalSold: number;
  revenue: number;
}

interface CategoryStats {
  category: string;
  productCount: number;
  totalStock: number;
  avgPrice: number;
}

interface DailySales {
  date: string;
  orders: number;
  revenue: number;
}

class StatisticsService {
  /**
   * Full sales statistics using Aggregation
   */
  async getStatistics() {
    const [
      overview,
      byStatus,
      topProducts,
      categoryStats,
      recentDailySales,
      lowStockProducts,
    ] = await Promise.all([
      this.getOverview(),
      this.getOrdersByStatus(),
      this.getTopSellingProducts(5),
      this.getCategoryStats(),
      this.getDailySales(7),
      this.getLowStockProducts(10),
    ]);

    return {
      overview,
      byStatus,
      topProducts,
      categoryStats,
      recentDailySales,
      lowStockProducts,
    };
  }

  private async getOverview(): Promise<SalesOverview> {
    const result = await Order.aggregate([
      {
        $match: {
          status: { $ne: 'cancelled' },
        },
      },
      {
        $group: {
          _id: null,
          totalOrders: { $sum: 1 },
          totalRevenue: { $sum: '$totalAmount' },
          totalProductsSold: {
            $sum: {
              $reduce: {
                input: '$items',
                initialValue: 0,
                in: { $add: ['$$value', '$$this.quantity'] },
              },
            },
          },
        },
      },
      {
        $project: {
          _id: 0,
          totalOrders: 1,
          totalRevenue: { $round: ['$totalRevenue', 2] },
          averageOrderValue: {
            $cond: [
              { $eq: ['$totalOrders', 0] },
              0,
              { $round: [{ $divide: ['$totalRevenue', '$totalOrders'] }, 2] },
            ],
          },
          totalProductsSold: 1,
        },
      },
    ]);

    return (
      result[0] || {
        totalOrders: 0,
        totalRevenue: 0,
        averageOrderValue: 0,
        totalProductsSold: 0,
      }
    );
  }

  private async getOrdersByStatus(): Promise<StatusBreakdown[]> {
    return Order.aggregate([
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 },
          revenue: { $sum: '$totalAmount' },
        },
      },
      {
        $project: {
          _id: 1,
          count: 1,
          revenue: { $round: ['$revenue', 2] },
        },
      },
      { $sort: { count: -1 } },
    ]);
  }

  private async getTopSellingProducts(limit = 5): Promise<TopProduct[]> {
    return Order.aggregate([
      { $match: { status: { $ne: 'cancelled' } } },
      { $unwind: '$items' },
      {
        $group: {
          _id: '$items.product',
          name: { $first: '$items.nameAtPurchase' },
          totalSold: { $sum: '$items.quantity' },
          revenue: {
            $sum: {
              $multiply: ['$items.quantity', '$items.priceAtPurchase'],
            },
          },
        },
      },
      {
        $project: {
          _id: 0,
          productId: '$_id',
          name: 1,
          totalSold: 1,
          revenue: { $round: ['$revenue', 2] },
        },
      },
      { $sort: { totalSold: -1 } },
      { $limit: limit },
    ]);
  }

  private async getCategoryStats(): Promise<CategoryStats[]> {
    return Product.aggregate([
      { $match: { isActive: true } },
      {
        $group: {
          _id: '$category',
          productCount: { $sum: 1 },
          totalStock: { $sum: '$stock' },
          avgPrice: { $avg: '$price' },
        },
      },
      {
        $project: {
          _id: 0,
          category: '$_id',
          productCount: 1,
          totalStock: 1,
          avgPrice: { $round: ['$avgPrice', 2] },
        },
      },
      { $sort: { productCount: -1 } },
    ]);
  }

  private async getDailySales(days = 7): Promise<DailySales[]> {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);
    startDate.setHours(0, 0, 0, 0);

    return Order.aggregate([
      {
        $match: {
          createdAt: { $gte: startDate },
          status: { $ne: 'cancelled' },
        },
      },
      {
        $group: {
          _id: {
            $dateToString: { format: '%Y-%m-%d', date: '$createdAt' },
          },
          orders: { $sum: 1 },
          revenue: { $sum: '$totalAmount' },
        },
      },
      {
        $project: {
          _id: 0,
          date: '$_id',
          orders: 1,
          revenue: { $round: ['$revenue', 2] },
        },
      },
      { $sort: { date: 1 } },
    ]);
  }

  private async getLowStockProducts(threshold = 10) {
    return Product.find({
      isActive: true,
      stock: { $lte: threshold },
    })
      .select('name sku stock category price')
      .sort({ stock: 1 })
      .limit(20)
      .lean();
  }
}

export default new StatisticsService();