const mongoose = require('mongoose');

const volumeOptionSchema = new mongoose.Schema({
  ml: {
    type: Number,
    required: true,
    min: [0, 'Объем не может быть отрицательным']
  },
  price: {
    type: Number,
    required: true,
    min: [0, 'Цена не может быть отрицательной']
  },
  stock: {
    type: Number,
    required: true,
    default: 0,
    min: [0, 'Количество не может быть отрицательным']
  }
});

const imageSchema = new mongoose.Schema({
  data: {
    type: Buffer,
    required: [true, 'Изображение обязательно'],
    validate: {
      validator: function(v) {
        // Проверяем, что буфер не пустой и его размер не превышает 5MB
        return v && v.length > 0 && v.length <= 5 * 1024 * 1024;
      },
      message: 'Размер изображения должен быть больше 0 и не превышать 5MB'
    }
  },
  contentType: {
    type: String,
    required: [true, 'Тип изображения обязателен'],
    enum: {
      values: ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
      message: 'Поддерживаются только форматы: JPEG, PNG, GIF, WebP'
    }
  }
});

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  brand: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true,
    trim: true
  },
  category: {
    type: String,
    ref: 'Category',
    required: true
  },
  images: [imageSchema],
  volumes: [volumeOptionSchema],
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Индексы для оптимизации запросов
productSchema.index({ name: 1 });
productSchema.index({ brand: 1 });
productSchema.index({ category: 1 });
productSchema.index({ 'volumes.price': 1 });

// Метод для получения информации о продукте с учетом наличия
productSchema.methods.getProductInfo = function() {
  const productInfo = this.toObject();
  
  // Проверяем наличие товара для каждого объема
  productInfo.volumes = productInfo.volumes.map(volume => ({
    ...volume,
    isAvailable: volume.stock > 0,
    displayPrice: volume.stock > 0 
      ? `${volume.price} ₽`
      : 'Товар закончился'
  }));

  return productInfo;
};

module.exports = mongoose.model('Product', productSchema); 