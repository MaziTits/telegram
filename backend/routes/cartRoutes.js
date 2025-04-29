const express = require('express');
const router = express.Router();
const cartController = require('../controllers/cartController');
const Order = require('../models/Order');

// Получить корзину пользователя
router.get('/cart', cartController.getCart);

// Добавить товар в корзину
router.post('/cart', cartController.addToCart);

// Обновить количество товара
router.put('/cart', cartController.updateCartItem);

// Удалить товар из корзины
router.delete('/cart/:productId', cartController.removeFromCart);

// Оформить заказ
router.post('/checkout', async (req, res) => {
  try {
    const { userId, items, totalAmount } = req.body;
    
    const order = new Order({
      userId,
      items,
      totalAmount,
      status: 'pending'
    });
    
    await order.save();
    
    // Очистить корзину после создания заказа
    await cartController.clearCart(userId);
    
    res.status(201).json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router; 