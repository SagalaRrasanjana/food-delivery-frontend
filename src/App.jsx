import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './Login';
import Register from './Register';
import OrderHistory from './OrderHistory';
import AdminDashboard from './AdminDashboard';
import OwnerDashboard from './OwnerDashboard';
import RestaurantMenu from './RestaurantMenu';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Default route redirects to login */}
        <Route path="/" element={<Navigate to="/login" replace />} />
        
        {/* Auth Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        
        {/* Customer Routes */}
        <Route path="/history" element={<OrderHistory />} />
        <Route path="/restaurant/:id" element={<RestaurantMenu />} />
        
        {/* Restaurant Owner Route */}
        <Route path="/dashboard" element={<OwnerDashboard />} />
        
        {/* Admin Route */}
        <Route path="/admin" element={<AdminDashboard />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;