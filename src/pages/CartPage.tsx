import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import WebApp from '@twa-dev/sdk';
import { useCart } from '../context/CartContext';
import './CartPage.css';

interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
}

const CartPage: React.FC = () => {
  const { items, updateQuantity, removeFromCart, totalPrice } = useCart();
  const [showRemovePopup, setShowRemovePopup] = useState(false);
  const [itemToRemove, setItemToRemove] = useState<string | null>(null);

  const handleQuantityChange = (id: string, newQuantity: number) => {
    if (newQuantity < 1) {
      setItemToRemove(id);
      setShowRemovePopup(true);
    } else {
      updateQuantity(id, newQuantity);
    }
  };

  const handleRemoveItem = (id: string) => {
    setItemToRemove(id);
    setShowRemovePopup(true);
  };

  const confirmRemove = () => {
    if (itemToRemove) {
      removeFromCart(itemToRemove);
      setShowRemovePopup(false);
      setItemToRemove(null);
    }
  };

  const handleCheckout = () => {
    WebApp.MainButton.text = "Оформить заказ";
    WebApp.MainButton.show();
    WebApp.MainButton.onClick(() => {
      WebApp.sendData(JSON.stringify({
        type: 'CHECKOUT',
        items: items,
        totalAmount: totalPrice
      }));
    });
  };

  if (items.length === 0) {
    return (
      <div className="empty-cart-container">
        <h2>Корзина пуста</h2>
        <Link to="/" className="continue-shopping">Продолжить покупки</Link>
      </div>
    );
  }

  return (
    <div className="cart-page">
      <h2>Корзина</h2>
      <div className="cart-items">
        {items.map((item) => (
          <div key={item.id} className="cart-item">
            <img
              src={item.image}
              alt={item.name}
              className="item-image"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.src = '/placeholder.jpg';
                console.error('Error loading image:', item.image);
              }}
            />
            <div className="item-details">
              <h3>{item.name}</h3>
              <p className="item-price">{item.price} ₽</p>
              <div className="quantity-controls">
                <button
                  onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                  className="quantity-btn"
                >
                  -
                </button>
                <span className="quantity">{item.quantity}</span>
                <button
                  onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                  className="quantity-btn"
                >
                  +
                </button>
              </div>
            </div>
            <button
              onClick={() => handleRemoveItem(item.id)}
              className="remove-btn"
            >
              ✕
            </button>
          </div>
        ))}
      </div>

      <div className="cart-summary">
        <div className="total">
          <span>Итого:</span>
          <span>{totalPrice} ₽</span>
        </div>
        <button onClick={handleCheckout} className="checkout-btn">
          Оформить заказ
        </button>
      </div>

      {showRemovePopup && (
        <div className="popup-overlay">
          <div className="popup">
            <h3>Удалить товар?</h3>
            <div className="popup-buttons">
              <button onClick={confirmRemove} className="confirm-btn">
                Да
              </button>
              <button
                onClick={() => {
                  setShowRemovePopup(false);
                  setItemToRemove(null);
                }}
                className="cancel-btn"
              >
                Нет
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CartPage; 