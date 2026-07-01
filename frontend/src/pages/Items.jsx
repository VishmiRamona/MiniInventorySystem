import { useEffect, useState } from 'react';
import { getItems, createItem, updateItem, deleteItem, searchItems } from '../api/itemApi';
import { getCategories } from '../api/categoryApi';
import { getSuppliers } from '../api/supplierApi';
import { BookOpen, Plus, Edit, Trash2, X, Search } from 'lucide-react';
import ConfirmDialog from '../components/ConfirmDialog';

const Items = () => {
  const [items, setItems] = useState([]);
  const [categories, setCategories] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [deleteDialog, setDeleteDialog] = useState({ isOpen: false, itemId: null, itemName: '' });
  const [formData, setFormData] = useState({
    itemCode: '',
    barcode: '',
    itemName: '',
    categoryId: '',
    supplierId: '',
    costPrice: '',
    sellingPrice: '',
    reorderLevel: '',
  });

  useEffect(() => {
    loadAllData();
  }, []);

  const loadAllData = async () => {
    setLoading(true);
    try {
      const [itemsData, categoriesData, suppliersData] = await Promise.all([
        getItems(),
        getCategories(),
        getSuppliers(),
      ]);
      setItems(itemsData);
      setCategories(categoriesData);
      setSuppliers(suppliersData);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (e) => {
    const term = e.target.value;
    setSearchTerm(term);
    if (term.length > 0) {
      try {
        const results = await searchItems(term);
        setItems(results);
      } catch (error) {
        console.error('Search error:', error);
      }
    } else {
      loadAllData();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        ...formData,
        categoryId: parseInt(formData.categoryId),
        supplierId: parseInt(formData.supplierId),
        costPrice: parseFloat(formData.costPrice),
        sellingPrice: parseFloat(formData.sellingPrice),
        reorderLevel: parseInt(formData.reorderLevel),
      };
      if (editingId) {
        await updateItem(editingId, payload);
      } else {
        await createItem(payload);
      }
      resetForm();
      await loadAllData();
    } catch (error) {
      console.error('Error saving item:', error);
      alert('Error saving item. Check console for details.');
    }
  };

  const handleEdit = (item) => {
    setEditingId(item.itemId);
    setFormData({
      itemCode: item.itemCode || '',
      barcode: item.barcode || '',
      itemName: item.itemName || '',
      categoryId: item.categoryId || '',
      supplierId: item.supplierId || '',
      costPrice: item.costPrice || '',
      sellingPrice: item.sellingPrice || '',
      reorderLevel: item.reorderLevel || '',
    });
    setShowAddForm(true);
  };

  // ✅ Show custom delete dialog instead of browser confirm
  const handleDeleteClick = (item) => {
    setDeleteDialog({
      isOpen: true,
      itemId: item.itemId,
      itemName: item.itemName,
    });
  };

  // ✅ Execute deletion after confirmation
  const handleConfirmDelete = async () => {
    try {
      await deleteItem(deleteDialog.itemId);
      await loadAllData();
    } catch (error) {
      console.error('Delete error:', error);
      alert('Error deleting item. Check console for details.');
    }
  };

  const resetForm = () => {
    setEditingId(null);
    setFormData({
      itemCode: '',
      barcode: '',
      itemName: '',
      categoryId: '',
      supplierId: '',
      costPrice: '',
      sellingPrice: '',
      reorderLevel: '',
    });
    setShowAddForm(false);
  };

  const openAddForm = () => {
    resetForm();
    setShowAddForm(true);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-700"></div>
      </div>
    );
  }

  return (
    <div>
      {/* Confirm Delete Dialog */}
      <ConfirmDialog
        isOpen={deleteDialog.isOpen}
        onClose={() => setDeleteDialog({ isOpen: false, itemId: null, itemName: '' })}
        onConfirm={handleConfirmDelete}
        title="Delete Book"
        message={`Are you sure you want to delete "${deleteDialog.itemName}"? This action cannot be undone.`}
      />

      {/* Header */}
      <div className="flex flex-wrap items-center justify-between mb-6">
        <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-2">
          <BookOpen className="w-8 h-8 text-purple-600" />
          Books
        </h1>
        <button
          onClick={openAddForm}
          className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-xl hover:from-purple-700 hover:to-indigo-700 transition-all shadow-sm"
        >
          <Plus className="w-5 h-5" />
          Add New Book
        </button>
      </div>

      {/* Add/Edit Form */}
      {showAddForm && (
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8 border border-gray-200 relative">
          <button
            onClick={resetForm}
            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-all"
          >
            <X className="w-6 h-6" />
          </button>

          <h2 className="text-lg font-semibold text-gray-700 mb-4 flex items-center gap-2">
            {editingId ? (
              <>
                <Edit className="w-5 h-5 text-yellow-500" />
                Edit Book
              </>
            ) : (
              <>
                <Plus className="w-5 h-5 text-purple-600" />
                Add New Book
              </>
            )}
          </h2>

          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <input
              type="text"
              placeholder="Item Code (auto-generated)"
              value={formData.itemCode || 'Auto-generated'}
              className="border border-gray-300 rounded-lg px-4 py-2.5 bg-gray-50 text-gray-500 cursor-not-allowed"
              disabled
            />
            <input
              type="text"
              placeholder="Barcode (auto-generated)"
              value={formData.barcode || 'Auto-generated'}
              className="border border-gray-300 rounded-lg px-4 py-2.5 bg-gray-50 text-gray-500 cursor-not-allowed"
              disabled
            />
            <input
              type="text"
              placeholder="Book Name *"
              value={formData.itemName}
              onChange={(e) => setFormData({ ...formData, itemName: e.target.value })}
              className="border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-purple-500"
              required
            />
            <select
              value={formData.categoryId}
              onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
              className="border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-purple-500"
              required
            >
              <option value="">Select Category *</option>
              {categories.map((cat) => (
                <option key={cat.categoryId} value={cat.categoryId}>{cat.categoryName}</option>
              ))}
            </select>
            <select
              value={formData.supplierId}
              onChange={(e) => setFormData({ ...formData, supplierId: e.target.value })}
              className="border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-purple-500"
              required
            >
              <option value="">Select Supplier *</option>
              {suppliers.map((sup) => (
                <option key={sup.supplierId} value={sup.supplierId}>{sup.supplierName}</option>
              ))}
            </select>
            <input
              type="number"
              step="0.01"
              placeholder="Cost Price *"
              value={formData.costPrice}
              onChange={(e) => setFormData({ ...formData, costPrice: e.target.value })}
              className="border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-purple-500"
              required
            />
            <input
              type="number"
              step="0.01"
              placeholder="Selling Price *"
              value={formData.sellingPrice}
              onChange={(e) => setFormData({ ...formData, sellingPrice: e.target.value })}
              className="border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-purple-500"
              required
            />
            <input
              type="number"
              placeholder="Reorder Level"
              value={formData.reorderLevel}
              onChange={(e) => setFormData({ ...formData, reorderLevel: e.target.value })}
              className="border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
            <div className="flex gap-2 items-end md:col-span-3">
              <button
                type="submit"
                className={`px-6 py-2.5 rounded-lg text-white font-medium flex items-center gap-2 ${
                  editingId
                    ? 'bg-yellow-500 hover:bg-yellow-600'
                    : 'bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700'
                } transition-all shadow-sm`}
              >
                {editingId ? <Edit className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                {editingId ? 'Update' : 'Add'}
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

      {/* Search */}
      <div className="mb-6 relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
        <input
          type="text"
          placeholder="Search by Item Code, Barcode or Name..."
          value={searchTerm}
          onChange={handleSearch}
          className="w-full md:w-1/2 border border-gray-300 rounded-xl pl-11 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-500"
        />
      </div>

      {/* Item List */}
      <div className="bg-white rounded-2xl shadow-soft overflow-hidden border border-gray-100">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Code</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Barcode</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Book Name</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Category</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Supplier</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Price</th>
                <th className="px-6 py-4 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {items.length === 0 ? (
                <tr>
                  <td colSpan="7" className="px-6 py-8 text-center text-gray-400 text-sm">
                    No books found. Click "Add New Book" to create one.
                  </td>
                </tr>
              ) : (
                items.map((item) => (
                  <tr key={item.itemId} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 text-sm font-mono text-gray-500">{item.itemCode}</td>
                    <td className="px-6 py-4 text-sm text-gray-500">{item.barcode || '-'}</td>
                    <td className="px-6 py-4 text-sm font-medium text-gray-800">{item.itemName}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{item.categoryName || 'N/A'}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{item.supplierName || 'N/A'}</td>
                    <td className="px-6 py-4 text-sm font-medium text-emerald-600">Rs. {item.sellingPrice}</td>
                    <td className="px-6 py-4 text-right text-sm space-x-3">
                      <button
                        onClick={() => handleEdit(item)}
                        className="text-indigo-600 hover:text-indigo-800 font-medium transition-colors flex items-center gap-1 inline-flex"
                      >
                        <Edit className="w-4 h-4" /> Edit
                      </button>
                      <button
                        // ✅ Open custom dialog instead of browser confirm
                        onClick={() => handleDeleteClick(item)}
                        className="text-rose-500 hover:text-rose-700 font-medium transition-colors flex items-center gap-1 inline-flex"
                      >
                        <Trash2 className="w-4 h-4" /> Delete
                      </button>
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

export default Items;