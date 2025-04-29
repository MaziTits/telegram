import React from 'react';
import { useNavigate } from 'react-router-dom';
import './CategoryCard.css';

interface CategoryCardProps {
  title: string;
  subtitle: string;
  image: string;
  path: string;
}

const CategoryCard: React.FC<CategoryCardProps> = ({ title, subtitle, image, path }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(path);
  };

  return (
    <div className="category-card" 
         style={{ backgroundImage: `url(${image})` }}
         onClick={handleClick}>
      <div className="category-content">
        <h2>{title}</h2>
        <p>{subtitle}</p>
      </div>
    </div>
  );
};

export default CategoryCard; 