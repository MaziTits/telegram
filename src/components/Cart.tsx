import React from 'react';
import { useCart } from '../context/CartContext';
import './Cart.css';

const Cart: React.FC = () => {
  const { items, removeFromCart, updateQuantity, totalPrice } = useCart();

  return (
    <div className="cart-container">
      <h2>Корзина</h2>
      {items.length === 0 ? (
        <p className="empty-cart">Корзина пуста</p>
      ) : (
        <>
          <div className="cart-items">
            {items.map((item) => (
              <div key={item.id} className="cart-item">
                <img src={item.image} alt={item.name} className="cart-item-image" />
                <div className="cart-item-details">
                  <h3>{item.name}</h3>
                  <p className="price">{item.price} ₽</p>
                  <div className="quantity-controls">
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      className="quantity-btn"
                    >
                      -
                    </button>
                    <span className="quantity">{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      className="quantity-btn"
                    >
                      +
                    </button>
                  </div>
                </div>
                <button
                  onClick={() => removeFromCart(item.id)}
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
              <span className="total-price">{totalPrice} ₽</span>
            </div>
            <button className="checkout-btn">Оформить заказ</button>
          </div>
        </>
      )}
    </div>
  );
};

export default Cart; 