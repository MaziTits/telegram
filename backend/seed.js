const mongoose = require('mongoose');
require('dotenv').config();
const Product = require('./models/Product');

// Подключение к базе данных
mongoose.connect('mongodb://localhost:27017/telegram-shop')
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

// Тестовые данные
const products = [
  {
    name: 'Baccarat Rouge 540',
    brand: 'Maison Francis Kurkdjian',
    description: 'Классический женский аромат',
    category: 'women',
    images: [{
      data: Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8=', 'base64'),
      contentType: 'image/png'
    }],
    volumes: [
      { ml: 50, price: 5100, stock: 10 },
      { ml: 100, price: 8900, stock: 5 }
    ]
  },
  {
    name: 'Bleu de Chanel',
    brand: 'CHANEL',
    description: 'Элегантный мужской аромат',
    category: 'men',
    images: [{
      data: Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8=', 'base64'),
      contentType: 'image/png'
    }],
    volumes: [
      { ml: 50, price: 4900, stock: 8 },
      { ml: 100, price: 8500, stock: 3 }
    ]
  },
  {
    name: 'Light Blue',
    brand: 'Dolce & Gabbana',
    description: 'Универсальный аромат для всех',
    category: 'unisex',
    images: [{
      data: Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8=', 'base64'),
      contentType: 'image/png'
    }],
    volumes: [
      { ml: 50, price: 4500, stock: 12 },
      { ml: 100, price: 7900, stock: 6 }
    ]
  },
  {
    name: 'Luxury Collection',
    brand: 'Various',
    description: 'Набор премиальных ароматов',
    category: 'sets',
    images: [{
      data: Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8=', 'base64'),
      contentType: 'image/png'
    }],
    volumes: [
      { ml: 50, price: 12000, stock: 4 }
    ]
  }
];

// Функция для добавления тестовых данных
const seedDatabase = async () => {
  try {
    // Очищаем коллекцию продуктов
    await Product.deleteMany({});
    console.log('Cleared products collection');

    // Добавляем тестовые продукты
    await Product.insertMany(products);
    console.log('Successfully seeded database');
  } catch (error) {
    console.error('Error seeding database:', error);
  } finally {
    // Закрываем соединение с базой данных
    await mongoose.connection.close();
  }
};

// Запускаем заполнение базы данных
seedDatabase(); 