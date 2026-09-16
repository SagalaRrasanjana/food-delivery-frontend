import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "./api/axiosInstance";
import {
    COLORS,
    AUTH_STYLES,
    applyAuthFocusStyle,
    removeAuthFocusStyle,
} from "./theme";

export default function Register() {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [role, setRole] = useState("CUSTOMER");
    const [showPassword, setShowPassword] = useState(false);
    const [message, setMessage] = useState("");
    const [messageType, setMessageType] = useState("success");

    const navigate = useNavigate();

    const handleRegister = async (e) => {
        e.preventDefault();

        try {
            await api.post("/api/auth/register", {
                name,
                email,
                password,
                role,
            });

            setMessageType("success");
            setMessage("Registration successful! Redirecting...");
            setTimeout(() => navigate("/login"), 2000);
        } catch (error) {
            console.error(error);
            setMessageType("error");
            setMessage("Registration failed. Email may already be in use.");
        }
    };

    return (
        <div style={AUTH_STYLES.page}>
            <div style={AUTH_STYLES.card}>
                <div style={AUTH_STYLES.logoWrap}>
                    <div style={AUTH_STYLES.logoMark}>
                        <FlameIcon />
                    </div>
                    <div style={AUTH_STYLES.logoName}>Ember &amp; Oak</div>
                </div>

                <div style={{ textAlign: "center", marginBottom: 24 }}>
                    <h1 style={AUTH_STYLES.heading}>Create account</h1>
                    <p style={AUTH_STYLES.subheading}>
                        Join us and start ordering today
                    </p>
                </div>

                <form onSubmit={handleRegister}>
                    <div style={AUTH_STYLES.fieldWrap}>
                        <span style={AUTH_STYLES.fieldIcon}>
                            <UserIcon />
                        </span>
                        <input
                            type="text"
                            placeholder="Full name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                            style={AUTH_STYLES.input}
                            onFocus={(e) => applyAuthFocusStyle(e.target)}
                            onBlur={(e) => removeAuthFocusStyle(e.target)}
                        />
                    </div>

                    <div style={AUTH_STYLES.fieldWrap}>
                        <span style={AUTH_STYLES.fieldIcon}>
                            <MailIcon />
                        </span>
                        <input
                            type="email"
                            placeholder="Email address"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            style={AUTH_STYLES.input}
                            onFocus={(e) => applyAuthFocusStyle(e.target)}
                            onBlur={(e) => removeAuthFocusStyle(e.target)}
                        />
                    </div>

                    <div style={AUTH_STYLES.fieldWrap}>
                        <span style={AUTH_STYLES.fieldIcon}>
                            <LockIcon />
                        </span>
                        <input
                            type={showPassword ? "text" : "password"}
                            placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            style={{ ...AUTH_STYLES.input, paddingRight: 42 }}
                            onFocus={(e) => applyAuthFocusStyle(e.target)}
                            onBlur={(e) => removeAuthFocusStyle(e.target)}
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword((v) => !v)}
                            style={AUTH_STYLES.eyeButton}
                            aria-label={
                                showPassword ? "Hide password" : "Show password"
                            }
                        >
                            {showPassword ? <EyeOffIcon /> : <EyeIcon />}
                        </button>
                    </div>

                    <div style={{ ...AUTH_STYLES.fieldWrap, marginBottom: 22 }}>
                        <span style={AUTH_STYLES.fieldIcon}>
                            <BriefcaseIcon />
                        </span>
                        <select
                            value={role}
                            onChange={(e) => setRole(e.target.value)}
                            style={selectStyle}
                            onFocus={(e) => applyAuthFocusStyle(e.target)}
                            onBlur={(e) => removeAuthFocusStyle(e.target)}
                        >
                            <option value="CUSTOMER">Customer</option>
                            <option value="RESTAURANT_OWNER">
                                Restaurant Owner
                            </option>
                        </select>
                        <span style={selectChevronStyle}>
                            <ChevronIcon />
                        </span>
                    </div>

                    {message && (
                        <p
                            style={
                                messageType === "success"
                                    ? AUTH_STYLES.success
                                    : AUTH_STYLES.error
                            }
                        >
                            {message}
                        </p>
                    )}

                    <button
                        type="submit"
                        style={AUTH_STYLES.submitButton}
                        onMouseOver={(e) =>
                            (e.currentTarget.style.filter =
                                "brightness(0.93)")
                        }
                        onMouseOut={(e) =>
                            (e.currentTarget.style.filter = "none")
                        }
                    >
                        Create Account
                    </button>
                </form>

                <div style={AUTH_STYLES.footer}>
                    <p style={AUTH_STYLES.footerText}>
                        Already have an account?
                    </p>
                    <Link to="/login" style={loginLinkStyle}>
                        Login
                    </Link>
                </div>
            </div>
        </div>
    );
}

const selectStyle = {
    ...AUTH_STYLES.input,
    paddingRight: 36,
    appearance: "none",
    WebkitAppearance: "none",
    cursor: "pointer",
};

const selectChevronStyle = {
    position: "absolute",
    right: 14,
    top: "50%",
    transform: "translateY(-50%)",
    display: "flex",
    color: COLORS.textMuted,
    pointerEvents: "none",
};

const loginLinkStyle = {
    color: COLORS.accent,
    fontWeight: 600,
    fontSize: 14,
    textDecoration: "none",
};

function FlameIcon() {
    return (
        <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#fff"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <path d="M12 21a7 7 0 0 0 7-7c0-3-2-5-3.5-7.5C14.5 8 13 9 13 10.5c0-2-1-3.5-2-5C9 8 7 10 7 14a7 7 0 0 0 5 7z" />
        </svg>
    );
}

function UserIcon() {
    return (
        <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <circle cx="12" cy="8" r="4" />
            <path d="M4 21c0-4.4 3.6-8 8-8s8 3.6 8 8" />
        </svg>
    );
}

function MailIcon() {
    return (
        <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <rect x="3" y="5" width="18" height="14" rx="2" />
            <path d="m3 7 9 6 9-6" />
        </svg>
    );
}

function LockIcon() {
    return (
        <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <rect x="4" y="10" width="16" height="10" rx="2" />
            <path d="M8 10V7a4 4 0 0 1 8 0v3" />
        </svg>
    );
}

function BriefcaseIcon() {
    return (
        <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <rect x="3" y="7" width="18" height="13" rx="2" />
            <path d="M8 7V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
        </svg>
    );
}

function ChevronIcon() {
    return (
        <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <path d="m6 9 6 6 6-6" />
        </svg>
    );
}

function EyeIcon() {
    return (
        <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <path d="M1.5 12S5 5 12 5s10.5 7 10.5 7-3.5 7-10.5 7S1.5 12 1.5 12Z" />
            <circle cx="12" cy="12" r="3" />
        </svg>
    );
}

function EyeOffIcon() {
    return (
        <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <path d="M3 3l18 18" />
            <path d="M10.6 5.1A10.9 10.9 0 0 1 12 5c7 0 10.5 7 10.5 7a13.4 13.4 0 0 1-3.1 4M6.5 6.6C3.4 8.5 1.5 12 1.5 12s3.5 7 10.5 7a10.6 10.6 0 0 0 4.6-1" />
            <path d="M9.5 9.8a3 3 0 0 0 4.2 4.2" />
        </svg>
    );
}
