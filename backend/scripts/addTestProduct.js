const mongoose = require('mongoose');
const Product = require('../models/Product');

mongoose.connect('mongodb://localhost:27017/telegram-shop', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('Connected to MongoDB'))
.catch(err => console.error('MongoDB connection error:', err));

const testProduct = {
  name: 'Baccarat Rouge 540 Extrait De Parfum',
  brand: 'Maison Francis Kurkdjian Paris',
  description: `**Восточный цветочный** аромат для мужчин и женщин.

**Верхние ноты:** шафран, жасмин
**Средние ноты:** амбра, древесные ноты
**Базовые ноты:** пихтовый бальзам, кедр

Роскошный, теплый и чувственный аромат, который оставляет незабываемый шлейф. Extrait de Parfum - это более концентрированная версия оригинального аромата, которая обеспечивает более глубокое и длительное звучание на коже.`,
  category: 'unisex',
  images: ['/images/products/baccarat-rouge-540.jpg'],
  volumes: [
    { ml: 35, price: 24900 },
    { ml: 70, price: 37900 },
    { ml: 200, price: 89900 }
  ]
};

async function addTestProduct() {
  try {
    const product = new Product(testProduct);
    await product.save();
    console.log('Test product added successfully:', product);
  } catch (error) {
    console.error('Error adding test product:', error);
  } finally {
    mongoose.connection.close();
  }
}

addTestProduct(); 