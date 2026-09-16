import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from './api/axiosInstance';
import AppHeader from './AppHeader';
import { COLORS, RADIUS, SHADOW_CARD, FONT_FAMILY } from './theme';

export default function OrderHistory() {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchOrderHistory = async () => {
            try {
                // Paginated (Page<Order>), so unwrap .content instead of using the raw body as an array
                const response = await api.get('/api/orders/history');
                setOrders(response.data.content);
                setLoading(false);
            } catch (error) {
                console.error("Failed to fetch order history", error);
                setLoading(false);
            }
        };

        fetchOrderHistory();
    }, []);

    // Helper function to format the timestamp from your Java backend
    const formatDateTime = (dateString) => {
        if (!dateString) return "Just now";
        const options = { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' };
        return new Date(dateString).toLocaleDateString(undefined, options);
    };

    // Helper function to build the visual tracker pipeline
    const renderTracker = (status) => {
        const steps = ['PENDING', 'PREPARING', 'READY'];
        let currentStepIndex = steps.indexOf(status);
        if (currentStepIndex === -1) currentStepIndex = 0; // Fallback

        return (
            <div style={{ display: "flex", alignItems: "center", gap: "10px", marginTop: "20px" }}>
                {steps.map((step, index) => {
                    const isActive = index <= currentStepIndex;
                    const isLast = index === steps.length - 1;

                    let activeColor = COLORS.accent; // Terracotta for Pending
                    if (step === 'PREPARING') activeColor = COLORS.info; // Blue for Preparing
                    if (step === 'READY') activeColor = COLORS.success; // Green for Ready

                    return (
                        <div key={step} style={{ display: "flex", alignItems: "center", flex: isLast ? "0" : "1" }}>
                            <div style={{
                                backgroundColor: isActive ? activeColor : COLORS.surfaceSunken,
                                color: isActive ? "#fff" : COLORS.textMuted,
                                padding: "6px 12px",
                                borderRadius: "20px",
                                fontSize: "12px",
                                fontWeight: "700",
                                letterSpacing: "1px",
                                transition: "all 0.3s ease"
                            }}>
                                {step}
                            </div>
                            {!isLast && (
                                <div style={{
                                    flex: 1,
                                    height: "2px",
                                    backgroundColor: isActive ? activeColor : COLORS.border,
                                    margin: "0 10px",
                                    transition: "all 0.3s ease"
                                }} />
                            )}
                        </div>
                    );
                })}
            </div>
        );
    };

    if (loading) {
        return (
            <div style={{ minHeight: "100vh", backgroundColor: COLORS.pageBg, color: COLORS.textPrimary, fontFamily: FONT_FAMILY, display: "flex", justifyContent: "center", alignItems: "center" }}>
                <h2>Loading your history...</h2>
            </div>
        );
    }

    return (
        <div style={{ minHeight: "100vh", backgroundColor: COLORS.pageBg, color: COLORS.textPrimary, fontFamily: FONT_FAMILY, padding: "60px 20px" }}>

            <div style={{ maxWidth: "800px", margin: "0 auto" }}>

                <AppHeader
                    title="Order History"
                    actionLabel="Back to Home"
                    onAction={() => navigate('/dashboard')}
                />

                {orders.length === 0 ? (
                    <div style={{ textAlign: "center", padding: "60px", backgroundColor: COLORS.surface, borderRadius: RADIUS.lg, border: `1px solid ${COLORS.border}`, boxShadow: SHADOW_CARD }}>
                        <h2 style={{ color: COLORS.textSecondary, margin: 0 }}>No past orders found.</h2>
                        <p style={{ color: COLORS.textMuted, marginTop: "10px" }}>When you place an order, it will appear here.</p>
                    </div>
                ) : (
                    <div style={{ display: "flex", flexDirection: "column", gap: "25px" }}>
                        {orders.map(order => (
                            <div key={order.id} style={{
                                backgroundColor: COLORS.surface,
                                border: `1px solid ${COLORS.border}`,
                                borderRadius: RADIUS.lg,
                                padding: "30px",
                                boxShadow: SHADOW_CARD
                            }}>

                                {/* Header: Order ID and Date */}
                                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "20px" }}>
                                    <div>
                                        <h2 style={{ margin: "0 0 5px 0", fontSize: "20px", color: COLORS.textPrimary }}>Order #{order.id}</h2>
                                        <span style={{ color: COLORS.textSecondary, fontSize: "14px" }}>{formatDateTime(order.orderTime)}</span>
                                    </div>
                                    <h3 style={{ margin: 0, color: COLORS.accent, fontSize: "22px" }}>Rs. {order.totalAmount.toFixed(2)}</h3>
                                </div>

                                {/* Items List */}
                                <div style={{ backgroundColor: COLORS.surfaceMuted, padding: "15px", borderRadius: RADIUS.sm, border: `1px solid ${COLORS.border}` }}>
                                    {order.items.map((item, index) => (
                                        <div key={index} style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", borderBottom: index !== order.items.length - 1 ? `1px solid ${COLORS.border}` : "none" }}>
                                            <span style={{ color: COLORS.textPrimary }}>{item.quantity}x {item.name}</span>
                                            <span style={{ color: COLORS.textSecondary }}>Rs. {(item.price * item.quantity).toFixed(2)}</span>
                                        </div>
                                    ))}
                                </div>

                                {/* The Live Tracker */}
                                {renderTracker(order.status || 'PENDING')}

                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
