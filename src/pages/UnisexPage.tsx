import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import useProductPolling from '../hooks/useProductPolling';
import './Pages.css';
import { PLACEHOLDER_IMAGE } from '../utils/constants';

interface PerfumeImage {
  data: string;
  contentType: string;
}

interface Perfume {
  _id: string;
  name: string;
  brand: string;
  description: string;
  images: PerfumeImage[];
  volumes: Array<{
    ml: number;
    price: number;
  }>;
}

const UnisexPage = () => {
  const navigate = useNavigate();
  const { perfumes, loading, error } = useProductPolling<Perfume>('unisex');

  if (loading) return <div className="page">Loading...</div>;
  if (error) return <div className="page">Error: {error}</div>;

  return (
    <div className="page">
      <Link to="/" className="back-button">← Назад</Link>
      <h1>Unisex / Унисекс</h1>
      <div className="perfume-grid">
        {perfumes.map((perfume) => (
          <div 
            key={perfume._id}
            className="perfume-card"
            onClick={() => navigate(`/perfume/${perfume._id}`)}
          >
            <img 
              className="product-image"
              src={perfume.images[0]?.data || PLACEHOLDER_IMAGE}
              alt={perfume.name}
              onError={(e) => {
                e.currentTarget.src = PLACEHOLDER_IMAGE;
              }}
            />
            <h3>{perfume.name}</h3>
            <p className="brand">{perfume.brand}</p>
            <p>{perfume.description}</p>
            <div className="perfume-price">
              от {perfume.volumes[0]?.price.toLocaleString('ru-RU')} ₽
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default UnisexPage; 