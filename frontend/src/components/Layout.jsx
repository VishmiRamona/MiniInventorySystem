import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import { useState, useEffect } from 'react';
import NotificationDropdown from './NotificationDropdown';

const Layout = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [user, setUser] = useState({ username: 'Admin', role: 'Administrator' });

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem('user') || '{}');
    setUser({
      username: userData.username || 'Admin',
      role: userData.role || 'Administrator'
    });
  }, []);

  return (
    <div className="flex h-screen bg-[#F8FAFC]">
      {/* Sidebar */}
      <Sidebar collapsed={collapsed} setCollapsed={setCollapsed} />

      {/* Main Content */}
      <div className={`flex-1 flex flex-col min-h-screen overflow-y-auto transition-all duration-300 ${collapsed ? 'ml-[80px]' : 'ml-[260px]'}`}>
        {/* Top Navigation */}
        <header className="h-[70px] min-h-[70px] max-h-[70px] bg-white shadow-[0px_1px_6px_rgba(0,0,0,0.08)] sticky top-0 z-40 flex items-center justify-between px-6 flex-shrink-0">
          {/* Inventory Management System */}
          <div className="flex items-center gap-2">
            <span className="text-lg font-semibold text-gray-800">Inventory Management System</span>
          </div>

          <div className="flex items-center gap-4 flex-shrink-0">
            {/* Notification Dropdown */}
            <NotificationDropdown />

            <div className="flex items-center gap-3 flex-shrink-0">
              <div className="w-9 h-9 min-w-[36px] min-h-[36px] rounded-full bg-[#2563EB] flex items-center justify-center text-white text-sm font-bold">
                {user.username.charAt(0).toUpperCase()}
              </div>
              <div className="hidden sm:block flex-shrink-0">
                <p className="text-sm font-medium text-gray-700">{user.username}</p>
                <p className="text-xs text-[#64748B]">{user.role}</p>
              </div>
            </div>
          </div>
        </header>

        <main className="flex-1 p-8 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Layout;