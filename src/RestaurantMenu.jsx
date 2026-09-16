import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from './api/axiosInstance';
import { COLORS, RADIUS, SHADOW_CARD, FONT_FAMILY } from './theme';

export default function RestaurantMenu() {
    const { id } = useParams(); // Grabs the restaurant ID from the URL
    const navigate = useNavigate();

    const [restaurant, setRestaurant] = useState(null);
    const [menu, setMenu] = useState([]);
    const [cart, setCart] = useState([]);
    const [deliveryAddress, setDeliveryAddress] = useState('');
    const [checkoutError, setCheckoutError] = useState('');
    const [loading, setLoading] = useState(true);

    // 1. Fetch real data from your Spring Boot Restaurant Service
    useEffect(() => {
        const fetchRestaurantData = async () => {
            try {
                // Fetch the restaurant details (banner, name, tags)
                const restaurantResponse = await api.get(`/api/restaurants/${id}`);
                setRestaurant(restaurantResponse.data);

                // Fetch the restaurant's menu items — paginated (Page<MenuItem>), so unwrap .content
                const menuResponse = await api.get(`/api/menu-items/restaurant/${id}`);
                setMenu(menuResponse.data.content);

                setLoading(false);
            } catch (error) {
                console.error("Failed to load restaurant data from backend", error);
                setLoading(false);
            }
        };

        fetchRestaurantData();
    }, [id]);

    // 2. Cart Logic
    const addToCart = (item) => {
        setCart(prevCart => {
            const existing = prevCart.find(cartItem => cartItem.menuItemId === item.id);
            if (existing) {
                return prevCart.map(cartItem =>
                    cartItem.menuItemId === item.id
                    ? { ...cartItem, quantity: cartItem.quantity + 1 }
                    : cartItem
                );
            }
            return [...prevCart, { menuItemId: item.id, name: item.name, price: item.price, quantity: 1 }];
        });
    };

    const cartTotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

    // 3. The Checkout Action (Hits your Order Service!)
    const handleCheckout = async () => {
        if (cart.length === 0) return;

        if (!deliveryAddress.trim()) {
            setCheckoutError('Delivery address is required.');
            return;
        }
        setCheckoutError('');

        const orderPayload = {
            restaurantId: parseInt(id),
            items: cart,
            deliveryAddress: deliveryAddress.trim()
        };

        try {
            // Shoots directly through the API Gateway!
            const response = await api.post('/api/orders', orderPayload);
            console.log("Order Success!", response.data);
            alert("Order placed successfully! Sending you to receipt history.");
            navigate('/history');
        } catch (error) {
            console.error("Checkout failed", error);
            alert("Failed to place order. Check your console.");
        }
    };

    // Show a loading screen while fetching from Java backend
    if (loading) {
        return (
            <div style={{ minHeight: "100vh", backgroundColor: COLORS.pageBg, color: COLORS.textPrimary, fontFamily: FONT_FAMILY, display: "flex", justifyContent: "center", alignItems: "center" }}>
                <h2>Loading menu...</h2>
            </div>
        );
    }

    if (!restaurant) return (
        <div style={{ minHeight: "100vh", backgroundColor: COLORS.pageBg, color: COLORS.textPrimary, fontFamily: FONT_FAMILY, display: "flex", justifyContent: "center", alignItems: "center" }}>
            <h2>Restaurant not found.</h2>
        </div>
    );

    return (
        <div style={{ minHeight: "100vh", backgroundColor: COLORS.pageBg, color: COLORS.textPrimary, fontFamily: FONT_FAMILY }}>

            {/* Cinematic Hero Header (Golden Hour Lighting Overlay) */}
            <div style={{
                height: "45vh",
                width: "100%",
                backgroundImage: `linear-gradient(to top, rgba(36,31,26,0.95) 0%, rgba(183, 91, 61, 0.35) 55%, rgba(36,31,26,0.35) 100%), url(${restaurant.bannerUrl})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
                display: "flex",
                alignItems: "flex-end",
                padding: "40px"
            }}>
                <div>
                    <span style={{ backgroundColor: "rgba(255,255,255,0.16)", color: "#fff", padding: "6px 14px", borderRadius: "20px", fontSize: "14px", fontWeight: "600", backdropFilter: "blur(4px)", border: "1px solid rgba(255,255,255,0.3)", marginBottom: "15px", display: "inline-block" }}>
                        {restaurant.rating} • {restaurant.tags}
                    </span>
                    <h1 style={{ fontSize: "56px", margin: "0 0 10px 0", fontWeight: "800", letterSpacing: "-1px", color: "#fff", textShadow: "0 4px 20px rgba(0,0,0,0.5)" }}>
                        {restaurant.name}
                    </h1>
                </div>
            </div>

            {/* Main Content Layout */}
            <div style={{ display: "flex", padding: "40px", gap: "40px", maxWidth: "1600px", margin: "0 auto" }}>

                {/* Left: Menu Items */}
                <div style={{ flex: "1" }}>
                    <h2 style={{ fontSize: "28px", borderBottom: `1px solid ${COLORS.border}`, paddingBottom: "15px", marginBottom: "30px" }}>Menu</h2>
                    <div style={{ display: "grid", gap: "20px" }}>
                        {menu.map(item => (
                            <div key={item.id} style={{
                                backgroundColor: COLORS.surface,
                                border: `1px solid ${COLORS.border}`,
                                borderRadius: RADIUS.lg,
                                padding: "24px",
                                display: "flex",
                                justifyContent: "space-between",
                                alignItems: "center",
                                boxShadow: SHADOW_CARD,
                                transition: "all 0.2s ease"
                            }}>
                                <div>
                                    <h3 style={{ margin: "0 0 8px 0", fontSize: "20px", color: COLORS.textPrimary }}>{item.name}</h3>
                                    <p style={{ margin: 0, color: COLORS.textSecondary, fontSize: "15px", maxWidth: "400px" }}>{item.description}</p>
                                    <p style={{ margin: "12px 0 0 0", color: COLORS.accent, fontWeight: "700", fontSize: "18px" }}>Rs. {item.price.toFixed(2)}</p>
                                </div>
                                <button
                                    onClick={() => addToCart(item)}
                                    style={{
                                        backgroundColor: COLORS.accent, color: "#fff", border: "none", padding: "12px 24px", borderRadius: RADIUS.md, fontWeight: "700", cursor: "pointer", fontFamily: "inherit"
                                    }}
                                >
                                    Add +
                                </button>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Right: The Cart */}
                <div style={{ width: "380px" }}>
                    <div style={{
                        backgroundColor: COLORS.surface,
                        border: `1px solid ${COLORS.border}`,
                        borderRadius: RADIUS.xl,
                        padding: "30px",
                        boxShadow: SHADOW_CARD,
                        position: "sticky",
                        top: "40px"
                    }}>
                        <h2 style={{ margin: "0 0 24px 0", fontSize: "24px" }}>Your Order</h2>

                        {cart.length === 0 ? (
                            <p style={{ color: COLORS.textMuted, textAlign: "center", margin: "40px 0" }}>Cart is empty</p>
                        ) : (
                            <div style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
                                {cart.map((item, index) => (
                                    <div key={index} style={{ display: "flex", justifyContent: "space-between", fontSize: "15px" }}>
                                        <span style={{ color: COLORS.textPrimary }}>{item.quantity}x {item.name}</span>
                                        <span style={{ fontWeight: "600", color: COLORS.textPrimary }}>Rs. {(item.price * item.quantity).toFixed(2)}</span>
                                    </div>
                                ))}

                                <div style={{ borderTop: `1px solid ${COLORS.border}`, marginTop: "15px", paddingTop: "20px", display: "flex", justifyContent: "space-between", fontSize: "20px", fontWeight: "700" }}>
                                    <span>Total:</span>
                                    <span style={{ color: COLORS.accent }}>Rs. {cartTotal.toFixed(2)}</span>
                                </div>

                                <div style={{ marginTop: "16px" }}>
                                    <label style={{ display: "block", fontSize: "13px", fontWeight: "600", color: COLORS.textSecondary, marginBottom: "6px" }}>
                                        Delivery address
                                    </label>
                                    <textarea
                                        placeholder="Street, house/apartment no., city"
                                        required
                                        rows="2"
                                        value={deliveryAddress}
                                        onChange={(e) => setDeliveryAddress(e.target.value)}
                                        style={{
                                            width: "100%",
                                            padding: "12px 14px",
                                            border: `1px solid ${COLORS.border}`,
                                            borderRadius: RADIUS.sm,
                                            background: COLORS.surfaceMuted,
                                            fontSize: "14px",
                                            color: COLORS.textPrimary,
                                            fontFamily: "inherit",
                                            outline: "none",
                                            resize: "none"
                                        }}
                                    />
                                </div>

                                {checkoutError && (
                                    <p style={{ color: COLORS.danger, fontSize: "13.5px", fontWeight: "600", margin: "8px 0 0" }}>{checkoutError}</p>
                                )}

                                <button
                                    onClick={handleCheckout}
                                    style={{
                                        backgroundColor: COLORS.accent,
                                        color: "#fff",
                                        border: "none",
                                        padding: "18px",
                                        borderRadius: RADIUS.md,
                                        fontSize: "18px",
                                        fontWeight: "700",
                                        marginTop: "20px",
                                        cursor: "pointer",
                                        fontFamily: "inherit",
                                        boxShadow: `0 10px 20px -8px ${COLORS.accent}8c`
                                    }}
                                >
                                    Confirm Order
                                </button>
                            </div>
                        )}
                    </div>
                </div>

            </div>
        </div>
    );
}
