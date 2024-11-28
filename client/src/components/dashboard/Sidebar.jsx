import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  HomeIcon,
  CubeIcon,
  ShoppingCartIcon,
  DocumentTextIcon,
  QrCodeIcon,
  TruckIcon,
  UsersIcon,
  Cog6ToothIcon,
  ArrowRightOnRectangleIcon,
  ChartBarIcon
} from '@heroicons/react/24/outline';
import { useAuthStore } from '../../stores/authStore';

const Sidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const logout = useAuthStore((state) => state.logout);
  
  const menuItems = [
    { 
      section: 'Main',
      items: [
        { path: '/dashboard', icon: HomeIcon, label: 'Dashboard' },
        { path: '/dashboard/cart', icon: ShoppingCartIcon, label: 'New Sale' },
      ]
    },
    {
      section: 'Inventory',
      items: [
        { path: '/dashboard/products', icon: CubeIcon, label: 'Products' },
        { path: '/dashboard/inventory', icon: TruckIcon, label: 'Stock Movement' },
        { path: '/dashboard/scanner', icon: QrCodeIcon, label: 'Scan Products' },
      ]
    },
    {
      section: 'Reports',
      items: [
        { path: '/dashboard/transactions', icon: DocumentTextIcon, label: 'Transactions' },
        { path: '/dashboard/reports', icon: ChartBarIcon, label: 'Reports' },
      ]
    },
    {
      section: 'Administration',
      items: [
        { path: '/dashboard/users', icon: UsersIcon, label: 'Users' },
        { path: '/dashboard/settings', icon: Cog6ToothIcon, label: 'Settings' },
      ]
    }
  ];

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <aside className="w-64 h-screen bg-white border-r border-gray-200 flex flex-col fixed">
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

      {/* User section at bottom */}
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
  );
};

export default Sidebar; 