const mongoose = require('mongoose');
const Category = require('../models/Category');
const Product = require('../models/Product');

mongoose.connect('mongodb://localhost:27017/telegram-shop')
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

async function checkCategories() {
  try {
    console.log('Checking categories...');
    const categories = await Category.find();
    console.log('All categories:', JSON.stringify(categories, null, 2));

    console.log('\nChecking products...');
    const products = await Product.find();
    console.log('All products:', JSON.stringify(products, null, 2));

    console.log('\nChecking products by category...');
    for (const category of categories) {
      const productsInCategory = await Product.find({ category: category._id });
      console.log(`\nProducts in category ${category.name} (${category._id}):`);
      console.log(JSON.stringify(productsInCategory, null, 2));
    }
  } catch (error) {
    console.error('Error:', error);
  } finally {
    mongoose.connection.close();
  }
}

checkCategories(); 