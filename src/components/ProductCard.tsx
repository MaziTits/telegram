import React from 'react';
import { Card, CardContent, CardMedia, Typography, Box } from '@mui/material';
import { useNavigate } from 'react-router-dom';

interface Volume {
  ml: number;
  price: number;
}

interface Product {
  _id: string;
  name: string;
  brand: string;
  description: string;
  images: Array<{
    data: string;
    contentType: string;
  }>;
  volumes: Volume[];
}

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const navigate = useNavigate();
  const minPrice = Math.min(...product.volumes.map(v => v.price));

  const handleClick = () => {
    navigate(`/perfume/${product._id}`);
  };

  return (
    <Card 
      sx={{ 
        cursor: 'pointer',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        '&:hover': {
          boxShadow: 6
        }
      }}
      onClick={handleClick}
    >
      <CardMedia
        component="img"
        height="200"
        image={product.images[0]?.data || '/placeholder.png'}
        alt={product.name}
        sx={{ objectFit: 'contain', p: 2 }}
      />
      <CardContent sx={{ flexGrow: 1 }}>
        <Typography gutterBottom variant="h6" component="div">
          {product.name}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {product.brand}
        </Typography>
        <Box sx={{ mt: 2 }}>
          <Typography variant="h6" color="primary">
            от {minPrice}₽
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );
};

export default ProductCard; 