const mongoose = require('mongoose');
const User = require('../models/User');
const dotenv = require('dotenv');

dotenv.config();

const createAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/telegram-shop');

    const adminData = {
      name: 'Admin',
      email: 'admin@example.com',
      password: 'admin123',
      isAdmin: true
    };

    const adminExists = await User.findOne({ email: adminData.email });
    if (adminExists) {
      console.log('Администратор уже существует');
      process.exit();
    }

    const admin = await User.create(adminData);
    console.log('Администратор успешно создан:', admin);
  } catch (error) {
    console.error('Ошибка при создании администратора:', error);
  } finally {
    process.exit();
  }
};

createAdmin(); 