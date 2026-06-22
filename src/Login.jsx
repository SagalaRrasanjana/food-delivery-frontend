import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom'; 
import { jwtDecode } from 'jwt-decode'; 
import api from './api/axiosInstance';

export default function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');
    
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const response = await api.post('/auth/login', { email, password });
            const token = response.data;
            
            
            localStorage.setItem('jwt_token', token);
            
            //  Decode the token to read the role
            const decodedToken = jwtDecode(token);
            const userRole = decodedToken.role;
            
            
            if (userRole === 'CUSTOMER') {
                navigate('/history'); 
            } else if (userRole === 'RESTAURANT_OWNER' || userRole === 'ADMIN') {
                navigate('/dashboard'); 
            } else {
                setMessage('Unknown role detected.');
            }
            
        } catch (error) {
            setMessage(' Login Failed. Check credentials.');
            console.error(error);
        }
    };

    return (
        <div style={{ padding: '50px', fontFamily: 'sans-serif' }}>
            <h2>Login</h2>
            <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', width: '300px', gap: '15px' }}>
                <input 
                    type="email" 
                    placeholder="Email" 
                    value={email} 
                    onChange={(e) => setEmail(e.target.value)} 
                    required 
                />
                <input 
                    type="password" 
                    placeholder="Password" 
                    value={password} 
                    onChange={(e) => setPassword(e.target.value)} 
                    required 
                />
                <button type="submit" style={{ padding: '10px', cursor: 'pointer' }}>Login</button>
            </form>
            <p><strong>{message}</strong></p>
            <p>Don't have an account? <Link to="/register">Sign up here</Link></p>
        </div>
    );
}