
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';

const DashboardLayout = () => {
  return (
    <div className="flex">
      <Sidebar />
      <main className="flex-1">
        <Outlet />
      </main>
    </div>
  );
};

export default DashboardLayout; 