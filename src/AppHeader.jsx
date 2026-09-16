import { COLORS, RADIUS, FONT_FAMILY } from './theme';

export default function AppHeader({ title, subtitle, actionLabel, onAction }) {
    return (
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "40px", borderBottom: `1px solid ${COLORS.border}`, paddingBottom: "20px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                <div style={{ width: 40, height: 40, borderRadius: 11, background: COLORS.accent, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                    <FlameIcon />
                </div>
                <div>
                    <h1 style={{ margin: 0, fontSize: "28px", fontWeight: "800", color: COLORS.textPrimary, fontFamily: FONT_FAMILY }}>{title}</h1>
                    {subtitle && (
                        <p style={{ color: COLORS.accent, margin: "4px 0 0 0", fontWeight: "600", fontSize: "13px", letterSpacing: "0.04em" }}>{subtitle}</p>
                    )}
                </div>
            </div>
            {actionLabel && (
                <button
                    onClick={onAction}
                    style={{ backgroundColor: COLORS.surface, border: `1px solid ${COLORS.border}`, color: COLORS.textPrimary, padding: "10px 20px", borderRadius: RADIUS.sm, cursor: "pointer", fontWeight: "600", fontFamily: FONT_FAMILY }}
                >
                    {actionLabel}
                </button>
            )}
        </div>
    );
}

function FlameIcon() {
    return (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 21a7 7 0 0 0 7-7c0-3-2-5-3.5-7.5C14.5 8 13 9 13 10.5c0-2-1-3.5-2-5C9 8 7 10 7 14a7 7 0 0 0 5 7z" />
        </svg>
    );
}
