import { useState, useEffect } from 'react';
import { API_URL } from '../config';

interface PerfumeImage {
  data: string;
  contentType: string;
}

interface BasePerfume {
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

interface UseProductPollingResult<T> {
  perfumes: T[];
  loading: boolean;
  error: string | null;
}

const useProductPolling = <T extends BasePerfume = BasePerfume>(category?: string): UseProductPollingResult<T> => {
  const [perfumes, setPerfumes] = useState<T[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const url = category ? `${API_URL}/products?category=${category}` : `${API_URL}/products`;
        const response = await fetch(url);
        
        if (!response.ok) {
          throw new Error('Failed to fetch perfumes');
        }
        
        const data = await response.json();
        if (data.success) {
          setPerfumes(data.products as T[]);
        } else {
          throw new Error(data.message || 'Failed to fetch perfumes');
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [category]);

  return { perfumes, loading, error };
};

export default useProductPolling; 