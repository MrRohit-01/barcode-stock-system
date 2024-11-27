import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import { memo } from 'react';

// eslint-disable-next-line react/display-name
const DashboardLayout = memo(() => {
  return (
    <div className="flex">
      <Sidebar />
      <main className="flex-1">
        <Outlet />
      </main>
    </div>
  );
});

export default DashboardLayout; 