import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './Login';
import Register from './Register';
import OrderHistory from './OrderHistory';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        
        {/* Customer Routes */}
        <Route path="/history" element={<OrderHistory />} />
        
        {/* Restaurant Routes */}
        <Route path="/dashboard" element={<h2 style={{padding: '50px'}}>🚧 Restaurant Dashboard Coming Soon!</h2>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;