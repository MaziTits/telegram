const mongoose = require('mongoose');
const Category = require('../models/Category');

async function updateCategories() {
  try {
    await mongoose.connect('mongodb://127.0.0.1:27017/perfume_shop');
    console.log('Connected to MongoDB');

    // Очищаем коллекцию категорий
    await Category.deleteMany({});
    console.log('Existing categories deleted');

    const categories = [
      {
        name: 'Женская парфюмерия',
        image: '/images/categories/category-image.jpg',
        slug: 'women-perfume'
      },
      {
        name: 'Мужская парфюмерия',
        image: '/images/categories/category-image.jpg',
        slug: 'men-perfume'
      },
      {
        name: 'Унисекс парфюмерия',
        image: '/images/categories/category-image.jpg',
        slug: 'unisex-perfume'
      },
      {
        name: 'Парфюмерные наборы',
        image: '/images/categories/category-image.jpg',
        slug: 'perfume-sets'
      }
    ];

    for (const categoryData of categories) {
      const newCategory = new Category(categoryData);
      await newCategory.save();
      console.log(`Created new category: ${categoryData.name}`);
    }

    console.log('Categories update completed');
  } catch (error) {
    console.error('Error updating categories:', error);
  } finally {
    await mongoose.connection.close();
    console.log('Database connection closed');
  }
}

updateCategories(); 