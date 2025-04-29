import React, { useState, useEffect } from 'react';
import { API_URL } from '../../config.js';
import './ProductsManager.css';
import { PLACEHOLDER_IMAGE } from '../../utils/constants';

type Product = {
  _id: string;
  name: string;
  brand: string;
  description: string;
  price: number;
  category: string;
  volumes: Array<{
    ml: number;
    price: number;
  }>;
  images: Array<{
    data: string;
    contentType: string;
  }>;
};

type Category = {
  _id: string;
  name: string;
};

const ProductsManager: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    brand: '',
    description: '',
    category: '',
    image: null as File | null,
    volumes: [{ ml: 50, price: 0 }]
  });

  useEffect(() => {
    fetchData();
    
    // Обновление данных каждые 30 секунд
    const interval = setInterval(fetchData, 30000);
    
    // Очистка при размонтировании
    return () => clearInterval(interval);
  }, []); // Пустой массив зависимостей означает, что эффект запустится только при монтировании

  const fetchData = async () => {
    try {
      setIsLoading(true);
      console.log('Fetching products and categories...');
      
      const [productsResponse, categoriesResponse] = await Promise.all([
        fetch(`${API_URL}/products`),
        fetch(`${API_URL}/categories`)
      ]);

      console.log('Products response status:', productsResponse.status);
      console.log('Categories response status:', categoriesResponse.status);

      if (!productsResponse.ok || !categoriesResponse.ok) {
        throw new Error('Ошибка при загрузке данных');
      }

      const [productsData, categoriesData] = await Promise.all([
        productsResponse.json(),
        categoriesResponse.json()
      ]);

      console.log('Products data:', productsData);
      console.log('Categories data:', categoriesData);
      
      const productsArray = productsData.success ? productsData.products : [];
      
      if (!Array.isArray(productsArray)) {
        console.error('Products data is not an array:', productsArray);
        setError('Некорректный формат данных товаров');
        setProducts([]);
        return;
      }

      setProducts(productsArray);
      setCategories(categoriesData.success ? categoriesData.categories : []);
      setError('');
    } catch (err) {
      setError('Ошибка при загрузке данных');
      console.error('Error fetching data:', err);
      setProducts([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFormData(prev => ({ ...prev, image: e.target.files![0] }));
    }
  };

  const handleVolumeChange = (index: number, field: 'ml' | 'price', value: string) => {
    setFormData(prev => ({
      ...prev,
      volumes: prev.volumes.map((v, i) => 
        i === index ? { ...v, [field]: Number(value) } : v
      )
    }));
  };

  const addVolume = () => {
    setFormData(prev => ({
      ...prev,
      volumes: [...prev.volumes, { ml: 50, price: 0 }]
    }));
  };

  const removeVolume = (index: number) => {
    setFormData(prev => ({
      ...prev,
      volumes: prev.volumes.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (isSubmitting) {
      return;
    }

    setIsSubmitting(true);
    setError('');
    
    const formDataToSend = new FormData();
    Object.entries(formData).forEach(([key, value]) => {
      if (key === 'volumes') {
        formDataToSend.append('volumes', JSON.stringify(value));
      } else if (key === 'image' && value instanceof File) {
        formDataToSend.append('image', value);
      } else if (typeof value === 'string') {
        formDataToSend.append(key, value);
      }
    });

    try {
      const url = editingProduct 
        ? `${API_URL}/products/${editingProduct._id}` 
        : `${API_URL}/products`;
      
      const method = editingProduct ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method,
        headers: {
          'Accept': 'application/json',
        },
        body: formDataToSend
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Ошибка при сохранении товара');
      }

      setShowModal(false);
      setEditingProduct(null);
      setFormData({
        name: '',
        brand: '',
        description: '',
        category: '',
        image: null,
        volumes: [{ ml: 50, price: 0 }]
      });
      
      await fetchData();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Ошибка при сохранении товара');
      console.error('Error saving product:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEdit = (product: Product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      brand: product.brand,
      description: product.description,
      category: product.category,
      image: null,
      volumes: product.volumes
    });
    setShowModal(true);
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Вы уверены, что хотите удалить этот товар?')) {
      return;
    }

    try {
      const response = await fetch(`${API_URL}/products/${id}`, {
        method: 'DELETE'
      });

      if (!response.ok) {
        throw new Error('Ошибка при удалении товара');
      }

      await fetchData();
    } catch (err) {
      setError('Ошибка при удалении товара');
      console.error('Error deleting product:', err);
    }
  };

  if (isLoading) {
    return <div className="loading">Загрузка...</div>;
  }

  return (
    <div className="products-manager">
      <div className="header">
        <h2>Управление товарами</h2>
        <button 
          className="add-button"
          onClick={() => {
            console.log('Add button clicked');
            setEditingProduct(null);
            setFormData({
              name: '',
              brand: '',
              description: '',
              category: '',
              image: null,
              volumes: [{ ml: 50, price: 0 }]
            });
            setShowModal(true);
          }}
        >
          Добавить товар
        </button>
      </div>

      {error && <div className="error">{error}</div>}

      <div className="products-grid">
        {products.map(product => (
          <div key={product._id} className="product-card">
            <img 
              src={product.images[0]?.data || PLACEHOLDER_IMAGE}
              alt={product.name}
              className="product-image"
              onError={(e) => {
                e.currentTarget.src = PLACEHOLDER_IMAGE;
              }}
            />
            <div className="product-info">
              <h3>{product.name}</h3>
              <p className="brand">{product.brand}</p>
              <div className="volumes">
                {product.volumes.map((v, i) => (
                  <p key={i} className="volume-price">
                    {v.ml}мл - {v.price}₽
                  </p>
                ))}
              </div>
              <p className="category">
                {categories.find(c => c._id === product.category)?.name}
              </p>
            </div>
            <div className="product-actions">
              <button onClick={() => handleEdit(product)}>Редактировать</button>
              <button onClick={() => handleDelete(product._id)}>Удалить</button>
            </div>
          </div>
        ))}
      </div>

      {showModal && (
        <div className="modal">
          <div className="modal-content">
            <h3>{editingProduct ? 'Редактировать товар' : 'Добавить товар'}</h3>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Название:</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="form-group">
                <label>Бренд:</label>
                <input
                  type="text"
                  name="brand"
                  value={formData.brand}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="form-group">
                <label>Описание:</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="form-group">
                <label>Категория:</label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  required
                >
                  <option value="">Выберите категорию</option>
                  {categories.map(category => (
                    <option key={category._id} value={category._id}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label>Объемы и цены:</label>
                {formData.volumes.map((volume, index) => (
                  <div key={index} className="volume-inputs">
                    <input
                      type="number"
                      value={volume.ml}
                      onChange={(e) => handleVolumeChange(index, 'ml', e.target.value)}
                      placeholder="Объем (мл)"
                      required
                    />
                    <input
                      type="number"
                      value={volume.price}
                      onChange={(e) => handleVolumeChange(index, 'price', e.target.value)}
                      placeholder="Цена"
                      required
                    />
                    {formData.volumes.length > 1 && (
                      <button type="button" onClick={() => removeVolume(index)}>
                        Удалить
                      </button>
                    )}
                  </div>
                ))}
                <button type="button" onClick={addVolume}>
                  Добавить объем
                </button>
              </div>
              <div className="form-group">
                <label>Изображение:</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  required={!editingProduct}
                />
              </div>
              <div className="modal-actions">
                <button 
                  type="button" 
                  onClick={() => setShowModal(false)}
                  disabled={isSubmitting}
                >
                  Отмена
                </button>
                <button 
                  type="submit"
                  disabled={isSubmitting}
                >
                  {isSubmitting 
                    ? 'Сохранение...' 
                    : (editingProduct ? 'Сохранить' : 'Добавить')
                  }
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductsManager; 