const Product = require('../models/Product');
const Category = require('../models/Category');

// Placeholder image as data URL
const PLACEHOLDER_IMAGE = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8=';

// Получить все продукты
const getProducts = async (req, res) => {
  try {
    const { category } = req.query;
    let query = {};
    
    if (category) {
      // Сначала найдем категорию по slug
      const categoryDoc = await Category.findOne({ slug: category });
      if (categoryDoc) {
        query.category = categoryDoc._id; // Используем ID категории для поиска
      } else {
        // Если категория не найдена, возвращаем пустой список
        return res.json({ success: true, products: [] });
      }
    }
    
    const products = await Product.find(query);
    
    // Приводим images к единому виду (как в getProduct)
    const productsWithProcessedImages = products.map(product => {
      const productObj = product.toObject();
      productObj.images = (product.images || []).map(img => {
        if (!img || typeof img !== 'object') {
          return {
            contentType: 'image/png',
            data: PLACEHOLDER_IMAGE
          };
        }
        try {
          return {
            contentType: img.contentType || 'image/png',
            data: img.data ? `data:${img.contentType || 'image/png'};base64,${Buffer.isBuffer(img.data) ? img.data.toString('base64') : img.data}` : PLACEHOLDER_IMAGE
          };
        } catch (error) {
          return {
            contentType: 'image/png',
            data: PLACEHOLDER_IMAGE
          };
        }
      });
      return productObj;
    });
    
    res.json({ success: true, products: productsWithProcessedImages });
  } catch (error) {
    console.error('Error getting products:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Получить один продукт
const getProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    // Преобразуем бинарные данные в base64
    const productObj = product.toObject();
    if (!Array.isArray(product.images)) {
      productObj.images = [];
    } else {
      productObj.images = product.images.map(img => {
        if (!img || typeof img !== 'object') {
          return {
            contentType: 'image/png',
            data: PLACEHOLDER_IMAGE
          };
        }
        try {
          return {
            contentType: img.contentType || 'image/png',
            data: img.data ? `data:${img.contentType || 'image/png'};base64,${img.data.toString('base64')}` : PLACEHOLDER_IMAGE
          };
        } catch (error) {
          console.error('Error converting image:', error);
          return {
            contentType: 'image/png',
            data: PLACEHOLDER_IMAGE
          };
        }
      });
    }

    res.json({ success: true, product: productObj });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Создать новый продукт
const createProduct = async (req, res) => {
  try {
    console.log('Создание продукта...');
    console.log('Файл:', req.file);
    console.log('Тело запроса:', req.body);

    if (!req.file) {
      return res.status(400).json({ 
        success: false, 
        message: 'Необходимо загрузить изображение' 
      });
    }

    // Проверка размера файла
    if (req.file.size > 5 * 1024 * 1024) {
      return res.status(400).json({
        success: false,
        message: 'Размер файла превышает 5MB'
      });
    }

    // Проверка типа файла
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    if (!allowedTypes.includes(req.file.mimetype)) {
      return res.status(400).json({
        success: false,
        message: 'Неподдерживаемый формат изображения. Разрешены: JPEG, PNG, GIF, WebP'
      });
    }

    let volumes;
    try {
      volumes = JSON.parse(req.body.volumes);
    } catch (error) {
      console.error('Ошибка парсинга объемов:', error);
      return res.status(400).json({
        success: false,
        message: 'Неверный формат данных для объемов'
      });
    }

    const productData = {
      ...req.body,
      volumes,
      images: [{
        data: req.file.buffer,
        contentType: req.file.mimetype
      }]
    };
    
    console.log('Сохранение продукта...');
    const product = new Product(productData);
    await product.save();
    
    // Преобразуем бинарные данные в base64 для ответа
    const productObj = product.toObject();
    try {
      productObj.images = product.images.map(img => ({
        contentType: img.contentType,
        data: `data:${img.contentType};base64,${img.data.toString('base64')}`
      }));
    } catch (error) {
      console.error('Ошибка конвертации изображения в base64:', error);
      productObj.images = [{
        contentType: 'image/png',
        data: PLACEHOLDER_IMAGE
      }];
    }
    
    console.log('Продукт успешно создан');
    res.status(201).json({ success: true, product: productObj });
  } catch (error) {
    console.error('Ошибка создания продукта:', error);
    res.status(400).json({ 
      success: false, 
      message: error.message || 'Ошибка при создании товара' 
    });
  }
};

// Обновить продукт
const updateProduct = async (req, res) => {
  try {
    console.log('Обновление продукта...');
    console.log('ID продукта:', req.params.id);
    console.log('Файл:', req.file);
    console.log('Тело запроса:', req.body);

    const updates = { ...req.body };
    
    if (req.file) {
      // Проверка размера файла
      if (req.file.size > 5 * 1024 * 1024) {
        return res.status(400).json({
          success: false,
          message: 'Размер файла превышает 5MB'
        });
      }

      // Проверка типа файла
      const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
      if (!allowedTypes.includes(req.file.mimetype)) {
        return res.status(400).json({
          success: false,
          message: 'Неподдерживаемый формат изображения. Разрешены: JPEG, PNG, GIF, WebP'
        });
      }

      updates.images = [{
        data: req.file.buffer,
        contentType: req.file.mimetype
      }];
    }

    if (updates.volumes) {
      try {
        updates.volumes = JSON.parse(updates.volumes);
      } catch (error) {
        console.error('Ошибка парсинга объемов:', error);
        return res.status(400).json({
          success: false,
          message: 'Неверный формат данных для объемов'
        });
      }
    }

    console.log('Обновление в базе данных...');
    const product = await Product.findByIdAndUpdate(
      req.params.id,
      updates,
      { new: true, runValidators: true }
    );
    
    if (!product) {
      return res.status(404).json({ success: false, message: 'Продукт не найден' });
    }

    // Преобразуем бинарные данные в base64 для ответа
    const productObj = product.toObject();
    try {
      productObj.images = product.images.map(img => ({
        contentType: img.contentType,
        data: `data:${img.contentType};base64,${img.data.toString('base64')}`
      }));
    } catch (error) {
      console.error('Ошибка конвертации изображения в base64:', error);
      productObj.images = [{
        contentType: 'image/png',
        data: PLACEHOLDER_IMAGE
      }];
    }

    console.log('Продукт успешно обновлен');
    res.json({ success: true, product: productObj });
  } catch (error) {
    console.error('Ошибка обновления продукта:', error);
    res.status(400).json({ 
      success: false, 
      message: error.message || 'Ошибка при обновлении товара' 
    });
  }
};

// Удалить продукт
const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }
    res.json({ success: true, message: 'Product deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Получение информации о продукте
const getProductInfo = async (req, res) => {
  try {
    console.log('Getting product with ID:', req.params.id);
    const product = await Product.findById(req.params.id);
    console.log('Found product:', product);
    
    if (!product) {
      console.log('Product not found');
      return res.status(404).json({ 
        success: false, 
        message: 'Продукт не найден' 
      });
    }

    const productInfo = product.getProductInfo();
    console.log('Product info:', productInfo);

    res.status(200).json({
      success: true,
      data: productInfo
    });
  } catch (error) {
    console.error('Error getting product:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Ошибка при получении информации о продукте',
      error: error.message 
    });
  }
};

// Обновление количества товара
const updateStock = async (req, res) => {
  try {
    console.log('Updating stock with data:', req.body);
    const { productId, volumeSize, newStock } = req.body;

    if (!productId || !volumeSize || newStock === undefined) {
      console.log('Missing required fields');
      return res.status(400).json({ 
        success: false, 
        message: 'Необходимо указать productId, volumeSize и newStock' 
      });
    }

    if (newStock < 0) {
      console.log('Invalid stock value:', newStock);
      return res.status(400).json({ 
        success: false, 
        message: 'Количество товара не может быть отрицательным' 
      });
    }

    const product = await Product.findById(productId);
    console.log('Found product:', product);

    if (!product) {
      console.log('Product not found');
      return res.status(404).json({ 
        success: false, 
        message: 'Продукт не найден' 
      });
    }

    const volumeIndex = product.volumes.findIndex(v => v.size === volumeSize);
    console.log('Volume index:', volumeIndex);

    if (volumeIndex === -1) {
      console.log('Volume not found:', volumeSize);
      return res.status(404).json({ 
        success: false, 
        message: 'Указанный объем не найден' 
      });
    }

    product.volumes[volumeIndex].stock = newStock;
    await product.save();
    console.log('Product updated successfully');

    const updatedInfo = product.getProductInfo();
    console.log('Updated product info:', updatedInfo);

    res.status(200).json({
      success: true,
      message: 'Количество товара успешно обновлено',
      data: updatedInfo
    });
  } catch (error) {
    console.error('Error updating stock:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Ошибка при обновлении количества товара',
      error: error.message 
    });
  }
};

// Экспортируем все функции
module.exports = {
  getProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
  getProductInfo,
  updateStock
}; 