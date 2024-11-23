import React from 'react';
import { 
  UsersIcon, CurrencyDollarIcon, 
  ShoppingCartIcon, ChartBarIcon 
} from '@heroicons/react/24/outline';

const Dashboard = () => {
  const stats = [
    { title: 'Total Users', value: '1,234', icon: UsersIcon, change: '+12%' },
    { title: 'Revenue', value: '$12,345', icon: CurrencyDollarIcon, change: '+8%' },
    { title: 'Orders', value: '456', icon: ShoppingCartIcon, change: '+5%' },
    { title: 'Conversion', value: '2.4%', icon: ChartBarIcon, change: '+2%' },
  ];

  return (
    <div>
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
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
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">User</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Action</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {/* Add your table rows here */}
                <tr>
                  <td className="px-6 py-4">John Doe</td>
                  <td className="px-6 py-4">Created new post</td>
                  <td className="px-6 py-4">2024-03-20</td>
                  <td className="px-6 py-4">
                    <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-sm">
                      Completed
                    </span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard; 