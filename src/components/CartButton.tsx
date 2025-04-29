import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import './CartButton.css';

const CartButton: React.FC = () => {
  const navigate = useNavigate();
  const { totalItems } = useCart();

  const handleClick = () => {
    navigate('/cart');
  };

  return (
    <button className="cart-button" onClick={handleClick}>
      🛒
      {totalItems > 0 && <span className="cart-count">{totalItems}</span>}
    </button>
  );
};

export default CartButton; 