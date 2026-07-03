import { useState, useEffect, useRef } from 'react';
import { Bell, AlertTriangle, Package, CheckCircle, X } from 'lucide-react';
import { Link } from 'react-router-dom';
import API from '../api/api';

const NotificationDropdown = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Get read notification IDs from localStorage
  const getReadNotifications = () => {
    try {
      const read = localStorage.getItem('readNotifications');
      return read ? JSON.parse(read) : [];
    } catch {
      return [];
    }
  };

  // Save read notification IDs to localStorage
  const saveReadNotifications = (ids) => {
    localStorage.setItem('readNotifications', JSON.stringify(ids));
  };

  const fetchNotifications = async () => {
    setLoading(true);
    try {
      const [lowStockRes, balanceRes] = await Promise.all([
        API.get('/Stock/low-stock'),
        API.get('/Stock/balance'),
      ]);

      const lowStockItems = lowStockRes.data.data || [];
      const balance = balanceRes.data.data || [];

      const notificationsList = [];
      const readIds = getReadNotifications();

      const outOfStock = balance.filter(item => item.currentBalance === 0);
      outOfStock.forEach(item => {
        const id = `out-${item.itemId}`;
        notificationsList.push({
          id: id,
          type: 'out-of-stock',
          message: `${item.itemName} is out of stock!`,
          time: new Date().toISOString(),
          read: readIds.includes(id),
          link: '/stock/low-stock',
          icon: AlertTriangle,
          color: 'text-red-500 bg-red-50',
        });
      });

      const lowStock = lowStockItems.filter(item => item.currentBalance > 0 && item.currentBalance < item.reorderLevel);
      lowStock.forEach(item => {
        const id = `low-${item.itemId}`;
        notificationsList.push({
          id: id,
          type: 'low-stock',
          message: `${item.itemName} is running low (${item.currentBalance} left)`,
          time: new Date().toISOString(),
          read: readIds.includes(id),
          link: '/stock/low-stock',
          icon: AlertTriangle,
          color: 'text-amber-500 bg-amber-50',
        });
      });

      notificationsList.sort((a, b) => new Date(b.time) - new Date(a.time));
      setNotifications(notificationsList.slice(0, 10));
      setUnreadCount(notificationsList.filter(n => !n.read).length);
    } catch (error) {
      console.error('Error fetching notifications:', error);
    } finally {
      setLoading(false);
    }
  };

  // Mark a single notification as read (save to localStorage)
  const markAsRead = (id) => {
    const readIds = getReadNotifications();
    if (!readIds.includes(id)) {
      readIds.push(id);
      saveReadNotifications(readIds);
    }
    // Update local state
    setNotifications(prev => prev.map(n => 
      n.id === id ? { ...n, read: true } : n
    ));
    setUnreadCount(prev => Math.max(0, prev - 1));
  };

  // Mark all as read (save all to localStorage)
  const markAllAsRead = () => {
    const readIds = notifications.map(n => n.id);
    saveReadNotifications(readIds);
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    setUnreadCount(0);
  };

  const toggleDropdown = () => {
    if (!isOpen) {
      fetchNotifications();
    }
    setIsOpen(!isOpen);
  };

  // Count unread notifications
  const unreadNotifications = notifications.filter(n => !n.read);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={toggleDropdown}
        className="p-2 rounded-full hover:bg-gray-100 transition-all relative"
      >
        <Bell className="w-5 h-5 text-[#64748B]" />
        {unreadCount > 0 && (
          <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-[#EF4444] rounded-full animate-pulse"></span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden z-50">
          {/* Header */}
          <div className="px-4 py-3 border-b border-gray-100 flex items-center justify-between bg-gray-50">
            <span className="text-sm font-semibold text-gray-800 flex items-center gap-2">
              <Bell className="w-4 h-4 text-[#2563EB]" />
              Notifications
              {unreadCount > 0 && (
                <span className="text-xs bg-[#2563EB] text-white px-2 py-0.5 rounded-full">
                  {unreadCount}
                </span>
              )}
            </span>
            {unreadCount > 0 && (
              <button
                onClick={markAllAsRead}
                className="text-xs text-[#2563EB] hover:text-[#1D4ED8] font-medium"
              >
                Mark all as read
              </button>
            )}
          </div>

          {/* Notification List */}
          <div className="max-h-80 overflow-y-auto">
            {loading ? (
              <div className="p-4 text-center">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-[#2563EB] mx-auto"></div>
              </div>
            ) : unreadNotifications.length === 0 && notifications.length === 0 ? (
              <div className="p-4 text-center text-gray-400 text-sm">
                <CheckCircle className="w-8 h-8 mx-auto text-emerald-500 mb-2" />
                All caught up!
              </div>
            ) : unreadNotifications.length === 0 && notifications.length > 0 ? (
              <div className="p-4 text-center text-gray-400 text-sm">
                <CheckCircle className="w-8 h-8 mx-auto text-emerald-500 mb-2" />
                You're all caught up!
              </div>
            ) : (
              unreadNotifications.map((notification) => {
                const Icon = notification.icon;
                return (
                  <div
                    key={notification.id}
                    className="px-4 py-3 border-b border-gray-50 hover:bg-gray-50 transition-colors group relative"
                  >
                    <div className="flex items-start gap-3">
                      <div className={`p-1.5 rounded-lg flex-shrink-0 ${notification.color}`}>
                        <Icon className="w-4 h-4" />
                      </div>
                      <Link
                        to={notification.link}
                        className="flex-1 min-w-0"
                        onClick={() => {
                          markAsRead(notification.id);
                          setIsOpen(false);
                        }}
                      >
                        <p className="text-sm text-gray-800">{notification.message}</p>
                        <p className="text-xs text-gray-400 mt-0.5">
                          {new Date(notification.time).toLocaleDateString()} at{' '}
                          {new Date(notification.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </p>
                      </Link>
                      <button
                        onClick={() => markAsRead(notification.id)}
                        className="opacity-0 group-hover:opacity-100 transition-all flex-shrink-0 text-gray-400 hover:text-gray-600"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Footer */}
          <div className="px-4 py-2 border-t border-gray-100 bg-gray-50">
            <Link
              to="/stock/low-stock"
              className="text-xs text-[#2563EB] hover:text-[#1D4ED8] font-medium flex items-center justify-center gap-1"
              onClick={() => setIsOpen(false)}
            >
              View all low stock items →
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationDropdown;