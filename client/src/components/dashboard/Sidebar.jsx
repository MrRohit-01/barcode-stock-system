import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  HomeIcon,
  CubeIcon,
  DocumentTextIcon,
  QrCodeIcon,
  Cog6ToothIcon,
  ArrowRightOnRectangleIcon,
  CurrencyDollarIcon,
  TagIcon,
  ClipboardDocumentListIcon,
  Bars3Icon,
  XMarkIcon
} from '@heroicons/react/24/outline';
import { useAuthStore } from '../../stores/authStore';

const Sidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const logout = useAuthStore((state) => state.logout);
  const [isOpen, setIsOpen] = useState(false);

  const menuItems = [
    { 
      section: 'Main',
      items: [
        { path: '/dashboard', icon: HomeIcon, label: 'Dashboard' },
        { path: '/dashboard/pos', icon: CurrencyDollarIcon, label: 'Point of Sale' },
      ]
    },
    {
      section: 'Inventory',
      items: [
        { path: '/dashboard/products', icon: CubeIcon, label: 'Products' },
        { path: '/dashboard/categories', icon: TagIcon, label: 'Categories' },
        { path: '/dashboard/scanner', icon: QrCodeIcon, label: 'Scan Products' },
      ]
    },
    {
      section: 'Sales',
      items: [
        { path: '/dashboard/transactions', icon: DocumentTextIcon, label: 'Transactions' },
      ]
    },
    {
      section: 'Settings',
      items: [
        { path: '/dashboard/settings', icon: Cog6ToothIcon, label: 'Settings' },
        { path: '/dashboard/audit-logs', icon: ClipboardDocumentListIcon, label: 'Audit Logs' },
      ]
    }
  ];

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  const closeSidebar = () => {
    setIsOpen(false);
  };

  return (
    <>
      {/* Hamburger Menu Button */}
      <button
        onClick={toggleSidebar}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 rounded-md bg-white shadow-md"
      >
        {isOpen ? (
          <XMarkIcon className="h-6 w-6 text-gray-600" />
        ) : (
          <Bars3Icon className="h-6 w-6 text-gray-600" />
        )}
      </button>

      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={closeSidebar}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed top-0 left-0 h-screen bg-white border-r border-gray-200 
          transition-transform duration-300 ease-in-out z-40
          w-64 lg:translate-x-0
          ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        `}
      >
        <div className="p-6 border-b border-gray-200">
          <h1 className="text-xl font-bold text-gray-800">Inventory System</h1>
        </div>
        
        <nav className="flex-1 overflow-y-auto py-4">
          {menuItems.map((section, index) => (
            <div key={index} className="mb-6">
              <h2 className="px-6 mb-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                {section.section}
              </h2>
              {section.items.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={closeSidebar}
                  className={`flex items-center px-6 py-3 text-gray-700 hover:bg-gray-100 transition-colors ${
                    location.pathname === item.path ? 'bg-gray-100 border-l-4 border-indigo-500' : ''
                  }`}
                >
                  <item.icon className="w-5 h-5 mr-3" />
                  <span className="font-medium">{item.label}</span>
                </Link>
              ))}
            </div>
          ))}
        </nav>

        <div className="border-t border-gray-200 p-4">
          <button
            onClick={handleLogout}
            className="flex items-center w-full px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ArrowRightOnRectangleIcon className="w-5 h-5 mr-3" />
            <span className="font-medium">Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content Wrapper */}
      <div className={`lg:ml-64 transition-margin duration-300 ease-in-out ${isOpen ? 'ml-64' : 'ml-0'}`}>
        {/* Your main content goes here */}
      </div>
    </>
  );
};

export default Sidebar; 