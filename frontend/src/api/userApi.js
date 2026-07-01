import API from './api';

export const getUsers = async () => {
  const response = await API.get('/User');
  return response.data.data;
};

export const getUserById = async (id) => {
  const response = await API.get(`/User/${id}`);
  return response.data.data;
};

export const createUser = async (user) => {
  const response = await API.post('/User', user);
  return response.data.data;
};

export const updateUser = async (id, user) => {
  const response = await API.put(`/User/${id}`, user);
  return response.data.data;
};

export const deleteUser = async (id) => {
  const response = await API.delete(`/User/${id}`);
  return response.data.data;
};