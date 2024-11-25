import { Routes, Route } from 'react-router-dom';
import Sidebar from './Sidebar';
import Products from '../../pages/Products/Products';
import AddProduct from '../../pages/Products/AddProduct';
import { Outlet } from 'react-router-dom';
import { memo } from 'react';

const DashboardLayout = memo(() => {
  return (
    <div className="flex">
      <Sidebar />
      <main className="flex-1">
      <Outlet/>
        <Routes>
          <Route path="/products" element={<Products />} />
          <Route path="/products/add" element={<AddProduct />} />
          {/* Other routes */}
        </Routes>
      </main>
    </div>
  );
});

export default DashboardLayout; 