import React, { useState, useEffect } from 'react';
import { API_URL } from '../../config';
import './BannersManager.css';

interface Banner {
  id: string;
  title: string;
  image: string;
  link: string;
  isActive: boolean;
}

const BannersManager: React.FC = () => {
  const [banners, setBanners] = useState<Banner[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [currentBanner, setCurrentBanner] = useState<Banner | null>(null);

  useEffect(() => {
    fetchBanners();
  }, []);

  const fetchBanners = async () => {
    try {
      const response = await fetch(`${API_URL}/banners`);
      if (!response.ok) {
        throw new Error('Failed to fetch banners');
      }
      const data = await response.json();
      setBanners(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = (banner: Banner) => {
    setCurrentBanner(banner);
    setIsEditing(true);
  };

  const handleDelete = async (id: string) => {
    try {
      const response = await fetch(`${API_URL}/banners/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete banner');
      }

      setBanners(banners.filter(banner => banner.id !== id));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentBanner) return;

    try {
      const response = await fetch(`${API_URL}/banners${currentBanner.id ? `/${currentBanner.id}` : ''}`, {
        method: currentBanner.id ? 'PUT' : 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(currentBanner),
      });

      if (!response.ok) {
        throw new Error('Failed to save banner');
      }

      const savedBanner = await response.json();
      if (currentBanner.id) {
        setBanners(banners.map(b => b.id === savedBanner.id ? savedBanner : b));
      } else {
        setBanners([...banners, savedBanner]);
      }

      setIsEditing(false);
      setCurrentBanner(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    }
  };

  if (isLoading) return <div>Loading banners...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="banners-manager">
      <div className="banners-header">
        <h2>Управление баннерами</h2>
        <button
          className="add-banner-btn"
          onClick={() => {
            setCurrentBanner({
              id: '',
              title: '',
              image: '',
              link: '',
              isActive: true
            });
            setIsEditing(true);
          }}
        >
          Добавить баннер
        </button>
      </div>

      {isEditing && currentBanner && (
        <div className="banner-form">
          <h3>{currentBanner.id ? 'Редактировать баннер' : 'Новый баннер'}</h3>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Заголовок</label>
              <input
                type="text"
                value={currentBanner.title}
                onChange={(e) => setCurrentBanner({ ...currentBanner, title: e.target.value })}
                required
              />
            </div>
            <div className="form-group">
              <label>Изображение</label>
              <input
                type="text"
                value={currentBanner.image}
                onChange={(e) => setCurrentBanner({ ...currentBanner, image: e.target.value })}
                required
              />
            </div>
            <div className="form-group">
              <label>Ссылка</label>
              <input
                type="text"
                value={currentBanner.link}
                onChange={(e) => setCurrentBanner({ ...currentBanner, link: e.target.value })}
                required
              />
            </div>
            <div className="form-group">
              <label>
                <input
                  type="checkbox"
                  checked={currentBanner.isActive}
                  onChange={(e) => setCurrentBanner({ ...currentBanner, isActive: e.target.checked })}
                />
                Активен
              </label>
            </div>
            <div className="form-actions">
              <button type="submit">Сохранить</button>
              <button type="button" onClick={() => {
                setIsEditing(false);
                setCurrentBanner(null);
              }}>
                Отмена
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="banners-list">
        {banners.map((banner) => (
          <div key={banner.id} className="banner-card">
            <img src={banner.image} alt={banner.title} />
            <div className="banner-info">
              <h3>{banner.title}</h3>
              <p>{banner.link}</p>
              <div className="banner-status">
                Статус: {banner.isActive ? 'Активен' : 'Неактивен'}
              </div>
            </div>
            <div className="banner-actions">
              <button onClick={() => handleEdit(banner)}>Редактировать</button>
              <button onClick={() => handleDelete(banner.id)}>Удалить</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BannersManager; 