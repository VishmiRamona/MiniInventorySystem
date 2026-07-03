import { useEffect, useState } from 'react';
import API from '../api/api';
import { BarChart3, Search, FileSpreadsheet, Printer, Filter } from 'lucide-react';

const StockBalance = () => {
  const [balanceData, setBalanceData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [balanceRes, categoriesRes] = await Promise.all([
          API.get('/Stock/balance'),
          API.get('/Category'),
        ]);

        const balance = balanceRes.data.data || [];
        const cats = categoriesRes.data.data || [];

        setBalanceData(balance);
        setCategories(cats);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching data:', error);
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const getStatusBadge = (status) => {
    const colors = {
      'Good Stock': 'bg-green-100 text-green-700',
      'Low Stock': 'bg-amber-100 text-amber-700',
      'Out of Stock': 'bg-red-100 text-red-700',
    };
    return colors[status] || 'bg-gray-100 text-gray-700';
  };

  // Apply filters
  const filteredData = balanceData.filter(item => {
    // Search filter
    const matchesSearch =
      item.itemName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.itemCode?.toLowerCase().includes(searchTerm.toLowerCase());
    // Category filter
    const matchesCategory = filterCategory === '' || item.categoryName === filterCategory;
    // Status filter
    const matchesStatus = filterStatus === '' || item.stockStatus === filterStatus;
    return matchesSearch && matchesCategory && matchesStatus;
  });

  const totalStockIn = filteredData.reduce((sum, item) => sum + (item.totalStockIn || 0), 0);
  const totalStockOut = filteredData.reduce((sum, item) => sum + (item.totalStockOut || 0), 0);
  const totalBalance = filteredData.reduce((sum, item) => sum + (item.currentBalance || 0), 0);

  // Export Excel (uses filteredData)
  const exportToExcel = () => {
    const headers = ['Item Code', 'Item Name', 'Category', 'Total Stock In', 'Total Stock Out', 'Current Balance', 'Reorder Level', 'Stock Status'];
    const rows = filteredData.map(item => [
      item.itemCode || '',
      item.itemName || '',
      item.categoryName || 'N/A',
      item.totalStockIn || 0,
      item.totalStockOut || 0,
      item.currentBalance || 0,
      item.reorderLevel || 0,
      item.stockStatus || 'N/A'
    ]);

    let csvContent = headers.join(',') + '\n';
    rows.forEach(row => {
      const escapedRow = row.map(val => `"${String(val).replace(/"/g, '""')}"`);
      csvContent += escapedRow.join(',') + '\n';
    });

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `Stock_Balance_Report_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
  };

  const handlePrint = () => window.print();

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#2563EB]"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <style>{`
        @media print {
          body * { visibility: hidden; }
          #report-content, #report-content * { visibility: visible; }
          #report-content { position: absolute; left: 0; top: 0; width: 100%; padding: 20px; }
          .no-print { display: none !important; }
        }
      `}</style>

      {/* Header with Filters */}
      <div className="no-print flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
            <BarChart3 className="w-6 h-6 text-[#2563EB]" />
            Stock Balance Report
          </h1>
          <p className="text-sm text-gray-500">Complete inventory status and movements</p>
        </div>
        <div className="flex gap-2">
          <button onClick={exportToExcel} className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-all text-sm">
            <FileSpreadsheet className="w-4 h-4" /> Export Excel
          </button>
          <button onClick={handlePrint} className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all text-sm">
            <Printer className="w-4 h-4" /> Print / PDF
          </button>
        </div>
      </div>

      {/* Filters - Hidden when printing */}
      <div className="no-print flex flex-wrap items-center gap-4 bg-white p-4 rounded-xl shadow-sm border border-gray-100">
        <div className="relative flex-1 min-w-[180px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search by Item Code or Name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full border border-gray-300 rounded-lg pl-10 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#2563EB] text-sm"
          />
        </div>

        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-gray-400" />
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#2563EB] text-sm bg-white"
          >
            <option value="">All Categories</option>
            {categories.map(cat => (
              <option key={cat.categoryId} value={cat.categoryName}>{cat.categoryName}</option>
            ))}
          </select>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#2563EB] text-sm bg-white"
          >
            <option value="">All Statuses</option>
            <option value="Good Stock">Good Stock</option>
            <option value="Low Stock">Low Stock</option>
            <option value="Out of Stock">Out of Stock</option>
          </select>
        </div>
      </div>

      {/* Report Content */}
      <div id="report-content" className="bg-white rounded-2xl shadow-[0_4px_12px_rgba(0,0,0,0.05)] border border-gray-100 overflow-hidden">
        {/* Report Header */}
        <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-gray-800">Stock Balance Report</h1>
            <p className="text-xs text-gray-500">Generated: {new Date().toLocaleString()}</p>
          </div>
          <div className="text-right">
            <p className="text-sm font-semibold text-gray-700">BookStore</p>
            <p className="text-xs text-gray-400">Inventory System</p>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto p-4">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Item Code</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Item Name</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Category</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Stock In</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Stock Out</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Balance</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Reorder</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredData.length === 0 ? (
                <tr><td colSpan="8" className="px-4 py-8 text-center text-gray-400 text-sm">No items found</td></tr>
              ) : (
                filteredData.map((item) => (
                  <tr key={item.itemId} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3 text-sm font-mono text-gray-600">{item.itemCode}</td>
                    <td className="px-4 py-3 text-sm font-medium text-gray-800">{item.itemName}</td>
                    <td className="px-4 py-3 text-sm text-gray-500">{item.categoryName || 'N/A'}</td>
                    <td className="px-4 py-3 text-sm font-medium text-emerald-600">{item.totalStockIn}</td>
                    <td className="px-4 py-3 text-sm font-medium text-red-600">{item.totalStockOut}</td>
                    <td className="px-4 py-3 text-sm font-bold">{item.currentBalance}</td>
                    <td className="px-4 py-3 text-sm text-gray-500">{item.reorderLevel}</td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusBadge(item.stockStatus)}`}>
                        {item.stockStatus}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
            {filteredData.length > 0 && (
              <tfoot className="bg-gray-50 border-t border-gray-200">
                <tr>
                  <td colSpan="3" className="px-4 py-3 text-sm font-semibold text-gray-700">TOTALS</td>
                  <td className="px-4 py-3 text-sm font-semibold text-emerald-600">{totalStockIn}</td>
                  <td className="px-4 py-3 text-sm font-semibold text-red-600">{totalStockOut}</td>
                  <td className="px-4 py-3 text-sm font-semibold text-blue-600">{totalBalance}</td>
                  <td colSpan="2"></td>
                </tr>
              </tfoot>
            )}
          </table>
        </div>

        {/* Report Footer */}
        <div className="px-6 py-3 border-t border-gray-200 text-xs text-gray-400 flex justify-between">
          <span>Showing {filteredData.length} of {balanceData.length} items</span>
          <span>Generated: {new Date().toLocaleString()}</span>
        </div>
      </div>
    </div>
  );
};

export default StockBalance;