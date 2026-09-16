import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from './api/axiosInstance';
import AppHeader from './AppHeader';
import { BRAND, COLORS, RADIUS, SHADOW_CARD, FONT_FAMILY } from './theme';


export default function AdminDashboard() {
    const navigate = useNavigate();

    //  Mock Data States
    const [stats, setStats] = useState({
        totalUsers: 1240,
        activeRestaurants: 42,
        totalOrders: 8930,
        systemRevenue: 450200.00
    });

    const [pendingRestaurants, setPendingRestaurants] = useState([
        { id: 101, name: "Kandy Spices", owner: "kamal@kandy.com", status: "PENDING" },
        { id: 102, name: "Ocean View Seafood", owner: "admin@oceanview.com", status: "PENDING" }
    ]);

    const [recentActivity, setActivity] = useState([
        { id: 1, log: "New user registered: pasindu@gmail.com", time: "2 mins ago" },
        { id: 2, log: "Order #8930 marked DELIVERED", time: "15 mins ago" },
        { id: 3, log: "Restaurant 'Colombo Street Kitchen' updated menu", time: "1 hour ago" }
    ]);

    useEffect(() => {
        const fetchAdminData = async () => {
            try {
                const response = await api.get('/api/admin/dashboard-stats');
                setStats(response.data.stats);
            } catch (error) {
                console.error("Failed to fetch admin dashboard stats", error);
            }
        };
        fetchAdminData();
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('jwt_token');
        navigate('/');
    };

    const approveRestaurant = (id) => {
        // Future Axios PUT request goes here
        setPendingRestaurants(prev => prev.filter(r => r.id !== id));
        alert(`Restaurant #${id} approved and added to system!`);
    };

    return (
        <div style={{ minHeight: "100vh", backgroundColor: COLORS.pageBg, color: COLORS.textPrimary, fontFamily: FONT_FAMILY, padding: "40px", boxSizing: "border-box" }}>

            <AppHeader
                title="Admin Center"
                subtitle={`${BRAND.toUpperCase()} — PLATFORM ADMIN`}
                actionLabel="Logout"
                onAction={handleLogout}
            />

            <div style={{ maxWidth: "1600px", margin: "0 auto", display: "flex", flexDirection: "column", gap: "40px" }}>

                {/* Metrics Grid */}
                <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "20px" }}>

                    <div style={{ backgroundColor: COLORS.surface, border: `1px solid ${COLORS.border}`, borderRadius: RADIUS.lg, padding: "25px", borderTop: `4px solid ${COLORS.info}`, boxShadow: SHADOW_CARD }}>
                        <h3 style={{ color: COLORS.textSecondary, margin: "0 0 10px 0", fontSize: "16px" }}>Total Users</h3>
                        <p style={{ color: COLORS.textPrimary, margin: 0, fontSize: "36px", fontWeight: "800" }}>{stats.totalUsers.toLocaleString()}</p>
                    </div>

                    <div style={{ backgroundColor: COLORS.surface, border: `1px solid ${COLORS.border}`, borderRadius: RADIUS.lg, padding: "25px", borderTop: `4px solid ${COLORS.accent}`, boxShadow: SHADOW_CARD }}>
                        <h3 style={{ color: COLORS.textSecondary, margin: "0 0 10px 0", fontSize: "16px" }}>Active Restaurants</h3>
                        <p style={{ color: COLORS.textPrimary, margin: 0, fontSize: "36px", fontWeight: "800" }}>{stats.activeRestaurants}</p>
                    </div>

                    <div style={{ backgroundColor: COLORS.surface, border: `1px solid ${COLORS.border}`, borderRadius: RADIUS.lg, padding: "25px", borderTop: `4px solid ${COLORS.success}`, boxShadow: SHADOW_CARD }}>
                        <h3 style={{ color: COLORS.textSecondary, margin: "0 0 10px 0", fontSize: "16px" }}>Total Orders</h3>
                        <p style={{ color: COLORS.textPrimary, margin: 0, fontSize: "36px", fontWeight: "800" }}>{stats.totalOrders.toLocaleString()}</p>
                    </div>

                    <div style={{ backgroundColor: COLORS.surface, border: `1px solid ${COLORS.border}`, borderRadius: RADIUS.lg, padding: "25px", borderTop: "4px solid #8B6BAF", boxShadow: SHADOW_CARD }}>
                        <h3 style={{ color: COLORS.textSecondary, margin: "0 0 10px 0", fontSize: "16px" }}>System Revenue</h3>
                        <p style={{ color: COLORS.textPrimary, margin: 0, fontSize: "36px", fontWeight: "800" }}>Rs. {stats.systemRevenue.toLocaleString()}</p>
                    </div>

                </div>

                {/* Main Content Split */}
                <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: "40px" }}>

                    {/* Left: Restaurant Approvals */}
                    <div style={{ backgroundColor: COLORS.surface, border: `1px solid ${COLORS.border}`, borderRadius: RADIUS.lg, padding: "30px", boxShadow: SHADOW_CARD }}>
                        <h2 style={{ fontSize: "24px", margin: "0 0 20px 0", borderBottom: `1px solid ${COLORS.border}`, paddingBottom: "15px" }}>Pending Restaurant Approvals</h2>

                        {pendingRestaurants.length === 0 ? (
                            <p style={{ color: COLORS.textMuted }}>No pending requests at this time.</p>
                        ) : (
                            <div style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
                                {pendingRestaurants.map(restaurant => (
                                    <div key={restaurant.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", backgroundColor: COLORS.surfaceMuted, padding: "20px", borderRadius: RADIUS.md, border: `1px solid ${COLORS.border}` }}>
                                        <div>
                                            <h3 style={{ margin: "0 0 5px 0", color: COLORS.textPrimary }}>{restaurant.name}</h3>
                                            <p style={{ margin: 0, color: COLORS.textSecondary, fontSize: "14px" }}>Owner: {restaurant.owner}</p>
                                        </div>
                                        <div style={{ display: "flex", gap: "10px" }}>
                                            <button
                                                onClick={() => approveRestaurant(restaurant.id)}
                                                style={{ backgroundColor: COLORS.success, color: "#fff", border: "none", padding: "10px 20px", borderRadius: RADIUS.sm, fontWeight: "600", cursor: "pointer", fontFamily: "inherit" }}
                                            >
                                                Approve
                                            </button>
                                            <button
                                                onClick={() => setPendingRestaurants(prev => prev.filter(r => r.id !== restaurant.id))}
                                                style={{ backgroundColor: COLORS.danger, color: "#fff", border: "none", padding: "10px 20px", borderRadius: RADIUS.sm, fontWeight: "600", cursor: "pointer", fontFamily: "inherit" }}
                                            >
                                                Reject
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Right: System Activity Log */}
                    <div style={{ backgroundColor: COLORS.surface, border: `1px solid ${COLORS.border}`, borderRadius: RADIUS.lg, padding: "30px", boxShadow: SHADOW_CARD }}>
                        <h2 style={{ fontSize: "24px", margin: "0 0 20px 0", borderBottom: `1px solid ${COLORS.border}`, paddingBottom: "15px" }}>Live Activity Log</h2>

                        <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
                            {recentActivity.map(activity => (
                                <div key={activity.id} style={{ display: "flex", gap: "15px" }}>
                                    <div style={{ width: "10px", height: "10px", backgroundColor: COLORS.info, borderRadius: "50%", marginTop: "6px", flexShrink: 0 }} />
                                    <div>
                                        <p style={{ margin: "0 0 5px 0", color: COLORS.textPrimary, fontSize: "15px" }}>{activity.log}</p>
                                        <span style={{ color: COLORS.textMuted, fontSize: "12px", fontWeight: "600" }}>{activity.time}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}
