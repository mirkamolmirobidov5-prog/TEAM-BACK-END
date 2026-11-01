import mongoose, { Document, Schema, Model, Types } from 'mongoose';

export interface IOrderItem {
  product: Types.ObjectId;
  quantity: number;
  priceAtPurchase: number; // snapshot of price at order time
  nameAtPurchase: string;
}

export interface IOrder extends Document {
  orderNumber: string;
  customerName: string;
  customerPhone?: string;
  customerEmail?: string;
  items: IOrderItem[];
  totalAmount: number;
  status: 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled';
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
  // Virtual
  itemsCount: number;
}

interface IOrderModel extends Model<IOrder> {
  // Static methods if needed
}

const orderItemSchema = new Schema<IOrderItem>(
  {
    product: {
      type: Schema.Types.ObjectId,
      ref: 'Product',
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
      min: [1, 'Miqdor kamida 1 bo‘lishi kerak'],
    },
    priceAtPurchase: {
      type: Number,
      required: true,
      min: 0,
    },
    nameAtPurchase: {
      type: String,
      required: true,
    },
  },
  { _id: false }
);

const orderSchema = new Schema<IOrder, IOrderModel>(
  {
    orderNumber: {
      type: String,
      unique: true,
      required: true,
    },
    customerName: {
      type: String,
      required: [true, 'Mijoz ismi majburiy'],
      trim: true,
    },
    customerPhone: {
      type: String,
      trim: true,
    },
    customerEmail: {
      type: String,
      trim: true,
      lowercase: true,
    },
    items: {
      type: [orderItemSchema],
      required: true,
      validate: {
        validator: (v: IOrderItem[]) => Array.isArray(v) && v.length > 0,
        message: 'Buyurtmada kamida bitta mahsulot bo‘lishi kerak',
      },
    },
    totalAmount: {
      type: Number,
      required: true,
      min: 0,
    },
    status: {
      type: String,
      enum: ['pending', 'confirmed', 'shipped', 'delivered', 'cancelled'],
      default: 'pending',
    },
    notes: {
      type: String,
      trim: true,
      maxlength: 500,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Virtual: total items count
orderSchema.virtual('itemsCount').get(function (this: IOrder) {
  return this.items.reduce((sum, item) => sum + item.quantity, 0);
});

// Indexes
orderSchema.index({ orderNumber: 1 });
orderSchema.index({ status: 1 });
orderSchema.index({ createdAt: -1 });
orderSchema.index({ 'items.product': 1 });

const Order = mongoose.model<IOrder, IOrderModel>('Order', orderSchema);

export default Order;
