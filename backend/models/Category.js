const mongoose = require('mongoose');

const imageSchema = new mongoose.Schema({
  data: {
    type: Buffer,
    required: true
  },
  contentType: {
    type: String,
    required: true
  }
});

const categorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Пожалуйста, укажите название категории'],
      trim: true,
      unique: true,
      maxLength: [50, 'Название категории не может превышать 50 символов']
    },
    slug: {
      type: String,
      unique: true
    },
    image: imageSchema
  },
  {
    timestamps: true
  }
);

// Создаем slug перед сохранением
categorySchema.pre('save', function(next) {
  if (this.name) {
    this.slug = this.name
      .toLowerCase()
      .replace(/[^a-zA-Z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');
  }
  next();
});

const Category = mongoose.model('Category', categorySchema);

module.exports = Category; 