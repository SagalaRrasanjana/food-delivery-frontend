import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from './api/axiosInstance';
import AppHeader from './AppHeader';
import { BRAND, COLORS, RADIUS, SHADOW_CARD, FONT_FAMILY } from './theme';

export default function OwnerDashboard() {
    const navigate = useNavigate();

    // --- State ---
    const [newItem, setNewItem] = useState({ name: '', description: '', price: '', menuCategory: 'Mains' });
    const [successMsg, setSuccessMsg] = useState('');
    const [orders, setOrders] = useState([]);

    // Hardcoded until the backend exposes an owner->restaurant lookup.
    // auth-service's JWT only ever carries `sub` (email), `role`, and `id`
    // (the numeric User.id) — never a restaurantId — so this can't be
    // resolved client-side; it needs something like
    // GET /api/restaurants?ownerId={jwt id} on restaurant-service.
    const RESTAURANT_ID = 1;

    const fetchOrders = async () => {
        try {
            // Paginated (Page<Order>), so unwrap .content instead of using the raw body as an array
            const response = await api.get(`/api/orders/restaurant/${RESTAURANT_ID}`);
            setOrders(response.data.content);
        } catch (error) {
            console.error("Failed to fetch live orders", error);
        }
    };

    // --- Fetch Live Orders on Load ---
    useEffect(() => {
        fetchOrders();
        // Poll for new orders every 10 seconds
        const interval = setInterval(fetchOrders, 10000);
        return () => clearInterval(interval);
    }, []);

    // --- Action: Update Order Status ---
    const updateOrderStatus = async (orderId, newStatus) => {
        try {
            await api.put(`/api/orders/${orderId}/status`, { status: newStatus });
            // Refresh the KDS board so the ticket moves to the next column
            fetchOrders();
        } catch (error) {
            console.error("Failed to update status", error);
            alert("Error updating order status.");
        }
    };

    // --- Action: Add Menu Item ---
    const handleMenuSubmit = async (e) => {
        e.preventDefault();
        const payload = { ...newItem, price: parseFloat(newItem.price), restaurantId: RESTAURANT_ID };

        try {
            await api.post('/api/menu-items', payload);
            setSuccessMsg("Menu item added successfully!");
            setNewItem({ name: '', description: '', price: '', menuCategory: 'Mains' });
            setTimeout(() => setSuccessMsg(''), 3000);
        } catch (error) {
            console.error("Failed to add menu item", error);
            alert("Error adding item. Check console.");
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('jwt_token');
        navigate('/');
    };

    const formatOrderItems = (items) => {
        if (!items) return "";
        return items.map(item => `${item.quantity}x ${item.name}`).join(", ");
    };

    const inputStyle = { padding: "14px", backgroundColor: COLORS.surfaceMuted, border: `1px solid ${COLORS.border}`, color: COLORS.textPrimary, borderRadius: RADIUS.sm, fontFamily: "inherit", fontSize: "14.5px" };

    return (
        <div style={{ minHeight: "100vh", backgroundColor: COLORS.pageBg, color: COLORS.textPrimary, fontFamily: FONT_FAMILY, padding: "40px", boxSizing: "border-box" }}>

            <AppHeader
                title="Restaurant Control Panel"
                subtitle={BRAND}
                actionLabel="Logout"
                onAction={handleLogout}
            />

            <div style={{ display: "flex", gap: "40px", maxWidth: "1600px", margin: "0 auto" }}>

                {/* LEFT COLUMN: Menu Manager */}
                <div style={{ flex: "1", maxWidth: "500px" }}>
                    <div style={{ backgroundColor: COLORS.surface, border: `1px solid ${COLORS.border}`, borderRadius: RADIUS.lg, padding: "30px", boxShadow: SHADOW_CARD }}>
                        <h2 style={{ fontSize: "24px", margin: "0 0 20px 0", borderBottom: `1px solid ${COLORS.border}`, paddingBottom: "15px" }}>Add Menu Item</h2>

                        <form onSubmit={handleMenuSubmit} style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
                            <input type="text" placeholder="Item Name" required value={newItem.name} onChange={e => setNewItem({...newItem, name: e.target.value})} style={inputStyle} />
                            <textarea placeholder="Description" required rows="3" value={newItem.description} onChange={e => setNewItem({...newItem, description: e.target.value})} style={{ ...inputStyle, resize: "none" }} />
                            <div style={{ display: "flex", gap: "15px" }}>
                                <input type="number" placeholder="Price (Rs.)" required step="0.01" value={newItem.price} onChange={e => setNewItem({...newItem, price: e.target.value})} style={{ ...inputStyle, flex: 1 }} />
                                <select value={newItem.menuCategory} onChange={e => setNewItem({...newItem, menuCategory: e.target.value})} style={{ ...inputStyle, flex: 1, cursor: "pointer" }}>
                                    <option value="Mains">Mains</option>
                                    <option value="Starters">Starters</option>
                                    <option value="Beverages">Beverages</option>
                                    <option value="Desserts">Desserts</option>
                                </select>
                            </div>
                            <button type="submit" style={{ backgroundColor: COLORS.accent, color: "#fff", border: "none", padding: "16px", borderRadius: RADIUS.sm, fontSize: "16px", fontWeight: "700", cursor: "pointer", marginTop: "10px", fontFamily: "inherit", boxShadow: `0 10px 20px -8px ${COLORS.accent}8c` }}>
                                Publish to Menu
                            </button>
                            {successMsg && <p style={{ color: COLORS.success, textAlign: "center", margin: "10px 0 0 0", fontWeight: "600" }}>{successMsg}</p>}
                        </form>
                    </div>
                </div>

                {/* RIGHT COLUMN: Kitchen Display System (KDS) */}
                <div style={{ flex: "2" }}>
                    <h2 style={{ fontSize: "24px", margin: "0 0 20px 0" }}>Live Orders (KDS)</h2>

                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}>

                        {/* PENDING Column */}
                        <div style={{ backgroundColor: COLORS.accentSoft, border: `1px solid ${COLORS.accentBorder}`, borderRadius: RADIUS.lg, padding: "20px", minHeight: "500px" }}>
                            <h3 style={{ color: COLORS.accent, margin: "0 0 20px 0", display: "flex", justifyContent: "space-between" }}>
                                PENDING <span style={{ backgroundColor: COLORS.accentBorder, padding: "2px 10px", borderRadius: "12px", fontSize: "14px" }}>
                                    {orders.filter(o => o.status === 'PENDING').length}
                                </span>
                            </h3>

                            {orders.filter(o => o.status === 'PENDING').map(order => (
                                <div key={order.id} style={{ backgroundColor: COLORS.surface, border: `1px solid ${COLORS.border}`, padding: "20px", borderRadius: RADIUS.md, marginBottom: "15px", boxShadow: SHADOW_CARD }}>
                                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "10px", borderBottom: `1px solid ${COLORS.border}`, paddingBottom: "10px" }}>
                                        <span style={{ fontWeight: "700", color: COLORS.textPrimary }}>Order #{order.id}</span>
                                        <span style={{ color: COLORS.accent, fontWeight: "700" }}>Rs. {order.totalAmount}</span>
                                    </div>
                                    <p style={{ margin: "0 0 15px 0", color: COLORS.textSecondary, lineHeight: "1.5" }}>{formatOrderItems(order.items)}</p>

                                    <button
                                        onClick={() => updateOrderStatus(order.id, 'PREPARING')}
                                        style={{ width: "100%", backgroundColor: COLORS.textPrimary, color: "#fff", border: "none", padding: "10px", borderRadius: RADIUS.sm, cursor: "pointer", fontWeight: "600", fontFamily: "inherit" }}
                                    >
                                        Start Preparing &#8594;
                                    </button>
                                </div>
                            ))}
                        </div>

                        {/* PREPARING Column */}
                        <div style={{ backgroundColor: COLORS.infoSoft, border: `1px solid ${COLORS.infoBorder}`, borderRadius: RADIUS.lg, padding: "20px", minHeight: "500px" }}>
                            <h3 style={{ color: COLORS.info, margin: "0 0 20px 0", display: "flex", justifyContent: "space-between" }}>
                                PREPARING <span style={{ backgroundColor: COLORS.infoBorder, padding: "2px 10px", borderRadius: "12px", fontSize: "14px" }}>
                                    {orders.filter(o => o.status === 'PREPARING').length}
                                </span>
                            </h3>

                            {orders.filter(o => o.status === 'PREPARING').map(order => (
                                <div key={order.id} style={{ backgroundColor: COLORS.surface, border: `1px solid ${COLORS.border}`, padding: "20px", borderRadius: RADIUS.md, marginBottom: "15px", boxShadow: SHADOW_CARD }}>
                                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "10px", borderBottom: `1px solid ${COLORS.border}`, paddingBottom: "10px" }}>
                                        <span style={{ fontWeight: "700", color: COLORS.textPrimary }}>Order #{order.id}</span>
                                        <span style={{ color: COLORS.accent, fontWeight: "700" }}>Rs. {order.totalAmount}</span>
                                    </div>
                                    <p style={{ margin: "0 0 15px 0", color: COLORS.textSecondary, lineHeight: "1.5" }}>{formatOrderItems(order.items)}</p>

                                    <button
                                        onClick={() => updateOrderStatus(order.id, 'READY')}
                                        style={{ width: "100%", backgroundColor: COLORS.success, color: "#fff", border: "none", padding: "10px", borderRadius: RADIUS.sm, cursor: "pointer", fontWeight: "600", fontFamily: "inherit" }}
                                    >
                                        Mark as Ready &#10003;
                                    </button>
                                </div>
                            ))}
                        </div>

                    </div>
                </div>

            </div>
        </div>
    );
}
