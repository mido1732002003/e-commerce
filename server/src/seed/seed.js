require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../models/User');
const Product = require('../models/Product');
const connectDB = require('../config/db');

const seedData = async () => {
  try {
    await connectDB();

    // Clear existing data
    await User.deleteMany({});
    await Product.deleteMany({});

    // Create admin user
    const adminUser = await User.create({
      name: 'Admin User',
      email: 'admin@example.com',
      password: 'admin123',
      isAdmin: true,
    });

    console.log('Admin user created:', adminUser.email);

    // Create sample products
    const sampleProducts = [
      {
        name: 'Wireless Bluetooth Headphones',
        description: 'High-quality wireless headphones with noise cancellation and 30-hour battery life.',
        price: 99.99,
        category: 'Electronics',
        brand: 'AudioTech',
        images: [
          {
            url: 'https://res.cloudinary.com/demo/image/upload/v1/samples/ecommerce/leather-bag-gray.jpg',
            public_id: 'sample_1',
          },
        ],
        countInStock: 50,
        rating: 4.5,
        numReviews: 120,
      },
      {
        name: 'Smart Watch Pro',
        description: 'Advanced fitness tracking, heart rate monitor, and smartphone integration.',
        price: 299.99,
        category: 'Electronics',
        brand: 'TechWear',
        images: [
          {
            url: 'https://res.cloudinary.com/demo/image/upload/v1/samples/ecommerce/analog-classic.jpg',
            public_id: 'sample_2',
          },
        ],
        countInStock: 30,
        rating: 4.3,
        numReviews: 89,
      },
      {
        name: 'Premium Leather Backpack',
        description: 'Genuine leather backpack with laptop compartment and multiple pockets.',
        price: 149.99,
        category: 'Bags',
        brand: 'LeatherCraft',
        images: [
          {
            url: 'https://res.cloudinary.com/demo/image/upload/v1/samples/ecommerce/leather-bag-gray.jpg',
            public_id: 'sample_3',
          },
        ],
        countInStock: 25,
        rating: 4.7,
        numReviews: 65,
      },
      {
        name: 'Organic Cotton T-Shirt',
        description: 'Comfortable, eco-friendly t-shirt made from 100% organic cotton.',
        price: 29.99,
        category: 'Clothing',
        brand: 'EcoWear',
        images: [
          {
            url: 'https://res.cloudinary.com/demo/image/upload/v1/samples/ecommerce/accessories-bag.jpg',
            public_id: 'sample_4',
          },
        ],
        countInStock: 100,
        rating: 4.2,
        numReviews: 200,
      },
      {
        name: 'Professional Camera',
        description: '24MP DSLR camera with 4K video recording and advanced autofocus.',
        price: 1299.99,
        category: 'Electronics',
        brand: 'PhotoPro',
        images: [
          {
            url: 'https://res.cloudinary.com/demo/image/upload/v1/samples/ecommerce/shoes.png',
            public_id: 'sample_5',
          },
        ],
        countInStock: 15,
        rating: 4.8,
        numReviews: 45,
      },
      {
        name: 'Running Shoes',
        description: 'Lightweight, breathable running shoes with excellent cushioning.',
        price: 89.99,
        category: 'Footwear',
        brand: 'SportRun',
        images: [
          {
            url: 'https://res.cloudinary.com/demo/image/upload/v1/samples/ecommerce/shoes.png',
            public_id: 'sample_6',
          },
        ],
        countInStock: 60,
        rating: 4.4,
        numReviews: 150,
      },
    ];

    await Product.insertMany(sampleProducts);
    console.log(`${sampleProducts.length} products created`);

    console.log('Database seeded successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

seedData();