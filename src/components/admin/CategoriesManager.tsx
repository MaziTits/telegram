import React, { useState, useEffect } from 'react';
import { API_URL } from '../../config.js';
import './CategoriesManager.css';
import { PLACEHOLDER_IMAGE } from '../../utils/constants';

type Category = {
  _id: string;
  name: string;
  image: {
    data: string;
    contentType: string;
  };
};

const CategoriesManager: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    image: null as File | null
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
      const response = await fetch(`${API_URL}/categories`);

      if (!response.ok) {
        throw new Error('Ошибка при загрузке категорий');
      }

      const data = await response.json();
      setCategories(data.success ? data.categories : []);
      setError('');
    } catch (err) {
      setError('Ошибка при загрузке категорий');
      console.error('Error fetching categories:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFormData(prev => ({ ...prev, image: e.target.files![0] }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const formDataToSend = new FormData();
    Object.entries(formData).forEach(([key, value]) => {
      if (value !== null) {
        formDataToSend.append(key, value);
      }
    });

    try {
      const url = editingCategory 
        ? `${API_URL}/categories/${editingCategory._id}` 
        : `${API_URL}/categories`;
      
      const method = editingCategory ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method,
        body: formDataToSend
      });

      if (!response.ok) {
        throw new Error('Ошибка при сохранении категории');
      }

      setShowModal(false);
      setEditingCategory(null);
      setFormData({
        name: '',
        image: null
      });
      await fetchData();
    } catch (err) {
      setError('Ошибка при сохранении категории');
      console.error('Error saving category:', err);
    }
  };

  const handleEdit = (category: Category) => {
    setEditingCategory(category);
    setFormData({
      name: category.name,
      image: null
    });
    setShowModal(true);
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Вы уверены, что хотите удалить эту категорию?')) {
      return;
    }

    try {
      const response = await fetch(`${API_URL}/categories/${id}`, {
        method: 'DELETE'
      });

      if (!response.ok) {
        throw new Error('Ошибка при удалении категории');
      }

      await fetchData();
    } catch (err) {
      setError('Ошибка при удалении категории');
      console.error('Error deleting category:', err);
    }
  };

  if (isLoading) {
    return <div className="loading">Загрузка...</div>;
  }

  return (
    <div className="categories-manager">
      <div className="header">
        <h2>Управление категориями</h2>
        <button 
          className="add-button"
          onClick={() => {
            setEditingCategory(null);
            setFormData({
              name: '',
              image: null
            });
            setShowModal(true);
          }}
        >
          Добавить категорию
        </button>
      </div>

      {error && <div className="error">{error}</div>}

      <div className="categories-grid">
        {categories.map(category => (
          <div key={category._id} className="category-card">
            <img 
              src={category.image?.data || PLACEHOLDER_IMAGE}
              alt={category.name}
              className="category-image"
              onError={(e) => {
                e.currentTarget.src = PLACEHOLDER_IMAGE;
              }}
            />
            <div className="category-info">
              <h3>{category.name}</h3>
            </div>
            <div className="category-actions">
              <button onClick={() => handleEdit(category)}>Редактировать</button>
              <button onClick={() => handleDelete(category._id)}>Удалить</button>
            </div>
          </div>
        ))}
      </div>

      {showModal && (
        <div className="modal">
          <div className="modal-content">
            <h3>{editingCategory ? 'Редактировать категорию' : 'Добавить категорию'}</h3>
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
                <label>Изображение:</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  required={!editingCategory}
                />
              </div>
              <div className="modal-actions">
                <button type="button" onClick={() => setShowModal(false)}>
                  Отмена
                </button>
                <button type="submit">
                  {editingCategory ? 'Сохранить' : 'Добавить'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default CategoriesManager; 