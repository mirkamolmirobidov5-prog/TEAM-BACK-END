import Product, { IProduct } from '../models/product.model';
import AppError from '../utils/appError';
import { ProductInput, PaginationQuery } from '../types';
import { FilterQuery, SortOrder } from 'mongoose';

interface PaginatedResult {
  products: IProduct[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

class ProductService {
  /**
   * Get products with pagination, sorting, filtering and search
   */
  async getProducts(query: PaginationQuery): Promise<PaginatedResult> {
    const page = Math.max(1, parseInt(query.page || '1', 10));
    const limit = Math.min(100, Math.max(1, parseInt(query.limit || '10', 10)));
    const skip = (page - 1) * limit;

    // Build filter
    const filter: FilterQuery<IProduct> = { isActive: true };

    // Search (text index or regex fallback)
    if (query.search) {
      const searchRegex = new RegExp(query.search, 'i');
      filter.$or = [
        { name: searchRegex },
        { description: searchRegex },
        { category: searchRegex },
        { sku: searchRegex },
      ];
    }

    // Category filter
    if (query.category) {
      filter.category = query.category;
    }

    // Price range
    if (query.minPrice || query.maxPrice) {
      filter.price = {};
      if (query.minPrice) {
        (filter.price as any).$gte = parseFloat(query.minPrice);
      }
      if (query.maxPrice) {
        (filter.price as any).$lte = parseFloat(query.maxPrice);
      }
    }

    // In stock filter
    if (query.inStock === 'true') {
      filter.stock = { $gt: 0 };
    } else if (query.inStock === 'false') {
      filter.stock = { $lte: 0 };
    }

    // Sorting
    let sort: Record<string, SortOrder> = { createdAt: -1 };
    if (query.sort) {
      const sortFields = query.sort.split(',').map((s) => s.trim());
      sort = {};
      for (const field of sortFields) {
        if (field.startsWith('-')) {
          sort[field.slice(1)] = -1;
        } else {
          sort[field] = 1;
        }
      }
    }

    const [products, total] = await Promise.all([
      Product.find(filter).sort(sort).skip(skip).limit(limit).lean({ virtuals: true }),
      Product.countDocuments(filter),
    ]);

    const totalPages = Math.ceil(total / limit) || 1;

    return {
      products: products as unknown as IProduct[],
      total,
      page,
      limit,
      totalPages,
      hasNextPage: page < totalPages,
      hasPrevPage: page > 1,
    };
  }

  /**
   * Create a new product
   */
  async createProduct(data: ProductInput): Promise<IProduct> {
    // Auto-generate SKU if not provided
    if (!data.sku) {
      const prefix = data.category.substring(0, 3).toUpperCase().replace(/[^A-Z]/g, 'X');
      const random = Math.random().toString(36).substring(2, 8).toUpperCase();
      data.sku = `${prefix}-${random}`;
    }

    const product = await Product.create(data);
    return product;
  }

  /**
   * Get single product by ID
   */
  async getProductById(id: string): Promise<IProduct> {
    const product = await Product.findById(id);
    if (!product || !product.isActive) {
      throw new AppError('Mahsulot topilmadi', 404);
    }
    return product;
  }
}

export default new ProductService();
