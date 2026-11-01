import mongoose, { Document, Schema, Model } from 'mongoose';

export interface IProduct extends Document {
  name: string;
  description?: string;
  price: number;
  category: string;
  stock: number;
  images: string[];
  sku?: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
  // Virtual
  isInStock: boolean;
  // Instance methods can be added here
}

interface IProductModel extends Model<IProduct> {
  // Static methods if needed
}

const productSchema = new Schema<IProduct, IProductModel>(
  {
    name: {
      type: String,
      required: [true, 'Mahsulot nomi majburiy'],
      trim: true,
      maxlength: [200, 'Nom 200 belgidan oshmasligi kerak'],
    },
    description: {
      type: String,
      trim: true,
      maxlength: [2000, 'Tavsif 2000 belgidan oshmasligi kerak'],
    },
    price: {
      type: Number,
      required: [true, 'Narx majburiy'],
      min: [0, 'Narx manfiy bo‘lishi mumkin emas'],
    },
    category: {
      type: String,
      required: [true, 'Kategoriya majburiy'],
      trim: true,
      index: true,
    },
    stock: {
      type: Number,
      required: [true, 'Ombordagi miqdor majburiy'],
      min: [0, 'Stock manfiy bo‘lishi mumkin emas'],
      default: 0,
    },
    images: {
      type: [String],
      default: [],
    },
    sku: {
      type: String,
      unique: true,
      sparse: true,
      trim: true,
      uppercase: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Virtual: isInStock
productSchema.virtual('isInStock').get(function (this: IProduct) {
  return this.stock > 0;
});

// Indexes for search & filter performance
productSchema.index({ name: 'text', description: 'text' });
productSchema.index({ price: 1 });
productSchema.index({ category: 1, price: 1 });
productSchema.index({ createdAt: -1 });

const Product = mongoose.model<IProduct, IProductModel>('Product', productSchema);

export default Product;