import API from './api';

export const stockIn = async (data) => {
  const response = await API.post('/Stock/in', data);
  return response.data.data;
};

export const stockOut = async (data) => {
  const response = await API.post('/Stock/out', data);
  return response.data.data;
};

export const getStockBalance = async () => {
  const response = await API.get('/Stock/balance');
  return response.data.data;
};

export const getLowStock = async () => {
  const response = await API.get('/Stock/low-stock');
  return response.data.data;
};