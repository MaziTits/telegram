const mongoose = require('mongoose');
const Product = require('../models/Product');

const products = [
  {
    name: 'Light Blue',
    brand: 'Dolce & Gabbana',
    description: 'Легкий, свежий аромат для женщин',
    category: '681117c4d01e4ea95f7f2843', // ID категории "Для женщин"
    images: [{
      data: Buffer.from('R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7', 'base64'),
      contentType: 'image/gif'
    }],
    volumes: [
      { ml: 50, price: 5990, stock: 10 },
      { ml: 100, price: 8990, stock: 5 }
    ]
  },
  {
    name: 'Sauvage',
    brand: 'Dior',
    description: 'Мужской аромат с нотами бергамота',
    category: '681117c4d01e4ea95f7f2845', // ID категории "Для мужчин"
    images: [{
      data: Buffer.from('R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7', 'base64'),
      contentType: 'image/gif'
    }],
    volumes: [
      { ml: 60, price: 6990, stock: 8 },
      { ml: 100, price: 9990, stock: 3 }
    ]
  },
  {
    name: 'CK One',
    brand: 'Calvin Klein',
    description: 'Универсальный аромат для мужчин и женщин',
    category: '681117c4d01e4ea95f7f2847', // ID категории "Унисекс"
    images: [{
      data: Buffer.from('R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7', 'base64'),
      contentType: 'image/gif'
    }],
    volumes: [
      { ml: 50, price: 3990, stock: 15 },
      { ml: 100, price: 5990, stock: 7 },
      { ml: 200, price: 8990, stock: 3 }
    ]
  }
];

async function seedProducts() {
  try {
    await mongoose.connect('mongodb://localhost:27017/telegram-shop');
    console.log('Connected to MongoDB');

    // Очищаем существующие товары
    await Product.deleteMany({});
    console.log('Existing products cleared');

    // Добавляем новые товары
    const result = await Product.insertMany(products);
    console.log('Products added:', result);

    console.log('Seeding completed successfully');
  } catch (error) {
    console.error('Error seeding products:', error);
  } finally {
    mongoose.disconnect();
  }
}

seedProducts(); 