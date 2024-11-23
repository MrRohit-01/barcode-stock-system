
import { Link, useNavigate } from 'react-router-dom';
import { 
  HomeIcon, 
  QrCodeIcon,
  ClipboardDocumentListIcon,
  ShoppingCartIcon,
  CurrencyDollarIcon,
  ArrowLeftOnRectangleIcon 
} from '@heroicons/react/24/outline';
import { useAuthStore } from '../../stores/authStore';

const Sidebar = () => {
  const navigate = useNavigate();
  const { logout } = useAuthStore();

  const menuItems = [
    { title: 'Dashboard', icon: HomeIcon, path: '/dashboard' },
    { title: 'Scan Barcode', icon: QrCodeIcon, path: '/dashboard/scan' },
    { title: 'Inventory', icon: ClipboardDocumentListIcon, path: '/dashboard/inventory' },
    { title: 'Cart', icon: ShoppingCartIcon, path: '/dashboard/cart' },
    { title: 'Billing', icon: CurrencyDollarIcon, path: '/dashboard/checkout' },
  ];

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <aside className="bg-gray-800 text-white w-64 min-h-screen p-4">
      <div className="mb-8">
        <h1 className="text-2xl font-bold">Inventory System</h1>
      </div>
      
      <nav className="flex flex-col justify-between h-[calc(100vh-8rem)]">
        <div>
          {menuItems.map((item) => (
            <Link
              key={item.title}
              to={item.path}
              className="flex items-center gap-2 p-3 hover:bg-gray-700 rounded-lg mb-1"
            >
              <item.icon className="w-5 h-5" />
              <span>{item.title}</span>
            </Link>
          ))}
        </div>
        
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 p-3 hover:bg-gray-700 rounded-lg mt-auto text-red-400 hover:text-red-300"
        >
          <ArrowLeftOnRectangleIcon className="w-5 h-5" />
          <span>Logout</span>
        </button>
      </nav>
    </aside>
  );
};

export default Sidebar; 