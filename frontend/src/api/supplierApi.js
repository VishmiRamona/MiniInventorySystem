import API from './api';

export const getSuppliers = async () => {
  const response = await API.get('/Supplier');
  return response.data.data;
};

export const createSupplier = async (supplier) => {
  const response = await API.post('/Supplier', supplier);
  return response.data.data;
};

export const updateSupplier = async (id, supplier) => {
  const response = await API.put(`/Supplier/${id}`, supplier);
  return response.data.data;
};

export const deleteSupplier = async (id) => {
  const response = await API.delete(`/Supplier/${id}`);
  return response.data.data;
};