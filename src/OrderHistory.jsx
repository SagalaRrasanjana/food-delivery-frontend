import { useState, useEffect } from 'react';
import api from './api/axiosInstance';

export default function OrderHistory() {
    const [orders, setOrders] = useState([]);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                // This calls http://localhost:8000/api/orders/history
                const response = await api.get('/orders/history');
                setOrders(response.data);
            } catch (err) {
                setError('Failed to load orders. Are you logged in?');
                console.error(err);
            }
        };

        fetchOrders();
    }, []);

    return (
        <div style={{ padding: '50px', fontFamily: 'sans-serif' }}>
            <h2>My Order History</h2>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                {orders.map(order => (
                    <div key={order.id} style={{ border: '1px solid #ccc', padding: '15px', borderRadius: '8px' }}>
                        <h3>Order #{order.id}</h3>
                        <p><strong>Status:</strong> {order.status}</p>
                        <p><strong>Total:</strong> Rs. {order.totalAmount}</p>
                        <p><strong>Date:</strong> {new Date(order.orderTime).toLocaleString()}</p>
                    </div>
                ))}
            </div>
        </div>
    );
}