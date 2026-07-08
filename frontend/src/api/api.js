import axios from 'axios';

const API = axios.create({
  baseURL: 'https://miniinventory-backend-cwfmdaf9epc7bef9.southeastasia-01.azurewebsites.net/api/',
  headers: {
    'Content-Type': 'application/json',
  },
});

export default API;