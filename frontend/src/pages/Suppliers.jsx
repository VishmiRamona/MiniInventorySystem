import { useEffect, useState } from 'react';
import { getSuppliers, createSupplier, updateSupplier, deleteSupplier } from '../api/supplierApi';
import { Users, Plus, Edit, Trash2, X, Search } from 'lucide-react';
import ConfirmDialog from '../components/ConfirmDialog';

const Suppliers = () => {
  const [suppliers, setSuppliers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [deleteDialog, setDeleteDialog] = useState({ isOpen: false, id: null, name: '' });
  const [formData, setFormData] = useState({
    supplierName: '',
    contactNumber: '',
    email: '',
    address: '',
    isActive: true,
  });

  useEffect(() => { loadSuppliers(); }, []);

  const loadSuppliers = async () => {
    setLoading(true);
    try {
      const data = await getSuppliers();
      setSuppliers(data);
    } catch (error) {
      console.error('Error loading suppliers:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        supplierName: formData.supplierName,
        contactNumber: formData.contactNumber,
        email: formData.email,
        address: formData.address,
        isActive: formData.isActive,
      };
      if (editingId) {
        await updateSupplier(editingId, payload);
      } else {
        await createSupplier(payload);
      }
      resetForm();
      await loadSuppliers();
    } catch (error) {
      console.error('Error saving supplier:', error);
      alert('Error saving supplier. Check console for details.');
    }
  };

  const handleEdit = (sup) => {
    setEditingId(sup.supplierId);
    setFormData({
      supplierName: sup.supplierName || '',
      contactNumber: sup.contactNumber || '',
      email: sup.email || '',
      address: sup.address || '',
      isActive: sup.isActive !== undefined ? sup.isActive : true,
    });
    setShowAddForm(true);
  };

  // Show custom delete dialog
  const handleDeleteClick = (sup) => {
    setDeleteDialog({
      isOpen: true,
      id: sup.supplierId,
      name: sup.supplierName,
    });
  };

  // Execute deletion after confirmation
  const handleConfirmDelete = async () => {
    try {
      await deleteSupplier(deleteDialog.id);
      await loadSuppliers();
    } catch (error) {
      console.error('Delete error:', error);
      alert('Error deleting supplier. Check console for details.');
    }
  };

  const resetForm = () => {
    setEditingId(null);
    setFormData({
      supplierName: '',
      contactNumber: '',
      email: '',
      address: '',
      isActive: true,
    });
    setShowAddForm(false);
  };

  const openAddForm = () => {
    resetForm();
    setShowAddForm(true);
  };

  const filteredData = suppliers.filter(sup =>
    sup.supplierName?.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
        onClose={() => setDeleteDialog({ isOpen: false, id: null, name: '' })}
        onConfirm={handleConfirmDelete}
        title="Delete Supplier"
        message={`Are you sure you want to delete "${deleteDialog.name}"? This action cannot be undone.`}
      />

      {/* Header */}
      <div className="flex flex-wrap items-center justify-between mb-6">
        <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-2">
          <Users className="w-8 h-8 text-purple-600" />
          Suppliers
        </h1>
        <button
          onClick={openAddForm}
          className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-xl hover:from-purple-700 hover:to-indigo-700 transition-all shadow-sm"
        >
          <Plus className="w-5 h-5" />
          Add New Supplier
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
                Edit Supplier
              </>
            ) : (
              <>
                <Plus className="w-5 h-5 text-purple-600" />
                Add New Supplier
              </>
            )}
          </h2>

          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              type="text"
              placeholder="Supplier Name"
              value={formData.supplierName}
              onChange={(e) => setFormData({ ...formData, supplierName: e.target.value })}
              className="border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-purple-500"
              required
            />
            <input
              type="text"
              placeholder="Contact Number"
              value={formData.contactNumber}
              onChange={(e) => setFormData({ ...formData, contactNumber: e.target.value })}
              className="border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
            <input
              type="email"
              placeholder="Email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
            <input
              type="text"
              placeholder="Address"
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              className="border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-purple-500"
              required
            />
            <div className="flex items-center gap-3">
              <label className="text-sm font-medium text-gray-700">Active Status:</label>
              <button
                type="button"
                onClick={() => setFormData({ ...formData, isActive: !formData.isActive })}
                className={`relative w-12 h-6 rounded-full transition-all ${
                  formData.isActive ? 'bg-emerald-500' : 'bg-gray-300'
                }`}
              >
                <span
                  className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white transition-all ${
                    formData.isActive ? 'translate-x-6' : 'translate-x-0'
                  }`}
                />
              </button>
              <span className={`text-sm font-medium ${formData.isActive ? 'text-emerald-600' : 'text-gray-400'}`}>
                {formData.isActive ? 'Active' : 'Inactive'}
              </span>
            </div>
            <div className="flex gap-2 items-end">
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
          placeholder="Search suppliers..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full md:w-1/2 border border-gray-300 rounded-xl pl-11 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-500"
        />
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl shadow-soft overflow-hidden border border-gray-100">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">ID</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Name</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Contact</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Email</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Address</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredData.length === 0 ? (
                <tr>
                  <td colSpan="7" className="px-6 py-8 text-center text-gray-400 text-sm">
                    No suppliers found. Click "Add New Supplier" to create one.
                  </td>
                </tr>
              ) : (
                filteredData.map((sup) => (
                  <tr key={sup.supplierId} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 text-sm font-mono text-gray-400">#{sup.supplierId}</td>
                    <td className="px-6 py-4 text-sm font-medium text-gray-800">{sup.supplierName}</td>
                    <td className="px-6 py-4 text-sm text-gray-500">{sup.contactNumber || '-'}</td>
                    <td className="px-6 py-4 text-sm text-gray-500">{sup.email || '-'}</td>
                    <td className="px-6 py-4 text-sm text-gray-500">{sup.address || '-'}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        sup.isActive !== false
                          ? 'bg-emerald-100 text-emerald-700'
                          : 'bg-gray-100 text-gray-500'
                      }`}>
                        {sup.isActive !== false ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right text-sm space-x-3">
                      <button
                        onClick={() => handleEdit(sup)}
                        className="text-indigo-600 hover:text-indigo-800 font-medium transition-colors flex items-center gap-1 inline-flex"
                      >
                        <Edit className="w-4 h-4" /> Edit
                      </button>
                      <button
                        onClick={() => handleDeleteClick(sup)}
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

export default Suppliers;