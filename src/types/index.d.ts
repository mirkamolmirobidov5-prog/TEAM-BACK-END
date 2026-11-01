import { Request } from 'express';

declare global {
  namespace Express {
    interface Request {
      // Extend if needed later (e.g. user)
    }
  }
}

export interface PaginationQuery {
  page?: string;
  limit?: string;
  sort?: string;
  search?: string;
  category?: string;
  minPrice?: string;
  maxPrice?: string;
  inStock?: string;
}

export interface ProductInput {
  name: string;
  description?: string;
  price: number;
  category: string;
  stock: number;
  images?: string[];
  sku?: string;
  isActive?: boolean;
}

export interface OrderItemInput {
  product: string;
  quantity: number;
}

export interface OrderInput {
  customerName: string;
  customerPhone?: string;
  customerEmail?: string;
  items: OrderItemInput[];
  notes?: string;
  status?: 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled';
}

export {};