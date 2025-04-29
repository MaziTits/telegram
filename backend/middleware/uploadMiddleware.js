const multer = require('multer');
const path = require('path');

// Хранилище для отслеживания последней загрузки
const uploadTimestamps = new Map();

// Настройка хранилища в памяти
const storage = multer.memoryStorage();

// Логирование запросов изображений
const logImageRequest = (req, res, next) => {
  console.log('\n=== Запрос на работу с изображением ===');
  console.log('Время:', new Date().toISOString());
  console.log('IP:', req.ip);
  console.log('Метод:', req.method);
  console.log('URL:', req.originalUrl);
  console.log('Headers:', JSON.stringify(req.headers, null, 2));
  if (req.file) {
    console.log('Файл:', {
      originalname: req.file.originalname,
      mimetype: req.file.mimetype,
      size: req.file.size + ' bytes'
    });
  }
  console.log('====================================\n');
  next();
};

// Middleware для проверки частоты загрузки
const rateLimiter = (req, res, next) => {
  const ip = req.ip;
  const now = Date.now();
  const lastUpload = uploadTimestamps.get(ip) || 0;
  const timeWindow = 10000; // 10 секунд

  console.log('\n=== Проверка частоты загрузки ===');
  console.log('IP:', ip);
  console.log('Последняя загрузка:', new Date(lastUpload).toISOString());
  console.log('Текущее время:', new Date(now).toISOString());
  console.log('Интервал:', (now - lastUpload) / 1000, 'секунд');

  if (now - lastUpload < timeWindow) {
    console.log('Слишком частые запросы. Отклонено.');
    console.log('================================\n');
    return res.status(429).json({
      success: false,
      message: 'Пожалуйста, подождите 10 секунд перед следующей загрузкой'
    });
  }

  console.log('Запрос разрешен');
  console.log('================================\n');
  uploadTimestamps.set(ip, now);
  next();
};

// Фильтр файлов
const fileFilter = (req, file, cb) => {
  console.log('\n=== Проверка файла ===');
  console.log('Имя файла:', file.originalname);
  console.log('MIME-тип:', file.mimetype);
  
  const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
  
  if (allowedTypes.includes(file.mimetype)) {
    console.log('Формат файла разрешен');
    console.log('===================\n');
    cb(null, true);
  } else {
    console.log('Формат файла запрещен');
    console.log('===================\n');
    cb(new Error('Неподдерживаемый формат изображения. Разрешены: JPEG, PNG, GIF, WebP'), false);
  }
};

// Настройка multer
const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB
    files: 5 // Максимум 5 файлов
  }
});

// Middleware для обработки ошибок загрузки
const handleUploadErrors = (err, req, res, next) => {
  console.log('\n=== Ошибка загрузки ===');
  console.log('Тип ошибки:', err.name);
  console.log('Сообщение:', err.message);
  console.log('======================\n');

  if (err instanceof multer.MulterError) {
    if (err.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({
        success: false,
        message: 'Размер файла превышает 5MB'
      });
    }
    if (err.code === 'LIMIT_FILE_COUNT') {
      return res.status(400).json({
        success: false,
        message: 'Превышено максимальное количество файлов (5)'
      });
    }
  }
  
  if (err.message.includes('Неподдерживаемый формат')) {
    return res.status(400).json({
      success: false,
      message: err.message
    });
  }
  
  next(err);
};

module.exports = {
  upload,
  handleUploadErrors,
  rateLimiter,
  logImageRequest
}; 