// theme.ts
export const theme = {
  name: "lunra",
  brand: {
    primary: "#4C6EF5",
    primaryLight: "#9BA7FF",
    primaryDark: "#2B3BB1",
    primaryAlt: "#7B61FF",
    gradient: "linear-gradient(135deg,#4C6EF5 0%,#E76DD7 50%,#FF9A56 100%)"
  },
  neon: {
    pink: "#FF2D95",
    purple: "#8A2BE2",
    blue: "#00D4FF",
    cyan: "#00FFC6",
    orange: "#FF7A00"
  },
  primaries: {
    red: "#E63946",
    green: "#2EC4B6",
    blue: "#0077FF",
    yellow: "#FFCB47"
  },
  semantic: {
    success: "#2EC47A",
    info: "#4C6EF5",
    warning: "#FFB020",
    error: "#E63946"
  },
  neutral: {
    bg: "#FFFFFF",
    surface: "#F6F8FA",
    surfaceAlt: "#FFFFFF",
    muted: "#F0F3F7",
    border: "#E6E9EE",
    shadow: "rgba(28, 30, 33, 0.08)"
  },
  dark: {
    bg: "#0F1720",
    surface: "#111827",
    surfaceAlt: "#0B1220",
    muted: "#1F2937",
    border: "#222831",
    shadow: "rgba(0,0,0,0.6)"
  },
  text: {
    primary: "#0B1220",
    secondary: "#4B5563",
    muted: "#6B7280",
    onPrimary: "#FFFFFF",
    onNeon: "#0B1220",
    darkPrimary: "#E5E7EB"
  }
};

export type ThemeType = typeof theme;
