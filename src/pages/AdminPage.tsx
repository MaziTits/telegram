import React, { useState } from 'react';
import AdminLayout from '../components/admin/AdminLayout';
import ProductsManager from '../components/admin/ProductsManager';
import CategoriesManager from '../components/admin/CategoriesManager';
import OrdersManager from '../components/admin/OrdersManager';
import BannersManager from '../components/admin/BannersManager';
import './AdminPage.css';

type AdminSection = 'products' | 'categories' | 'banners' | 'orders';

const AdminPage: React.FC = () => {
  const [activeSection, setActiveSection] = useState<AdminSection>('products');

  const renderContent = () => {
    switch (activeSection) {
      case 'products':
        return <ProductsManager />;
      case 'categories':
        return <CategoriesManager />;
      case 'banners':
        return <BannersManager />;
      case 'orders':
        return <OrdersManager />;
      default:
        return null;
    }
  };

  return (
    <AdminLayout
      activeSection={activeSection}
      onSectionChange={setActiveSection}
    >
      {renderContent()}
    </AdminLayout>
  );
};

export default AdminPage; 