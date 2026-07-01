import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import API from '../api/api';
import {
  BookOpen,
  FolderTree,
  Users,
  Package,
  AlertTriangle,
  TrendingUp,
  TrendingDown,
  Eye,
  BarChart3,
} from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalItems: 0,
    totalCategories: 0,
    totalSuppliers: 0,
    lowStock: 0,
    outOfStock: 0,
    totalStockValue: 0,
  });
  const [recentStockIn, setRecentStockIn] = useState([]);
  const [recentStockOut, setRecentStockOut] = useState([]);
  const [lowStockItems, setLowStockItems] = useState([]);
  const [chartData, setChartData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [itemsRes, categoriesRes, suppliersRes, lowStockRes, balanceRes, stockInRes, stockOutRes] = await Promise.all([
          API.get('/Item'),
          API.get('/Category'),
          API.get('/Supplier'),
          API.get('/Stock/low-stock'),
          API.get('/Stock/balance'),
          API.get('/Stock/in'),
          API.get('/Stock/out'),
        ]);

        const items = itemsRes.data.data || [];
        const categories = categoriesRes.data.data || [];
        const suppliers = suppliersRes.data.data || [];
        const lowStock = lowStockRes.data.data || [];
        const balance = balanceRes.data.data || [];
        const stockIn = stockInRes.data.data || [];
        const stockOut = stockOutRes.data.data || [];

        const outOfStock = balance.filter(item => item.currentBalance === 0);
        const totalValue = balance.reduce((sum, item) => sum + (item.currentBalance || 0) * (item.costPrice || 0), 0);

        setStats({
          totalItems: items.length,
          totalCategories: categories.length,
          totalSuppliers: suppliers.length,
          lowStock: lowStock.length,
          outOfStock: outOfStock.length,
          totalStockValue: totalValue,
        });

        setLowStockItems(lowStock);
        setRecentStockIn(stockIn.slice(-4).reverse());
        setRecentStockOut(stockOut.slice(-4).reverse());

        const chartData = balance.slice(0, 5).map(item => ({
          name: item.itemName?.length > 12 ? item.itemName.substring(0, 10) + '...' : item.itemName || 'Unknown',
          stock: item.currentBalance || 0,
        }));
        setChartData(chartData);

        setLoading(false);
      } catch (err) {
        console.error('Error fetching data:', err);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-96">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-[#2563EB]"></div>
      </div>
    );
  }

  const primaryCards = [
    { title: 'Total Books', value: stats.totalItems, icon: BookOpen, color: '#2563EB', trend: '+12%' },
    { title: 'Categories', value: stats.totalCategories, icon: FolderTree, color: '#22C55E', trend: '+3.2%' },
    { title: 'Publishers', value: stats.totalSuppliers, icon: Users, color: '#8B5CF6', trend: '+6.1%' },
    { title: 'Stock Value', value: `Rs. ${stats.totalStockValue.toLocaleString()}`, icon: Package, color: '#F59E0B', trend: '+0%' },
  ];

  const secondaryCards = [
    { title: 'Low Stock', value: stats.lowStock, icon: AlertTriangle, color: '#F59E0B', trend: '↓ 2 from last month' },
    { title: 'Out of Stock', value: stats.outOfStock, icon: Package, color: '#EF4444', trend: '↓ 1 from last month' },
  ];

  const getStatusBadge = (status) => {
    const colors = {
      'Good Stock': 'bg-[#22C55E]/10 text-[#22C55E]',
      'Low Stock': 'bg-[#F59E0B]/10 text-[#F59E0B]',
      'Out of Stock': 'bg-[#EF4444]/10 text-[#EF4444]',
    };
    return colors[status] || 'bg-gray-100 text-gray-700';
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-[#64748B] mt-1">Welcome back, Admin! Here's today's inventory overview.</p>
      </div>

      {/* Primary Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {primaryCards.map((card) => {
          const Icon = card.icon;
          return (
            <div
              key={card.title}
              className="bg-white rounded-2xl shadow-[0_4px_12px_rgba(0,0,0,0.05)] border border-gray-100 p-6 transition-all hover:shadow-lg hover:border-transparent"
            >
              <div className="flex items-start justify-between">
                <div className={`p-2 rounded-xl`} style={{ backgroundColor: `${card.color}15` }}>
                  <Icon className="w-5 h-5" style={{ color: card.color }} />
                </div>
                <span className="text-xs font-medium text-[#22C55E] flex items-center gap-1">
                  <TrendingUp className="w-3 h-3" />
                  {card.trend}
                </span>
              </div>
              <p className="text-3xl font-bold text-gray-900 mt-3">{card.value}</p>
              <p className="text-sm text-[#64748B]">{card.title}</p>
            </div>
          );
        })}
      </div>

      {/* Secondary Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        {secondaryCards.map((card) => {
          const Icon = card.icon;
          return (
            <div
              key={card.title}
              className="bg-white rounded-2xl shadow-[0_4px_12px_rgba(0,0,0,0.05)] border border-gray-100 p-6"
            >
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-xl`} style={{ backgroundColor: `${card.color}15` }}>
                  <Icon className="w-4 h-4" style={{ color: card.color }} />
                </div>
                <p className="text-sm text-[#64748B]">{card.title}</p>
              </div>
              <p className="text-2xl font-bold text-gray-900 mt-2">{card.value}</p>
              <p className={`text-xs ${card.trend.includes('↓') ? 'text-[#EF4444]' : 'text-[#22C55E]'}`}>
                {card.trend}
              </p>
            </div>
          );
        })}
      </div>

      {/* Chart */}
      <div className="bg-white rounded-2xl shadow-[0_4px_12px_rgba(0,0,0,0.05)] border border-gray-100 p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
          <BarChart3 className="w-5 h-5 text-[#2563EB]" />
          Stock Trend (Top 6 Items)
        </h3>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="stock" fill="#2563EB" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Recent Transactions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl shadow-[0_4px_12px_rgba(0,0,0,0.05)] border border-gray-100 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
              <Package className="w-5 h-5 text-[#22C55E]" />
              Recent Stock In
            </h3>
            <Link to="/stock/in" className="text-sm text-[#2563EB] hover:text-[#1D4ED8] font-medium">View All</Link>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-[#64748B] uppercase">Book</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-[#64748B] uppercase">Qty</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-[#64748B] uppercase">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {recentStockIn.length === 0 ? (
                  <tr><td colSpan="3" className="px-4 py-4 text-center text-gray-400 text-sm">No records</td></tr>
                ) : (
                  recentStockIn.map((item, i) => (
                    <tr key={i} className="hover:bg-gray-50 transition-colors">
                      <td className="px-4 py-3 text-sm text-gray-800">{item.itemName}</td>
                      <td className="px-4 py-3 text-sm font-medium text-[#22C55E]">+{item.quantity}</td>
                      <td className="px-4 py-3 text-sm text-[#64748B]">
                        {item.stockInDate ? new Date(item.stockInDate).toLocaleDateString() : 'N/A'}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-[0_4px_12px_rgba(0,0,0,0.05)] border border-gray-100 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
              <Package className="w-5 h-5 text-[#EF4444]" />
              Recent Stock Out
            </h3>
            <Link to="/stock/out" className="text-sm text-[#2563EB] hover:text-[#1D4ED8] font-medium">View All</Link>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-[#64748B] uppercase">Book</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-[#64748B] uppercase">Qty</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-[#64748B] uppercase">Reason</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {recentStockOut.length === 0 ? (
                  <tr><td colSpan="3" className="px-4 py-4 text-center text-gray-400 text-sm">No records</td></tr>
                ) : (
                  recentStockOut.map((item, i) => (
                    <tr key={i} className="hover:bg-gray-50 transition-colors">
                      <td className="px-4 py-3 text-sm text-gray-800">{item.itemName}</td>
                      <td className="px-4 py-3 text-sm font-medium text-[#EF4444]">-{item.quantity}</td>
                      <td className="px-4 py-3 text-sm text-[#64748B]">{item.reason}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Low Stock Alerts */}
      <div className="bg-white rounded-2xl shadow-[0_4px_12px_rgba(0,0,0,0.05)] border border-gray-100 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-[#EF4444]" />
            Low Stock Alerts
          </h3>
          <Link to="/stock/low-stock" className="text-sm text-[#2563EB] hover:text-[#1D4ED8] font-medium">View All</Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-[#64748B] uppercase">Book Name</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-[#64748B] uppercase">Current Stock</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-[#64748B] uppercase">Reorder Level</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-[#64748B] uppercase">Status</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-[#64748B] uppercase">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {lowStockItems.length === 0 ? (
                <tr><td colSpan="5" className="px-4 py-8 text-center text-gray-400 text-sm">✅ All items are well stocked</td></tr>
              ) : (
                lowStockItems.slice(0, 5).map((item) => {
                  const status = item.currentBalance === 0 ? 'Out of Stock' : 'Low Stock';
                  return (
                    <tr key={item.itemId} className="hover:bg-gray-50 transition-colors">
                      <td className="px-4 py-3 text-sm text-gray-800">{item.itemName}</td>
                      <td className="px-4 py-3 text-sm font-medium text-[#EF4444]">{item.currentBalance || 0}</td>
                      <td className="px-4 py-3 text-sm text-[#64748B]">{item.reorderLevel || 5}</td>
                      <td className="px-4 py-3">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusBadge(status)}`}>
                          {status}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <Link to="/stock/in" className="text-sm text-[#2563EB] hover:text-[#1D4ED8] font-medium flex items-center gap-1">
                          <Package className="w-3 h-3" /> Restock
                        </Link>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;