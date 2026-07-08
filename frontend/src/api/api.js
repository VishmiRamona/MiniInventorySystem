import axios from 'axios';

const API = axios.create({
  baseURL: 'https://miniinventory-backend.azurewebsites.net/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

export default API;