import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './AdminLayout.css';

type AdminSection = 'products' | 'categories' | 'banners' | 'orders';

interface AdminLayoutProps {
  children: React.ReactNode;
  activeSection: AdminSection;
  onSectionChange: (section: AdminSection) => void;
}

const AdminLayout: React.FC<AdminLayoutProps> = ({
  children,
  activeSection,
  onSectionChange,
}) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  return (
    <div className="admin-layout">
      <nav className={`admin-sidebar ${isSidebarOpen ? 'open' : 'closed'}`}>
        <div className="sidebar-header">
          <h2>Админ-панель</h2>
          <button
            className="toggle-sidebar"
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          >
            {isSidebarOpen ? '←' : '→'}
          </button>
        </div>
        <ul className="sidebar-menu">
          <li
            className={activeSection === 'products' ? 'active' : ''}
            onClick={() => onSectionChange('products')}
          >
            <i className="fas fa-box"></i>
            <span>Товары</span>
          </li>
          <li
            className={activeSection === 'categories' ? 'active' : ''}
            onClick={() => onSectionChange('categories')}
          >
            <i className="fas fa-tags"></i>
            <span>Категории</span>
          </li>
          <li
            className={activeSection === 'banners' ? 'active' : ''}
            onClick={() => onSectionChange('banners')}
          >
            <i className="fas fa-image"></i>
            <span>Баннеры</span>
          </li>
          <li
            className={activeSection === 'orders' ? 'active' : ''}
            onClick={() => onSectionChange('orders')}
          >
            <i className="fas fa-shopping-cart"></i>
            <span>Заказы</span>
          </li>
        </ul>
        <div className="sidebar-footer">
          <Link to="/" className="back-to-site">
            <i className="fas fa-arrow-left"></i>
            <span>Вернуться на сайт</span>
          </Link>
        </div>
      </nav>
      <main className="admin-content">
        {children}
      </main>
    </div>
  );
};

export default AdminLayout; 