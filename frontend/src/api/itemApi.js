import API from './api';

export const getItems = async () => {
  const response = await API.get('/Item');
  return response.data.data;
};

export const createItem = async (item) => {
  const response = await API.post('/Item', item);
  return response.data.data;
};

export const updateItem = async (id, item) => {
  const response = await API.put(`/Item/${id}`, item);
  return response.data.data;
};

export const deleteItem = async (id) => {
  const response = await API.delete(`/Item/${id}`);
  return response.data.data;
};

export const searchItems = async (keyword) => {
  const response = await API.get(`/Item/search?keyword=${keyword}`);
  return response.data.data;
};