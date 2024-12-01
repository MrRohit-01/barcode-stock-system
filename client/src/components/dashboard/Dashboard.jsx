import { 
  CurrencyDollarIcon, 
  ShoppingCartIcon, 
  QrCodeIcon, 
  ArchiveBoxIcon,
  ArrowUpIcon,
} from '@heroicons/react/24/outline';
import { Link } from 'react-router-dom';

const Dashboard = () => {
  // Dummy data
  const dummyData = {
    todaySales: {
      total: 12580.50,
      orders: 25,
      items: 67
    },
    recentSales: [
      { id: 1, time: '10:45 AM', amount: 156.80, items: 3 },
      { id: 2, time: '10:30 AM', amount: 89.90, items: 2 },
      { id: 3, time: '10:15 AM', amount: 245.50, items: 4 },
      { id: 4, time: '10:00 AM', amount: 178.25, items: 3 },
      { id: 5, time: '9:45 AM', amount: 92.40, items: 2 },
    ]
  };

  const quickActions = [
    { title: 'New Sale', icon: CurrencyDollarIcon, path: '/dashboard/pos', color: 'bg-blue-500' },
    { title: 'Scan Product', icon: QrCodeIcon, path: '/dashboard/scanner', color: 'bg-green-500' },
    { title: 'Add Product', icon: ArchiveBoxIcon, path: '/dashboard/products/add', color: 'bg-purple-500' },
  ];

  return (
    <div className="p-4 space-y-6">
      {/* Quick Actions */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {quickActions.map((action) => (
          <Link
            key={action.title}
            to={action.path}
            className={`${action.color} p-4 rounded-lg shadow-sm hover:opacity-90 transition-opacity`}
          >
            <div className="flex items-center text-white">
              <action.icon className="h-8 w-8 mr-3" />
              <span className="text-lg font-semibold">{action.title}</span>
            </div>
          </Link>
        ))}
      </div>

      {/* Today's Summary */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h2 className="text-lg font-semibold mb-4">Today's Summary</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="p-4 bg-blue-50 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Total Sales</p>
                <p className="text-2xl font-bold">₹{dummyData.todaySales.total.toLocaleString()}</p>
              </div>
              <CurrencyDollarIcon className="h-8 w-8 text-blue-500" />
            </div>
          </div>
          
          <div className="p-4 bg-green-50 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Orders</p>
                <p className="text-2xl font-bold">{dummyData.todaySales.orders}</p>
              </div>
              <ShoppingCartIcon className="h-8 w-8 text-green-500" />
            </div>
          </div>
          
          <div className="p-4 bg-purple-50 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Items Sold</p>
                <p className="text-2xl font-bold">{dummyData.todaySales.items}</p>
              </div>
              <ArchiveBoxIcon className="h-8 w-8 text-purple-500" />
            </div>
          </div>
        </div>
      </div>

      {/* Recent Sales */}
      <div className="bg-white rounded-lg shadow-sm">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-lg font-semibold">Recent Sales</h2>
        </div>
        <div className="p-4">
          <div className="space-y-4">
            {dummyData.recentSales.map((sale) => (
              <div key={sale.id} className="flex items-center justify-between p-4 hover:bg-gray-50 rounded-lg">
                <div className="flex items-center">
                  <div className="h-8 w-8 bg-gray-100 rounded-full flex items-center justify-center mr-3">
                    <ShoppingCartIcon className="h-4 w-4 text-gray-600" />
                  </div>
                  <div>
                    <p className="font-medium">Order #{sale.id}</p>
                    <p className="text-sm text-gray-500">{sale.time}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-medium">₹{sale.amount.toFixed(2)}</p>
                  <p className="text-sm text-gray-500">{sale.items} items</p>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="p-4 border-t border-gray-200">
          <Link 
            to="/dashboard/transactions" 
            className="text-blue-600 hover:text-blue-800 text-sm font-medium"
          >
            View All Sales →
          </Link>
        </div>
      </div>

      {/* Performance Indicator */}
      <div className="bg-gradient-to-r from-blue-500 to-indigo-600 rounded-lg shadow-sm p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold mb-1">Great job today!</h3>
            <p className="text-blue-100">Sales are up 12% from yesterday</p>
          </div>
          <div className="bg-white bg-opacity-20 rounded-full p-2">
            <ArrowUpIcon className="h-6 w-6" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard; 