/**
 * Optional seed script — run with: npm run seed
 * Creates sample products for testing.
 */
import dotenv from 'dotenv';
dotenv.config();

import mongoose from 'mongoose';
import Product from '../models/product.model';
import connectDB from '../config/db';
import logger from './logger';

const sampleProducts = [
  {
    name: 'iPhone 15 Pro',
    description: 'Apple flagman smartfon, 256GB, Titanium',
    price: 1299.99,
    category: 'Electronics',
    stock: 45,
    sku: 'ELE-IPH15P',
  },
  {
    name: 'Samsung Galaxy S24',
    description: 'Android flagman, 256GB',
    price: 999.99,
    category: 'Electronics',
    stock: 60,
    sku: 'ELE-SGS24',
  },
  {
    name: 'Nike Air Max 270',
    description: 'Erkaklar uchun sport oyoq kiyimi',
    price: 149.99,
    category: 'Footwear',
    stock: 120,
    sku: 'FTW-NAM270',
  },
  {
    name: 'Adidas Ultraboost',
    description: 'Yugurish poyabzali',
    price: 179.99,
    category: 'Footwear',
    stock: 80,
    sku: 'FTW-AUB',
  },
  {
    name: 'MacBook Pro 14"',
    description: 'M3 Pro chip, 18GB RAM, 512GB SSD',
    price: 1999.0,
    category: 'Electronics',
    stock: 25,
    sku: 'ELE-MBP14',
  },
  {
    name: 'Sony WH-1000XM5',
    description: 'Noise-cancelling headphones',
    price: 399.99,
    category: 'Electronics',
    stock: 90,
    sku: 'ELE-SONYXM5',
  },
  {
    name: 'Levi\'s 501 Jeans',
    description: 'Klassik erkaklar jinsi',
    price: 89.99,
    category: 'Clothing',
    stock: 200,
    sku: 'CLT-LEV501',
  },
  {
    name: 'The North Face Jacket',
    description: 'Qishki kurtka',
    price: 249.99,
    category: 'Clothing',
    stock: 55,
    sku: 'CLT-TNFJ',
  },
];

const seed = async () => {
  try {
    await connectDB();
    await Product.deleteMany({});
    await Product.insertMany(sampleProducts);
    logger.info(`✅ Seeded ${sampleProducts.length} products`);
    process.exit(0);
  } catch (error) {
    logger.error('Seed error:', error);
    process.exit(1);
  }
};

seed();