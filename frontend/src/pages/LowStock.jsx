import { useEffect, useState, useMemo } from 'react';
import API from '../api/api';
import { AlertTriangle, Package, Search, FileSpreadsheet, Printer, Plus, CheckCircle, Filter } from 'lucide-react';
import { Link } from 'react-router-dom';

const LowStock = () => {
  const [lowStockItems, setLowStockItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('');
  const [filterLevel, setFilterLevel] = useState('');
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [lowStockRes, categoriesRes] = await Promise.all([
          API.get('/Stock/low-stock'),
          API.get('/Category'),
        ]);

        setLowStockItems(lowStockRes.data.data || []);
        setCategories(categoriesRes.data.data || []);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching low stock:', error);
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const getStatus = (item) => {
    if (item.stockStatus) return item.stockStatus;
    if (Number(item.currentBalance) === 0) return 'Out of Stock';
    if (Number(item.currentBalance) < Number(item.reorderLevel)) return 'Low Stock';
    return 'Good Stock';
  };

  const getStatusColor = (status) => {
    const colors = {
      'Out of Stock': 'bg-red-100 text-red-700',
      'Low Stock': 'bg-amber-100 text-amber-700',
      'Good Stock': 'bg-green-100 text-green-700',
    };
    return colors[status] || 'bg-gray-100 text-gray-700';
  };

  // Apply filters
  const filteredData = useMemo(() => {
    let filtered = lowStockItems;

    // Search filter
    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (item) =>
          item.itemName?.toLowerCase().includes(term) ||
          item.itemCode?.toLowerCase().includes(term)
      );
    }

    // Category filter
    if (filterCategory) {
      filtered = filtered.filter((item) => item.categoryName === filterCategory);
    }

    // Stock Level filter
    if (filterLevel) {
      filtered = filtered.filter((item) => getStatus(item) === filterLevel);
    }

    return filtered;
  }, [lowStockItems, searchTerm, filterCategory, filterLevel]);

  // Stats for the alert banner
  const outOfStockCount = filteredData.filter(item => Number(item.currentBalance) === 0).length;
  const lowStockCount = filteredData.filter(item => Number(item.currentBalance) > 0 && Number(item.currentBalance) < Number(item.reorderLevel)).length;
  const totalIssues = outOfStockCount + lowStockCount;

  // Export Excel (uses filteredData)
  const exportToExcel = () => {
    const headers = ['Book', 'Category', 'Current Stock', 'Reorder Level', 'Supplier', 'Status'];
    const rows = filteredData.map(item => [
      item.itemName || '',
      item.categoryName || 'N/A',
      item.currentBalance || 0,
      item.reorderLevel || 0,
      item.supplierName || 'N/A',
      getStatus(item)
    ]);

    let csvContent = headers.join(',') + '\n';
    rows.forEach(row => {
      const escapedRow = row.map(val => `"${String(val).replace(/"/g, '""')}"`);
      csvContent += escapedRow.join(',') + '\n';
    });

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `Low_Stock_Report_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
  };

  const handlePrint = () => window.print();

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-700"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <style>{`
        @media print {
          body * { visibility: hidden; }
          #lowstock-report, #lowstock-report * { visibility: visible; }
          #lowstock-report { position: absolute; left: 0; top: 0; width: 100%; padding: 20px; }
          .no-print { display: none !important; }
        }
      `}</style>

      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 no-print">
        <div>
          <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-2">
            <AlertTriangle className="w-8 h-8 text-amber-500" />
            Low Stock Report
          </h1>
          <p className="text-gray-500 mt-1">Books that need restocking attention</p>
        </div>
        <div className="flex gap-2">
          <Link to="/stock/in">
            <button className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-xl hover:from-purple-700 hover:to-indigo-700 transition-all shadow-sm">
              <Plus className="w-5 h-5" /> Add Stock In
            </button>
          </Link>
          <button onClick={exportToExcel} className="flex items-center gap-2 px-4 py-2.5 bg-emerald-600 text-white rounded-xl hover:bg-emerald-700 transition-all text-sm">
            <FileSpreadsheet className="w-4 h-4" /> Export Excel
          </button>
          <button onClick={handlePrint} className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all text-sm">
            <Printer className="w-4 h-4" /> Print / PDF
          </button>
        </div>
      </div>

      {/* Alert Banner */}
      {totalIssues === 0 ? (
        <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-5 flex items-center gap-4 no-print">
          <div className="p-2 bg-emerald-100 rounded-full">
            <CheckCircle className="w-6 h-6 text-emerald-600" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-emerald-800">All items are well stocked!</h3>
            <p className="text-sm text-emerald-600">No items need restocking at the moment.</p>
          </div>
        </div>
      ) : (
        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-5 flex items-center gap-4 no-print">
          <div className="p-2 bg-amber-100 rounded-full">
            <AlertTriangle className="w-6 h-6 text-amber-600" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-amber-800">
              {outOfStockCount > 0 && lowStockCount > 0 && (
                `${outOfStockCount} item(s) out of stock and ${lowStockCount} item(s) low on stock`
              )}
              {outOfStockCount > 0 && lowStockCount === 0 && (
                `${outOfStockCount} item(s) out of stock`
              )}
              {outOfStockCount === 0 && lowStockCount > 0 && (
                `${lowStockCount} item(s) low on stock`
              )}
            </h3>
            <p className="text-sm text-amber-600">Please restock these items as soon as possible.</p>
          </div>
        </div>
      )}

      {/* Filters - Hidden when printing */}
      <div className="flex flex-wrap items-center gap-4 bg-white p-4 rounded-xl shadow-sm border border-gray-100 no-print">
        <div className="relative flex-1 min-w-[180px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search books by code or name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full border border-gray-300 rounded-lg pl-10 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm"
          />
        </div>

        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-gray-400" />
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm bg-white"
          >
            <option value="">All Categories</option>
            {categories.map(cat => (
              <option key={cat.categoryId} value={cat.categoryName}>{cat.categoryName}</option>
            ))}
          </select>
          <select
            value={filterLevel}
            onChange={(e) => setFilterLevel(e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm bg-white"
          >
            <option value="">All Stock Levels</option>
            <option value="Out of Stock">Out of Stock</option>
            <option value="Low Stock">Low Stock</option>
          </select>
        </div>
      </div>

      {/* Report Table */}
      <div id="lowstock-report" className="bg-white rounded-2xl shadow-[0_4px_12px_rgba(0,0,0,0.05)] border border-gray-100 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-gray-800">Low Stock Report</h1>
            <p className="text-xs text-gray-500">Generated: {new Date().toLocaleString()}</p>
          </div>
          <div className="text-right">
            <p className="text-sm font-semibold text-gray-700">BookStore</p>
            <p className="text-xs text-gray-400">Inventory System</p>
          </div>
        </div>

        <div className="overflow-x-auto p-4">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Book</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Category</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Current Stock</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Reorder Level</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Supplier</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Status</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredData.length === 0 ? (
                <tr>
                  <td colSpan="7" className="px-4 py-8 text-center text-gray-400 text-sm">
                    {searchTerm || filterCategory || filterLevel ? 'No matching items found.' : '✅ All items are well stocked'}
                  </td>
                </tr>
              ) : (
                filteredData.map((item) => {
                  const status = getStatus(item);
                  return (
                    <tr key={item.itemId} className="hover:bg-gray-50 transition-colors">
                      <td className="px-4 py-3 text-sm font-medium text-gray-800">{item.itemName}</td>
                      <td className="px-4 py-3 text-sm text-gray-500">{item.categoryName || 'N/A'}</td>
                      <td className="px-4 py-3 text-sm font-bold text-red-600">{item.currentBalance || 0}</td>
                      <td className="px-4 py-3 text-sm text-gray-500">{item.reorderLevel || 5}</td>
                      <td className="px-4 py-3 text-sm text-gray-500">{item.supplierName || 'N/A'}</td>
                      <td className="px-4 py-3">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(status)}`}>
                          {status}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <Link to="/stock/in" className="text-sm text-blue-600 hover:text-blue-800 font-medium flex items-center gap-1">
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

        <div className="px-6 py-3 border-t border-gray-200 text-xs text-gray-400 flex justify-between">
          <span>Showing {filteredData.length} of {lowStockItems.length} items</span>
          <span>Generated: {new Date().toLocaleString()}</span>
        </div>
      </div>
    </div>
  );
};

export default LowStock;