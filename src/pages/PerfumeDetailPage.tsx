import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import WebApp from '@twa-dev/sdk';
import PerfumeSlider from '../components/PerfumeSlider';
import { useCart } from '../context/CartContext';
import { API_URL } from '../config.js';
import './PerfumeDetail.css';

interface VolumeOption {
  ml: number;
  price: number;
}

interface PerfumeImage {
  data: string;
  contentType: string;
}

interface Product {
  _id: string;
  name: string;
  brand: string;
  description: string;
  images: PerfumeImage[];
  volumes: VolumeOption[];
  category: string;
}

const PerfumeDetailPage = () => {
  const { id } = useParams();
  const { addToCart } = useCart();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedVolume, setSelectedVolume] = useState<number | null>(null);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await fetch(`${API_URL}/products/${id}`);
        if (!response.ok) {
          throw new Error('Failed to fetch product');
        }
        const data = await response.json();
        
        if (data.success) {
          setProduct(data.product);
          // Устанавливаем первый доступный объем как выбранный по умолчанию
          if (data.product.volumes.length > 0) {
            setSelectedVolume(data.product.volumes[0].ml);
          }
        } else {
          setError(data.message || 'Failed to fetch product');
        }
      } catch (err) {
        setError('Failed to fetch product');
        console.error('Error fetching product:', err);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchProduct();
    }
  }, [id]);

  const handleAddToCart = () => {
    if (product && selectedVolume) {
      const selectedVolumeOption = product.volumes.find(v => v.ml === selectedVolume);
      
      if (selectedVolumeOption) {
        addToCart({
          id: `${product._id}-${selectedVolume}`,
          name: `${product.name} (${selectedVolume}ml)`,
          price: selectedVolumeOption.price,
          image: product.images[0].data
        });

        WebApp.showPopup({
          title: 'Товар добавлен в корзину',
          message: `${product.name} (${selectedVolume}ml)`,
          buttons: [{ type: 'ok' }]
        });

        WebApp.sendData(JSON.stringify({
          type: 'ADD_TO_CART',
          product: {
            id: product._id,
            name: `${product.name} (${selectedVolume}ml)`,
            price: selectedVolumeOption.price,
            image: product.images[0].data
          }
        }));
      }
    }
  };

  if (loading) return <div className="loading">Загрузка...</div>;
  if (error) return <div className="error">Ошибка: {error}</div>;
  if (!product) return <div className="error">Товар не найден</div>;

  return (
    <div className="perfume-detail">
      <Link to="/" className="back-button">← Назад</Link>
      
      <div className="perfume-detail-container">
        <div className="perfume-detail-content">
          <PerfumeSlider images={product.images.map(img => img.data)} />

          <div className="perfume-info">
            <div className="perfume-header">
              <h1>{product.name}</h1>
              <h2>{product.brand}</h2>
            </div>

            <div className="volume-selector">
              <h3>Объём:</h3>
              <div className="volume-options">
                {product.volumes.map((option) => (
                  <label key={option.ml} className="volume-option">
                    <input
                      type="radio"
                      name="volume"
                      checked={selectedVolume === option.ml}
                      onChange={() => setSelectedVolume(option.ml)}
                    />
                    <span className="volume-label">
                      <span className="volume-size">{option.ml}ml</span>
                      <span className="volume-price">
                        {option.price.toLocaleString('ru-RU')} ₽
                      </span>
                    </span>
                  </label>
                ))}
              </div>
            </div>

            <div className="price-section">
              <div className="current-price">
                {selectedVolume && 
                  product.volumes.find(v => v.ml === selectedVolume)?.price.toLocaleString('ru-RU')} ₽
              </div>
            </div>

            <div className="description">
              {product.description.split('\n').map((paragraph, index) => (
                <p key={index} 
                   dangerouslySetInnerHTML={{
                     __html: paragraph.replace(
                       /\*\*(.*?)\*\*/g,
                       '<strong>$1</strong>'
                     )
                   }}
                />
              ))}
            </div>

            <button 
              className="add-to-cart" 
              onClick={handleAddToCart}
              disabled={!selectedVolume}
            >
              Добавить в корзину
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PerfumeDetailPage; 