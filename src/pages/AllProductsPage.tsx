import React from 'react';
import useProductPolling from '../hooks/useProductPolling';
import { Box, Grid, Typography, CircularProgress } from '@mui/material';
import ProductCard from '../components/ProductCard';

interface Perfume {
  _id: string;
  name: string;
  brand: string;
  description: string;
  images: Array<{
    data: string;
    contentType: string;
  }>;
  volumes: Array<{
    ml: number;
    price: number;
  }>;
}

const AllProductsPage: React.FC = () => {
  // Не передаем категорию, чтобы получить все товары
  const { perfumes, loading, error } = useProductPolling<Perfume>();

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
        <Typography color="error">{error}</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Все товары
      </Typography>
      <Grid container spacing={3}>
        {perfumes.map((perfume) => (
          <Grid item xs={12} sm={6} md={4} lg={3} key={perfume._id}>
            <ProductCard product={perfume} />
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default AllProductsPage; 