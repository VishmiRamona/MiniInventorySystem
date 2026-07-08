import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  BookOpen,
  FolderTree,
  Users,
  Package,
  PackageOpen,
  BarChart3,
  AlertTriangle,
  LogOut,
  User,
  Menu,
} from 'lucide-react';
import { useEffect, useState } from 'react';

const Sidebar = ({ collapsed, setCollapsed }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [userRole, setUserRole] = useState('Staff');

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    setUserRole(user.role || 'Staff');
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('user');
    navigate('/login');
  };

  const navItems = [
    { path: '/', label: 'Dashboard', icon: LayoutDashboard, roles: ['Administrator', 'Manager', 'Staff'] },
    { path: '/items', label: 'Books', icon: BookOpen, roles: ['Administrator', 'Manager'] },
    { path: '/categories', label: 'Categories', icon: FolderTree, roles: ['Administrator', 'Manager'] },
    { path: '/suppliers', label: 'Suppliers', icon: Users, roles: ['Administrator', 'Manager'] },
    { path: '/stock/in', label: 'Stock In', icon: Package, roles: ['Administrator', 'Manager', 'Staff'] },
    { path: '/stock/out', label: 'Stock Out', icon: PackageOpen, roles: ['Administrator', 'Manager', 'Staff'] },
    { path: '/stock/balance', label: 'Stock Balance', icon: BarChart3, roles: ['Administrator', 'Manager', 'Staff'] },
    { path: '/stock/low-stock', label: 'Low Stock', icon: AlertTriangle, roles: ['Administrator', 'Manager', 'Staff'] },
    { path: '/users', label: 'Users', icon: User, roles: ['Administrator'] },
  ];

  return (
    <aside
      className={`fixed top-0 left-0 h-full bg-[#0F172A] text-white z-50 transition-all duration-300 ${
        collapsed ? 'w-20' : 'w-64'
      }`}
    >
      {/* Header area */}
      <div className="flex items-center justify-between p-4 border-b border-[#1E293B]">
        {/* Logo - click to OPEN sidebar */}
        {!collapsed && (
          <div
            className="flex items-center gap-3 cursor-pointer"
            onClick={() => setCollapsed(false)}
          >
            <div className="p-2 bg-[#2563EB] rounded-lg flex-shrink-0">
              <BookOpen className="w-6 h-6 text-white" />
            </div>
            <div>
              <span className="text-xl font-bold text-white">BookStore</span>
              <p className="text-xs text-[#94A3B8] mt-0.5">Role: {userRole || 'Loading...'}</p>
            </div>
          </div>
        )}
        {collapsed && (
          <div
            className="flex items-center justify-center w-full cursor-pointer"
            onClick={() => setCollapsed(false)}
          >
            <div className="p-2 bg-[#2563EB] rounded-lg flex-shrink-0">
              <BookOpen className="w-6 h-6 text-white" />
            </div>
          </div>
        )}

        {/* 3‑lines button - visible ONLY when sidebar is open */}
        {!collapsed && (
          <button
            onClick={() => setCollapsed(true)}
            className="text-[#94A3B8] hover:text-white transition-colors flex-shrink-0 ml-auto"
          >
            <Menu className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-3 space-y-1 overflow-y-auto h-[calc(100%-120px)]">
        {navItems.filter(item => item.roles.includes(userRole || 'Staff')).map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                isActive
                  ? 'bg-[#2563EB] text-white'
                  : 'text-[#94A3B8] hover:bg-[#1E293B] hover:text-white'
              } ${collapsed ? 'justify-center' : ''}`}
            >
              <Icon className="w-5 h-5 flex-shrink-0" />
              {!collapsed && <span className="text-sm flex-1">{item.label}</span>}
              {!collapsed && isActive && (
                <span className="ml-auto w-1 h-6 bg-white rounded-full"></span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Bottom - Logout */}
      <div className="p-4 border-t border-[#1E293B]">
        <button
          onClick={handleLogout}
          className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-all ${
            collapsed ? 'justify-center' : ''
          }`}
        >
          <LogOut className="w-4 h-4 flex-shrink-0" />
          {!collapsed && <span className="text-sm">Logout</span>}
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;