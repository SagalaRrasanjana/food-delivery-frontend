import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "./api/axiosInstance";
import {
    COLORS,
    AUTH_STYLES,
    applyAuthFocusStyle,
    removeAuthFocusStyle,
} from "./theme";

const REMEMBER_KEY = "remembered_email";

export default function Login() {
    const navigate = useNavigate();

    const [credentials, setCredentials] = useState({
        email: localStorage.getItem(REMEMBER_KEY) || "",
        password: "",
    });

    const [showPassword, setShowPassword] = useState(false);
    const [remember, setRemember] = useState(
        Boolean(localStorage.getItem(REMEMBER_KEY))
    );
    const [errorMsg, setErrorMsg] = useState("");

    const handleChange = (e) => {
        setCredentials({
            ...credentials,
            [e.target.name]: e.target.value,
        });
    };

    const handleLogin = async (e) => {
        e.preventDefault();
        setErrorMsg("");

        try {
            const response = await api.post("/api/auth/login", credentials);
            const token = response.data;

            localStorage.setItem("jwt_token", token);

            if (remember) {
                localStorage.setItem(REMEMBER_KEY, credentials.email);
            } else {
                localStorage.removeItem(REMEMBER_KEY);
            }

            const payloadBase64 = token.split(".")[1];
            const decodedPayload = JSON.parse(atob(payloadBase64));

            const userRole =
                decodedPayload.role || decodedPayload.authorities;

            if (userRole === "ADMIN" || userRole === "ROLE_ADMIN") {
                navigate("/admin");
            } else if (
                userRole === "RESTAURANT_OWNER" ||
                userRole === "ROLE_RESTAURANT_OWNER"
            ) {
                navigate("/dashboard");
            } else {
                navigate("/history");
            }
        } catch (error) {
            console.error(error);
            setErrorMsg("Invalid email or password.");
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
                    <h1 style={AUTH_STYLES.heading}>Welcome back</h1>
                    <p style={AUTH_STYLES.subheading}>
                        Sign in to continue to the back office
                    </p>
                </div>

                <form onSubmit={handleLogin}>
                    <div style={AUTH_STYLES.fieldWrap}>
                        <span style={AUTH_STYLES.fieldIcon}>
                            <MailIcon />
                        </span>
                        <input
                            type="email"
                            name="email"
                            placeholder="Email address"
                            value={credentials.email}
                            onChange={handleChange}
                            required
                            style={AUTH_STYLES.input}
                            onFocus={(e) => applyAuthFocusStyle(e.target)}
                            onBlur={(e) => removeAuthFocusStyle(e.target)}
                        />
                    </div>

                    <div style={{ ...AUTH_STYLES.fieldWrap, marginBottom: 12 }}>
                        <span style={AUTH_STYLES.fieldIcon}>
                            <LockIcon />
                        </span>
                        <input
                            type={showPassword ? "text" : "password"}
                            name="password"
                            placeholder="Password"
                            value={credentials.password}
                            onChange={handleChange}
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

                    {errorMsg && <p style={AUTH_STYLES.error}>{errorMsg}</p>}

                    <div style={rowStyle}>
                        <button
                            type="button"
                            onClick={() => setRemember((v) => !v)}
                            style={rememberButtonStyle}
                        >
                            <span
                                style={{
                                    ...checkboxStyle,
                                    borderColor: remember
                                        ? COLORS.accent
                                        : COLORS.border,
                                    background: remember
                                        ? COLORS.accent
                                        : "transparent",
                                }}
                            >
                                {remember && <CheckIcon />}
                            </span>
                            <span style={rememberLabelStyle}>
                                Remember me
                            </span>
                        </button>

                        <a
                            href="#"
                            onClick={(e) => e.preventDefault()}
                            style={forgotLinkStyle}
                        >
                            Forgot password?
                        </a>
                    </div>

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
                        Sign In
                    </button>
                </form>

                <div style={AUTH_STYLES.footer}>
                    <p style={AUTH_STYLES.footerText}>
                        Don't have an account?
                    </p>
                    <button
                        onClick={() => navigate("/register")}
                        style={createAccountStyle}
                    >
                        Create Account
                    </button>
                </div>
            </div>
        </div>
    );
}

const rowStyle = {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 22,
    marginTop: 4,
};

const rememberButtonStyle = {
    display: "flex",
    alignItems: "center",
    gap: 8,
    background: "none",
    border: "none",
    padding: 0,
    cursor: "pointer",
};

const checkboxStyle = {
    width: 18,
    height: 18,
    borderRadius: 5,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    border: "1.5px solid #D8CFC0",
    transition: "background .15s ease, border-color .15s ease",
};

const rememberLabelStyle = {
    fontSize: 13.5,
    color: COLORS.textFooter,
};

const forgotLinkStyle = {
    fontSize: 13.5,
    fontWeight: 500,
    color: COLORS.textSecondary,
    textDecoration: "none",
};

const createAccountStyle = {
    background: "none",
    border: "none",
    color: COLORS.accent,
    fontWeight: 600,
    fontSize: 14,
    cursor: "pointer",
    fontFamily: "inherit",
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

function CheckIcon() {
    return (
        <svg
            width="12"
            height="12"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#fff"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <path d="M4 12l6 6L20 6" />
        </svg>
    );
}
