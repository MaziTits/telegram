const mongoose = require('mongoose');
const Category = require('../models/Category');
const fs = require('fs').promises;
const path = require('path');

const categories = [
  {
    name: 'Для женщин',
    slug: 'women',
    title: 'For Women',
    subtitle: 'Для неё',
    image: {
      data: Buffer.from('R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7', 'base64'),
      contentType: 'image/gif'
    }
  },
  {
    name: 'Для мужчин',
    slug: 'men',
    title: 'For Men',
    subtitle: 'Для него',
    image: {
      data: Buffer.from('R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7', 'base64'),
      contentType: 'image/gif'
    }
  },
  {
    name: 'Унисекс',
    slug: 'unisex',
    title: 'Unisex',
    subtitle: 'Для двоих',
    image: {
      data: Buffer.from('R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7', 'base64'),
      contentType: 'image/gif'
    }
  },
  {
    name: 'Наборы',
    slug: 'sets',
    title: 'Perfume Sets',
    subtitle: 'Наборы',
    image: {
      data: Buffer.from('R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7', 'base64'),
      contentType: 'image/gif'
    }
  }
];

async function seedCategories() {
  try {
    await mongoose.connect('mongodb://localhost:27017/telegram-shop');
    console.log('Connected to MongoDB');

    // Очищаем существующие категории
    await Category.deleteMany({});
    console.log('Existing categories cleared');

    // Добавляем новые категории
    const result = await Category.insertMany(categories);
    console.log('Categories added:', result);

    console.log('Seeding completed successfully');
  } catch (error) {
    console.error('Error seeding categories:', error);
  } finally {
    mongoose.disconnect();
  }
}

seedCategories(); 