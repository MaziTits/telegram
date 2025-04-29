const express = require('express');
const router = express.Router();
const { upload, handleUploadErrors, rateLimiter, logImageRequest } = require('../middleware/uploadMiddleware');
const {
  getAllCategories,
  getCategory,
  createCategory,
  updateCategory,
  deleteCategory
} = require('../controllers/categoryController');

// Публичные маршруты
router.get('/', getAllCategories);
router.get('/:id', getCategory);

// Защищенные маршруты (проверка пароля происходит в контроллере)
router.post('/', logImageRequest, rateLimiter, upload.single('image'), handleUploadErrors, createCategory);
router.put('/:id', logImageRequest, rateLimiter, upload.single('image'), handleUploadErrors, updateCategory);
router.delete('/:id', deleteCategory);

module.exports = router; 