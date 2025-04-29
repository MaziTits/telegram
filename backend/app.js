const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const productRoutes = require('./routes/productRoutes');
const cartRoutes = require('./routes/cartRoutes');
const categoryRoutes = require('./routes/categoryRoutes');
const authRoutes = require('./routes/authRoutes');
const orderRoutes = require('./routes/orderRoutes');

// Загрузка переменных окружения
dotenv.config();

// Обработка необработанных исключений
process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});

process.on('uncaughtException', (error) => {
  console.error('Uncaught Exception:', error);
  process.exit(1);
});

// Создание приложения
const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// Расширенное логирование запросов
app.use((req, res, next) => {
  console.log('\n=== Новый запрос ===');
  console.log('Время:', new Date().toISOString());
  console.log('Метод:', req.method);
  console.log('URL:', req.url);
  console.log('Path:', req.path);
  console.log('Query:', JSON.stringify(req.query, null, 2));
  console.log('Headers:', JSON.stringify(req.headers, null, 2));
  console.log('Body:', JSON.stringify(req.body, null, 2));
  console.log('==================\n');
  
  // Сохраняем оригинальный метод send
  const originalSend = res.send;
  
  // Переопределяем метод send для логирования ответа
  res.send = function(body) {
    console.log('\n=== Ответ ===');
    console.log('Status:', res.statusCode);
    console.log('Body:', body);
    console.log('=============\n');
    return originalSend.call(this, body);
  };
  
  next();
});

// Тестовый маршрут
app.get('/test', (req, res) => {
  console.log('Test route called');
  res.json({ message: 'Сервер работает!' });
});

// Подключение к базе данных
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/telegram-shop')
.then(() => {
  console.log('Connected to MongoDB successfully');
  console.log('MongoDB connection string:', process.env.MONGODB_URI || 'mongodb://localhost:27017/telegram-shop');
})
.catch(err => {
  console.error('MongoDB connection error:', err);
  process.exit(1);
});

// Добавляем обработчик ошибок mongoose
mongoose.connection.on('error', err => {
  console.error('MongoDB connection error:', err);
});

mongoose.connection.on('disconnected', () => {
  console.log('MongoDB disconnected');
});

// Маршруты
app.use('/api/products', productRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/orders', orderRoutes);

// Обработка ошибок
app.use((err, req, res, next) => {
  console.error('\n=== Ошибка ===');
  console.error('Время:', new Date().toISOString());
  console.error('URL:', req.url);
  console.error('Ошибка:', err.message);
  console.error('Стек:', err.stack);
  console.error('=============\n');
  
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  res.status(statusCode).json({
    message: err.message,
    stack: process.env.NODE_ENV === 'production' ? null : err.stack
  });
});

// Запуск сервера
const PORT = 4445;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
}); 