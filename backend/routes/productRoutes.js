const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const { upload, handleUploadErrors, rateLimiter, logImageRequest } = require('../middleware/uploadMiddleware');

// Роуты для продуктов
router.get('/', productController.getProducts);
router.get('/:id', productController.getProduct);
router.post('/', logImageRequest, rateLimiter, upload.single('image'), handleUploadErrors, productController.createProduct);
router.put('/:id', logImageRequest, rateLimiter, upload.single('image'), handleUploadErrors, productController.updateProduct);
router.delete('/:id', productController.deleteProduct);

module.exports = router; 