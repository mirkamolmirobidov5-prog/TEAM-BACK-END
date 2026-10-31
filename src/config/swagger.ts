import swaggerJsdoc from 'swagger-jsdoc';

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'SmartBiz API',
      version: '1.0.0',
      description:
        'SmartBiz — Do‘kon boshqaruv tizimi Backend API. Express.js + MongoDB + TypeScript.',
      contact: {
        name: 'SmartBiz Team',
      },
    },
    servers: [
      {
        url: 'http://localhost:5000/api/v1',
        description: 'Development server',
      },
      {
        url: 'http://localhost:5000/api/v1',
        description: 'Docker environment',
      },
    ],
    components: {
      schemas: {
        Product: {
          type: 'object',
          properties: {
            _id: { type: 'string' },
            name: { type: 'string' },
            description: { type: 'string' },
            price: { type: 'number' },
            category: { type: 'string' },
            stock: { type: 'integer' },
            images: { type: 'array', items: { type: 'string' } },
            sku: { type: 'string' },
            isActive: { type: 'boolean' },
            isInStock: { type: 'boolean', description: 'Virtual field' },
            createdAt: { type: 'string', format: 'date-time' },
            updatedAt: { type: 'string', format: 'date-time' },
          },
        },
        Order: {
          type: 'object',
          properties: {
            _id: { type: 'string' },
            orderNumber: { type: 'string' },
            customerName: { type: 'string' },
            customerPhone: { type: 'string' },
            customerEmail: { type: 'string' },
            items: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  product: { type: 'string' },
                  quantity: { type: 'integer' },
                  priceAtPurchase: { type: 'number' },
                  nameAtPurchase: { type: 'string' },
                },
              },
            },
            totalAmount: { type: 'number' },
            status: {
              type: 'string',
              enum: ['pending', 'confirmed', 'shipped', 'delivered', 'cancelled'],
            },
            notes: { type: 'string' },
            itemsCount: { type: 'integer', description: 'Virtual field' },
            createdAt: { type: 'string', format: 'date-time' },
            updatedAt: { type: 'string', format: 'date-time' },
          },
        },
        Error: {
          type: 'object',
          properties: {
            status: { type: 'string' },
            message: { type: 'string' },
          },
        },
      },
    },
  },
  apis: ['./src/routes/*.ts', './dist/routes/*.js'],
};

const swaggerSpec = swaggerJsdoc(options);

export default swaggerSpec;