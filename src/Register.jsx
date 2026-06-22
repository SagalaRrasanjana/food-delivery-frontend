import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from './api/axiosInstance';

export default function Register() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState('CUSTOMER'); 
    const [message, setMessage] = useState('');
    
    const navigate = useNavigate();

    const handleRegister = async (e) => {
        e.preventDefault();
        try {
            await api.post('/auth/register', { name, email, password, role });
            setMessage(' Registration successful! Redirecting to login...');
            setTimeout(() => navigate('/login'), 2000);
        } catch (error) {
            setMessage(' Registration Failed. Email might be in use.');
            console.error(error);
        }
    };

    return (
        <div style={{ padding: '50px', fontFamily: 'sans-serif' }}>
            <h2>Create an Account</h2>
            <form onSubmit={handleRegister} style={{ display: 'flex', flexDirection: 'column', width: '300px', gap: '15px' }}>
                <input type="text" placeholder="Full Name" value={name} onChange={(e) => setName(e.target.value)} required />
                <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
                <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required />
                
                <select value={role} onChange={(e) => setRole(e.target.value)} style={{ padding: '10px' }}>
                    <option value="CUSTOMER">Customer</option>
                    <option value="RESTAURANT_OWNER">Restaurant Owner</option>
                </select>

                <button type="submit" style={{ padding: '10px', cursor: 'pointer' }}>Sign Up</button>
            </form>
            <p><strong>{message}</strong></p>
            <p>Already have an account? <Link to="/login">Login here</Link></p>
        </div>
    );
}