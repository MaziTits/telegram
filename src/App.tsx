import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation, useNavigate } from 'react-router-dom';
import WebApp from '@twa-dev/sdk';
import SearchBar from './components/SearchBar';
import CategoryCard from './components/CategoryCard';
import WomenPage from './pages/WomenPage';
import MenPage from './pages/MenPage';
import UnisexPage from './pages/UnisexPage';
import SetsPage from './pages/SetsPage';
import PerfumeDetailPage from './pages/PerfumeDetailPage';
import AdminPage from './pages/AdminPage';
import AllProductsPage from './pages/AllProductsPage';
import Cart from './components/Cart';
import CartButton from './components/CartButton';
import { CartProvider } from './context/CartContext';
import { API_URL } from './config.js';
import './App.css';

// В начале файла добавляем интерфейс для window.Telegram
declare global {
  interface Window {
    Telegram?: {
      WebApp?: typeof WebApp;
    };
  }
}

interface Category {
  _id: string;
  name: string;
  image: {
    data: string;
    contentType: string;
  };
  slug: string;
}

const AppContent = () => {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    // Проверяем, что мы не в админ-панели
    if (location.pathname === '/admin') {
      return;
    }

    try {
      // Инициализация Telegram WebApp только если мы в контексте Telegram
      if (window.Telegram?.WebApp) {
        WebApp.ready();
        WebApp.expand();

        // Проверяем поддержку BackButton
        const backButton = WebApp.BackButton;
        if (backButton && typeof backButton.show === 'function' && typeof backButton.hide === 'function') {
          // Настройка кнопки "Назад"
          if (location.pathname !== '/') {
            try {
              backButton.show();
              backButton.onClick(() => {
                navigate(-1);
              });
            } catch (error) {
              console.warn('BackButton API not fully supported:', error);
            }
          } else {
            try {
              backButton.hide();
            } catch (error) {
              console.warn('BackButton API not fully supported:', error);
            }
          }

          // Очистка при размонтировании
          return () => {
            try {
              if (backButton.offClick) {
                backButton.offClick(() => {});
              }
            } catch (error) {
              console.warn('BackButton cleanup failed:', error);
            }
          };
        } else {
          console.warn('BackButton API not available in this version');
        }
      }
    } catch (error) {
      console.error('Error initializing Telegram WebApp:', error);
    }
  }, [location.pathname, navigate]);

  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/all" element={<AllProductsPage />} />
        <Route path="/women" element={<WomenPage />} />
        <Route path="/men" element={<MenPage />} />
        <Route path="/unisex" element={<UnisexPage />} />
        <Route path="/sets" element={<SetsPage />} />
        <Route path="/perfume/:id" element={<PerfumeDetailPage />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/admin" element={<AdminPage />} />
      </Routes>
      
      {/* Показываем кнопку корзины на всех страницах, кроме самой корзины и админки */}
      {location.pathname !== '/cart' && location.pathname !== '/admin' && <CartButton />}
    </div>
  );
};

const HomePage = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const fetchCategories = async () => {
      try {
        const response = await fetch(`${API_URL}/categories`);
        if (!response.ok) {
          throw new Error('Ошибка при загрузке категорий');
        }
        const data = await response.json();
        if (isMounted) {
          setCategories(data.success ? data.categories : []);
          setError(null);
        }
      } catch (err) {
        if (isMounted) {
          setError('Ошибка при загрузке категорий');
          console.error('Error fetching categories:', err);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchCategories();

    return () => {
      isMounted = false;
    };
  }, []);

  if (loading) {
    return <div>Загрузка...</div>;
  }

  return (
    <>
      <SearchBar />
      
      <div className="banner">
        <h1>Вопрос? Ответ!</h1>
        <h1 className="banner-subtitle">Question? Answer!</h1>
      </div>

      {error && <div className="error">{error}</div>}

      <div className="categories-grid">
        <CategoryCard
          key="all"
          title="Все товары"
          subtitle="Все товары"
          image="/placeholder.png"
          path="/all"
        />
        {categories.map(category => (
          <CategoryCard
            key={category._id}
            title={category.name}
            subtitle={category.name}
            image={category.image?.data || '/placeholder.png'}
            path={`/${category.slug}`}
          />
        ))}
      </div>

      <footer className="footer">
        <p>Егор красавчик</p>
      </footer>
    </>
  );
};

function App() {
  return (
    <CartProvider>
      <Router>
        <AppContent />
      </Router>
    </CartProvider>
  );
}

export default App; 