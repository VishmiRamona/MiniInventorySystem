import { useEffect, useState, useMemo } from 'react';
import { getItems } from '../api/itemApi';
import { stockOut } from '../api/stockApi';
import API from '../api/api';
import { PackageOpen, Plus, X, Search, CheckCircle, AlertCircle } from 'lucide-react';

const StockOut = () => {
  const [items, setItems] = useState([]);
  const [stockOutRecords, setStockOutRecords] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    itemId: '',
    quantity: '',
    reason: '',
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [itemsData, stockOutData] = await Promise.all([
          getItems(),
          API.get('/Stock/out'),
        ]);

        setItems(itemsData);
        setStockOutRecords(stockOutData.data.data || []);
        setFetching(false);
      } catch (err) {
        console.error('Error loading data:', err);
        setFetching(false);
      }
    };
    fetchData();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSuccess('');
    setError('');
    try {
      await stockOut(formData);
      setSuccess('Stock Out recorded successfully!');
      resetForm();

      const stockOutData = await API.get('/Stock/out');
      setStockOutRecords(stockOutData.data.data || []);
    } catch (err) {
      setError(err.response?.data?.message || 'Error recording stock out');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({ itemId: '', quantity: '', reason: '' });
    setShowAddForm(false);
  };

  const openAddForm = () => {
    resetForm();
    setShowAddForm(true);
  };

  // ✅ Filter stock out records based on search term
  const filteredRecords = useMemo(() => {
    if (!searchTerm.trim()) return stockOutRecords;
    const term = searchTerm.toLowerCase();
    return stockOutRecords.filter(
      (record) =>
        record.itemName?.toLowerCase().includes(term) ||
        record.reason?.toLowerCase().includes(term)
    );
  }, [stockOutRecords, searchTerm]);

  if (fetching) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#2563EB]" />
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between mb-6">
        <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-2">
          <PackageOpen className="w-8 h-8 text-[#2563EB]" />
          Stock Out
        </h1>
        <button
          onClick={openAddForm}
          className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-xl hover:from-purple-700 hover:to-indigo-700 transition-all shadow-sm"
        >
          <Plus className="w-5 h-5" />
          Add Stock Out Entry
        </button>
      </div>

      {/* Add Form */}
      {showAddForm && (
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8 border border-gray-200 relative">
          <button
            onClick={resetForm}
            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-all"
          >
            <X className="w-6 h-6" />
          </button>

          <h2 className="text-lg font-semibold text-gray-700 mb-4 flex items-center gap-2">
            <Plus className="w-5 h-5 text-purple-600" />
            Add Stock Out Entry
          </h2>

          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <select
              value={formData.itemId}
              onChange={(e) => setFormData({ ...formData, itemId: e.target.value })}
              className="border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-purple-500"
              required
            >
              <option value="">Select Item</option>
              {items.map((item) => (
                <option key={item.itemId} value={item.itemId}>{item.itemName}</option>
              ))}
            </select>
            <input
              type="number"
              placeholder="Quantity"
              value={formData.quantity}
              onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
              className="border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-purple-500"
              required
            />
            <select
              value={formData.reason}
              onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
              className="border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-purple-500"
              required
            >
              <option value="">Reason</option>
              <option value="Sale">Sale</option>
              <option value="Damage">Damage</option>
              <option value="Internal Use">Internal Use</option>
              <option value="Return">Return</option>
            </select>
            <div className="flex gap-2 items-end md:col-span-2">
              <button
                type="submit"
                disabled={loading}
                className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-medium px-6 py-2.5 rounded-lg transition-all shadow-sm disabled:opacity-50 flex items-center gap-2"
              >
                <PackageOpen className="w-4 h-4" />
                {loading ? 'Processing...' : 'Record Stock Out'}
              </button>
              <button
                type="button"
                onClick={resetForm}
                className="px-6 py-2.5 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-all flex items-center gap-2"
              >
                <X className="w-4 h-4" /> Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Success/Error Messages */}
      {success && (
        <div className="bg-emerald-50 border border-emerald-200 text-emerald-700 px-4 py-3 rounded-xl mb-6 flex items-center gap-2">
          <CheckCircle className="w-5 h-5" />
          {success}
        </div>
      )}

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl mb-6 flex items-center gap-2">
          <AlertCircle className="w-5 h-5" />
          {error}
        </div>
      )}

      {/* ✅ SEARCH BAR ADDED */}
      <div className="mb-4 relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
        <input
          type="text"
          placeholder="Search by Item or Reason..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full md:w-1/2 border border-gray-300 rounded-xl pl-11 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-500"
        />
      </div>

      {/* Stock Out Records Table */}
      <div className="bg-white rounded-2xl shadow-[0_4px_12px_rgba(0,0,0,0.05)] border border-gray-100 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-700">Recent Stock Out History</h3>
          <span className="text-sm text-gray-500">{filteredRecords.length} records</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">StockOut ID</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Item</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Qty</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Reason</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredRecords.length === 0 ? (
                <tr>
                  <td colSpan="5" className="px-4 py-8 text-center text-gray-400 text-sm">
                    {searchTerm ? 'No matching records found.' : 'No stock out records yet. Add your first entry above!'}
                  </td>
                </tr>
              ) : (
                filteredRecords.map((record, index) => (
                  <tr key={index} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3 text-sm font-mono text-gray-500">#{record.stockOutId}</td>
                    <td className="px-4 py-3 text-sm text-gray-800">{record.itemName || 'N/A'}</td>
                    <td className="px-4 py-3 text-sm font-medium text-red-600">-{record.quantity}</td>
                    <td className="px-4 py-3 text-sm text-gray-500">{record.reason || 'N/A'}</td>
                    <td className="px-4 py-3 text-sm text-gray-500">
                      {record.stockOutDate ? new Date(record.stockOutDate).toLocaleDateString() : 'N/A'}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default StockOut;