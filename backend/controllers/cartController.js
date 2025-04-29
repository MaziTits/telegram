const User = require('../models/User');

// Получить корзину пользователя
exports.getCart = async (req, res) => {
  try {
    const { telegramId } = req.query;
    if (!telegramId) {
      return res.status(400).json({ success: false, message: 'Telegram ID is required' });
    }

    let user = await User.findOne({ telegramId }).populate('cart.productId');
    if (!user) {
      user = await User.create({ telegramId, cart: [] });
    }

    res.json({ success: true, cart: user.cart });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Добавить товар в корзину
exports.addToCart = async (req, res) => {
  try {
    const { telegramId, productId, volume, quantity } = req.body;
    if (!telegramId || !productId || !volume || !quantity) {
      return res.status(400).json({ 
        success: false, 
        message: 'Telegram ID, product ID, volume and quantity are required' 
      });
    }

    let user = await User.findOne({ telegramId });
    if (!user) {
      user = await User.create({ telegramId, cart: [] });
    }

    // Проверяем, есть ли уже такой товар в корзине
    const existingItem = user.cart.find(
      item => item.productId.toString() === productId && item.volume === volume
    );

    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      user.cart.push({ productId, volume, quantity });
    }

    await user.save();
    res.json({ success: true, cart: user.cart });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Обновить количество товара
exports.updateCartItem = async (req, res) => {
  try {
    const { telegramId, productId, volume, quantity } = req.body;
    if (!telegramId || !productId || !volume || !quantity) {
      return res.status(400).json({ 
        success: false, 
        message: 'Telegram ID, product ID, volume and quantity are required' 
      });
    }

    const user = await User.findOne({ telegramId });
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    const cartItem = user.cart.find(
      item => item.productId.toString() === productId && item.volume === volume
    );

    if (!cartItem) {
      return res.status(404).json({ success: false, message: 'Item not found in cart' });
    }

    cartItem.quantity = quantity;
    await user.save();
    res.json({ success: true, cart: user.cart });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Удалить товар из корзины
exports.removeFromCart = async (req, res) => {
  try {
    const { telegramId } = req.query;
    const { productId } = req.params;

    if (!telegramId || !productId) {
      return res.status(400).json({ 
        success: false, 
        message: 'Telegram ID and product ID are required' 
      });
    }

    const user = await User.findOne({ telegramId });
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    user.cart = user.cart.filter(
      item => item.productId.toString() !== productId
    );

    await user.save();
    res.json({ success: true, cart: user.cart });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
}; 