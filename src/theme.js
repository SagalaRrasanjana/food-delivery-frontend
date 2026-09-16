// Shared "Ember & Oak" design tokens, used across page components.
export const BRAND = "Ember & Oak";

export const COLORS = {
    pageBg: "#F6F1EA",
    surface: "#FFFFFF",
    surfaceMuted: "#FBF8F4",
    surfaceSunken: "#F1EAE0",

    border: "#E6DED2",
    borderSoft: "rgba(40,28,20,0.06)",

    textPrimary: "#241F1A",
    textSecondary: "#8A8074",
    textMuted: "#A69C8D",
    textFooter: "#5C5346",

    accent: "#B75B3D",
    accentSoft: "rgba(183,91,61,0.08)",
    accentBorder: "rgba(183,91,61,0.25)",

    info: "#4C6FA5",
    infoSoft: "rgba(76,111,165,0.08)",
    infoBorder: "rgba(76,111,165,0.25)",

    success: "#3F5E45",
    successSoft: "rgba(63,94,69,0.08)",
    successBorder: "rgba(63,94,69,0.25)",

    danger: "#C0392B",
    dangerSoft: "rgba(192,57,43,0.08)",
    dangerBorder: "rgba(192,57,43,0.25)",
};

export const RADIUS = { sm: 8, md: 10, lg: 16, xl: 20 };

export const SHADOW_CARD =
    "0 1px 2px rgba(40,28,20,0.04), 0 24px 48px -16px rgba(40,28,20,0.16)";

export const FONT_FAMILY =
    "'Inter', system-ui, -apple-system, 'Segoe UI', sans-serif";

// Shared style objects for the auth pages (Login/Register) so the two
// forms can't drift apart visually.
export const AUTH_STYLES = {
    page: {
        width: "100%",
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: COLORS.pageBg,
        padding: 32,
        fontFamily: FONT_FAMILY,
    },
    card: {
        width: "100%",
        maxWidth: 400,
        background: COLORS.surface,
        borderRadius: RADIUS.lg,
        padding: "40px 36px",
        boxShadow: SHADOW_CARD,
        border: `1px solid ${COLORS.borderSoft}`,
    },
    logoWrap: {
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 10,
        marginBottom: 28,
    },
    logoMark: {
        width: 40,
        height: 40,
        borderRadius: 11,
        background: COLORS.accent,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexShrink: 0,
    },
    logoName: {
        fontSize: 13,
        fontWeight: 600,
        letterSpacing: "0.08em",
        color: COLORS.textSecondary,
        textTransform: "uppercase",
    },
    heading: {
        margin: 0,
        fontSize: 22,
        fontWeight: 700,
        color: COLORS.textPrimary,
        letterSpacing: "-0.01em",
    },
    subheading: {
        margin: "6px 0 0",
        fontSize: 14,
        color: COLORS.textSecondary,
    },
    fieldWrap: {
        position: "relative",
        marginBottom: 14,
    },
    fieldIcon: {
        position: "absolute",
        left: 14,
        top: "50%",
        transform: "translateY(-50%)",
        display: "flex",
        color: COLORS.textMuted,
        pointerEvents: "none",
    },
    input: {
        width: "100%",
        padding: "13px 14px 13px 42px",
        border: `1px solid ${COLORS.border}`,
        borderRadius: RADIUS.md,
        background: COLORS.surfaceMuted,
        fontSize: 14.5,
        color: COLORS.textPrimary,
        fontFamily: "inherit",
        outline: "none",
        transition:
            "border-color .15s ease, box-shadow .15s ease, background .15s ease",
    },
    eyeButton: {
        position: "absolute",
        right: 10,
        top: "50%",
        transform: "translateY(-50%)",
        width: 28,
        height: 28,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "none",
        border: "none",
        cursor: "pointer",
        color: COLORS.textMuted,
        padding: 0,
    },
    error: {
        color: COLORS.danger,
        textAlign: "center",
        fontWeight: 600,
        fontSize: 13.5,
        margin: "0 0 14px",
    },
    success: {
        color: COLORS.success,
        textAlign: "center",
        fontWeight: 600,
        fontSize: 13.5,
        margin: "0 0 14px",
    },
    submitButton: {
        width: "100%",
        padding: 14,
        border: "none",
        borderRadius: RADIUS.md,
        background: COLORS.accent,
        color: "#fff",
        fontSize: 15,
        fontWeight: 600,
        cursor: "pointer",
        fontFamily: "inherit",
        boxShadow: `0 10px 20px -8px ${COLORS.accent}8c`,
        transition: "filter .15s ease",
    },
    footer: {
        marginTop: 24,
        textAlign: "center",
    },
    footerText: {
        color: COLORS.textSecondary,
        fontSize: 13.5,
        marginBottom: 6,
    },
};

export function applyAuthFocusStyle(el) {
    el.style.borderColor = COLORS.accent;
    el.style.background = COLORS.surface;
    el.style.boxShadow = `0 0 0 4px ${COLORS.accent}29`;
}

export function removeAuthFocusStyle(el) {
    el.style.borderColor = COLORS.border;
    el.style.background = COLORS.surfaceMuted;
    el.style.boxShadow = "none";
}
