import mongoose from 'mongoose';
import Order, { IOrder } from '../models/order.model';
import Product from '../models/product.model';
import AppError from '../utils/appError';
import { OrderInput } from '../types';

class OrderService {
  /**
   * Generate unique order number
   */
  private generateOrderNumber(): string {
    const date = new Date();
    const y = date.getFullYear().toString().slice(-2);
    const m = String(date.getMonth() + 1).padStart(2, '0');
    const d = String(date.getDate()).padStart(2, '0');
    const random = Math.floor(Math.random() * 90000 + 10000);
    return `ORD-${y}${m}${d}-${random}`;
  }

  /**
   * Create a new order (with stock validation & decrement)
   */
  async createOrder(data: OrderInput): Promise<IOrder> {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      if (!data.items || data.items.length === 0) {
        throw new AppError('Buyurtmada kamida bitta mahsulot bo‘lishi kerak', 400);
      }

      const orderItems = [];
      let totalAmount = 0;

      for (const item of data.items) {
        const product = await Product.findById(item.product).session(session);

        if (!product || !product.isActive) {
          throw new AppError(`Mahsulot topilmadi: ${item.product}`, 404);
        }

        if (product.stock < item.quantity) {
          throw new AppError(
            `"${product.name}" mahsulotidan faqat ${product.stock} dona qolgan`,
            400
          );
        }

        // Decrease stock
        product.stock -= item.quantity;
        await product.save({ session });

        const lineTotal = product.price * item.quantity;
        totalAmount += lineTotal;

        orderItems.push({
          product: product._id,
          quantity: item.quantity,
          priceAtPurchase: product.price,
          nameAtPurchase: product.name,
        });
      }

      const order = await Order.create(
        [
          {
            orderNumber: this.generateOrderNumber(),
            customerName: data.customerName,
            customerPhone: data.customerPhone,
            customerEmail: data.customerEmail,
            items: orderItems,
            totalAmount,
            status: data.status || 'pending',
            notes: data.notes,
          },
        ],
        { session }
      );

      await session.commitTransaction();

      // Populate product details
      const populated = await Order.findById(order[0]._id)
        .populate({
          path: 'items.product',
          select: 'name price category stock images sku',
        })
        .lean({ virtuals: true });

      return populated as unknown as IOrder;
    } catch (error) {
      await session.abortTransaction();
      throw error;
    } finally {
      session.endSession();
    }
  }

  /**
   * Get order by ID with populate
   */
  async getOrderById(id: string): Promise<IOrder> {
    const order = await Order.findById(id).populate({
      path: 'items.product',
      select: 'name price category stock images sku isActive',
    });

    if (!order) {
      throw new AppError('Buyurtma topilmadi', 404);
    }

    return order;
  }
}

export default new OrderService();
