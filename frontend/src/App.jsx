import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Categories from './pages/Categories';
import Suppliers from './pages/Suppliers';
import Items from './pages/Items';
import StockIn from './pages/StockIn';
import StockOut from './pages/StockOut';
import StockBalance from './pages/StockBalance';
import LowStock from './pages/LowStock';
import Users from './pages/Users';

const PrivateRoute = ({ element }) => {
  const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true';
  return isAuthenticated ? element : <Navigate to="/login" />;
};

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<PrivateRoute element={<Layout />} />}>
          <Route index element={<Dashboard />} />
          <Route path="categories" element={<Categories />} />
          <Route path="suppliers" element={<Suppliers />} />
          <Route path="items" element={<Items />} />
          <Route path="stock/in" element={<StockIn />} />
          <Route path="stock/out" element={<StockOut />} />
          <Route path="stock/balance" element={<StockBalance />} />
          <Route path="stock/low-stock" element={<LowStock />} />
          <Route path="users" element={<Users />} /> 
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;