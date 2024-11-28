import { useEffect, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { useAuthStore } from '../../stores/authStore';
import axios from 'axios';
import { 
  UsersIcon, 
  CurrencyDollarIcon, 
  ShoppingCartIcon, 
  ChartBarIcon,
  QrCodeIcon, 
  ArchiveBoxIcon 
} from '@heroicons/react/24/outline';

const Dashboard = () => {
  const { token, user } = useAuthStore();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [dashboardData, setDashboardData] = useState({
    stats: {
      users: 0,
      revenue: 0,
      orders: 0,
      conversion: 0
    },
    recentTransactions: []
  });

  const fetchDashboardData = useCallback(async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_APP_URL}/api/dashboard/stats`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      if (response.data) {
        setDashboardData(response.data);
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  }, [token]);

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  // Quick action buttons - moved outside of render
  const quickActions = [
    { title: 'Scan Product', icon: QrCodeIcon, path: '/dashboard/scanner' },
    { title: 'New Sale', icon: ShoppingCartIcon, path: '/dashboard/cart' },
    { title: 'Add Product', icon: ArchiveBoxIcon, path: '/dashboard/products/add' },
  ];

  // Stats configuration - moved outside of render
  const stats = [
    { 
      title: 'Total Users', 
      value: dashboardData.stats.users.toLocaleString(), 
      icon: UsersIcon, 
      change: '+12%' 
    },
    { 
      title: 'Revenue', 
      value: `$${dashboardData.stats.revenue.toLocaleString()}`, 
      icon: CurrencyDollarIcon, 
      change: '+8%' 
    },
    { 
      title: 'Orders', 
      value: dashboardData.stats.orders.toLocaleString(), 
      icon: ShoppingCartIcon, 
      change: '+5%' 
    },
    { 
      title: 'Conversion', 
      value: `${dashboardData.stats.conversion}%`, 
      icon: ChartBarIcon, 
      change: '+2%' 
    }
  ];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-red-500">Error loading dashboard: {error}</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Dashboard</h1>
          <p className="text-gray-500">Welcome back, {user?.name}</p>
        </div>
        
        {/* Quick Actions */}
        <div className="flex gap-4">
          {quickActions.map((action) => (
            <Link
              key={action.title}
              to={action.path}
              className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              <action.icon className="w-5 h-5 mr-2" />
              {action.title}
            </Link>
          ))}
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <div key={stat.title} className="bg-white rounded-lg p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">{stat.title}</p>
                <p className="text-2xl font-semibold">{stat.value}</p>
              </div>
              <div className="bg-blue-50 p-3 rounded-full">
                <stat.icon className="w-6 h-6 text-blue-500" />
              </div>
            </div>
            <div className="mt-2">
              <span className="text-green-500 text-sm">{stat.change}</span>
              <span className="text-gray-500 text-sm"> vs last month</span>
            </div>
          </div>
        ))}
      </div>

      {/* Recent Activity Table */}
      <div className="bg-white rounded-lg shadow-sm">
        <div className="p-6">
          <h2 className="text-lg font-semibold mb-4">Recent Activity</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    User
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Action
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {dashboardData.recentTransactions.map((transaction) => (
                  <tr key={transaction.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{transaction.user}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{transaction.action}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {new Date(transaction.date).toLocaleDateString()}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        transaction.status === 'completed' 
                          ? 'bg-green-100 text-green-800'
                          : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {transaction.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard; 