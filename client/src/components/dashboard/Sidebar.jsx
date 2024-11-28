import { Link, useLocation } from 'react-router-dom';
import { IconHome, IconPackage } from '@tabler/icons-react';

const Sidebar = () => {
  const location = useLocation();
  
  const menuItems = [
    { path: '/dashboard', icon: IconHome, label: 'Dashboard' },
    { path: '/dashboard/products', icon: IconPackage, label: 'Products' },
  ];

  return (
    <aside className="w-64 h-screen bg-white border-r border-gray-200 flex flex-col fixed">
      <div className="p-6 border-b border-gray-200">
        <h1 className="text-xl font-bold text-gray-800">Inventory System</h1>
      </div>
      
      <nav className="flex-1 overflow-y-auto py-4">
        {menuItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={`flex items-center px-6 py-3 text-gray-700 hover:bg-gray-100 transition-colors ${
              location.pathname === item.path ? 'bg-gray-100 border-l-4 border-indigo-500' : ''
            }`}
          >
            <item.icon className="w-5 h-5 mr-3" />
            <span className="font-medium">{item.label}</span>
          </Link>
        ))}
      </nav>
    </aside>
  );
};

export default Sidebar; 