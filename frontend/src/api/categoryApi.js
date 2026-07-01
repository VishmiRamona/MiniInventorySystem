import API from './api';

export const getCategories = async () => {
  const response = await API.get('/Category');
  return response.data.data;
};

export const createCategory = async (category) => {
  const response = await API.post('/Category', category);
  return response.data.data;
};

export const updateCategory = async (id, category) => {
  const response = await API.put(`/Category/${id}`, category);
  return response.data.data;
};

export const deleteCategory = async (id) => {
  const response = await API.delete(`/Category/${id}`);
  return response.data.data;
};