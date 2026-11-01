import { Request, Response, NextFunction } from 'express';
import productService from '../services/product.service';
import catchAsync from '../utils/catchAsync';
import { PaginationQuery, ProductInput } from '../types';

class ProductController {
  /**
   * GET /products
   * Pagination, sorting, filtering, search
   */
  getProducts = catchAsync(async (req: Request, res: Response, _next: NextFunction) => {
    const query = req.query as PaginationQuery;
    const result = await productService.getProducts(query);

    res.status(200).json({
      status: 'success',
      results: result.products.length,
      pagination: {
        total: result.total,
        page: result.page,
        limit: result.limit,
        totalPages: result.totalPages,
        hasNextPage: result.hasNextPage,
        hasPrevPage: result.hasPrevPage,
      },
      data: {
        products: result.products,
      },
    });
  });

  /**
   * POST /products
   */
  createProduct = catchAsync(async (req: Request, res: Response, _next: NextFunction) => {
    const data = req.body as ProductInput;
    const product = await productService.createProduct(data);

    res.status(201).json({
      status: 'success',
      data: {
        product,
      },
    });
  });
}

export default new ProductController();
