const Category = require('../models/Category');
const asyncHandler = require('express-async-handler');

// @desc    Получить все категории
// @route   GET /api/categories
// @access  Public
const getAllCategories = asyncHandler(async (req, res) => {
  const categories = await Category.find({});
  
  // Преобразуем бинарные данные в base64
  const categoriesWithBase64Images = categories.map(category => {
    const categoryObj = category.toObject();
    if (category.image) {
      categoryObj.image = {
        contentType: category.image.contentType,
        data: `data:${category.image.contentType};base64,${category.image.data.toString('base64')}`
      };
    }
    return categoryObj;
  });
  
  res.json({ success: true, categories: categoriesWithBase64Images });
});

// @desc    Получить категорию по ID
// @route   GET /api/categories/:id
// @access  Public
const getCategory = asyncHandler(async (req, res) => {
  const category = await Category.findById(req.params.id);
  if (category) {
    // Преобразуем бинарные данные в base64
    const categoryObj = category.toObject();
    if (category.image) {
      categoryObj.image = {
        contentType: category.image.contentType,
        data: `data:${category.image.contentType};base64,${category.image.data.toString('base64')}`
      };
    }
    res.json(categoryObj);
  } else {
    res.status(404);
    throw new Error('Категория не найдена');
  }
});

// @desc    Создать категорию
// @route   POST /api/categories
// @access  Private/Admin
const createCategory = asyncHandler(async (req, res) => {
  const { name } = req.body;

  if (!req.file) {
    res.status(400);
    throw new Error('Пожалуйста, загрузите изображение');
  }

  try {
    const category = await Category.create({
      name,
      image: {
        data: req.file.buffer,
        contentType: req.file.mimetype
      }
    });

    // Преобразуем бинарные данные в base64 для ответа
    const categoryObj = category.toObject();
    categoryObj.image = {
      contentType: category.image.contentType,
      data: `data:${category.image.contentType};base64,${category.image.data.toString('base64')}`
    };

    res.status(201).json(categoryObj);
  } catch (error) {
    if (error.code === 11000) {
      res.status(400);
      throw new Error('Категория с таким названием уже существует');
    }
    throw error;
  }
});

// @desc    Обновить категорию
// @route   PUT /api/categories/:id
// @access  Private/Admin
const updateCategory = asyncHandler(async (req, res) => {
  const { name } = req.body;
  const category = await Category.findById(req.params.id);

  if (category) {
    try {
      category.name = name || category.name;
      if (req.file) {
        category.image = {
          data: req.file.buffer,
          contentType: req.file.mimetype
        };
      }

      const updatedCategory = await category.save();
      
      // Преобразуем бинарные данные в base64 для ответа
      const categoryObj = updatedCategory.toObject();
      categoryObj.image = {
        contentType: updatedCategory.image.contentType,
        data: `data:${updatedCategory.image.contentType};base64,${updatedCategory.image.data.toString('base64')}`
      };

      res.json(categoryObj);
    } catch (error) {
      if (error.code === 11000) {
        res.status(400);
        throw new Error('Категория с таким названием уже существует');
      }
      throw error;
    }
  } else {
    res.status(404);
    throw new Error('Категория не найдена');
  }
});

// @desc    Удалить категорию
// @route   DELETE /api/categories/:id
// @access  Private/Admin
const deleteCategory = asyncHandler(async (req, res) => {
  const category = await Category.findById(req.params.id);

  if (category) {
    await category.deleteOne();
    res.json({ message: 'Категория удалена' });
  } else {
    res.status(404);
    throw new Error('Категория не найдена');
  }
});

module.exports = {
  getAllCategories,
  getCategory,
  createCategory,
  updateCategory,
  deleteCategory
}; 