import logo from '../assets/logo.png';

export interface Brand {
  primary: string;
  primaryLight: string;
  primaryDark: string;
  primaryAlt: string;
  gradient: string;
  gradientText: string;
  gradientLowOpacity: string;
  logo: string;
}

export interface Neon {
  pink: string;
  purple: string;
  blue: string;
  cyan: string;
  orange: string;
}

export interface Primaries {
  red: string;
  green: string;
  blue: string;
  yellow: string;
}

export interface Semantic {
  success: string;
  info: string;
  warning: string;
  error: string;
}

export interface Neutral {
  bg: string;
  surface: string;
  surfaceAlt: string;
  muted: string;
  border: string;
  shadow: string;
}

export interface Dark {
  bg: string;
  surface: string;
  surfaceAlt: string;
  muted: string;
  border: string;
  shadow: string;
}

export interface Text {
  primary: string;
  secondary: string;
  muted: string;
  onPrimary: string;
  onNeon: string;
  darkPrimary: string;
}

export interface ThemeInterface {
  name: string;
  brand: Brand;
  neon: Neon;
  primaries: Primaries;
  semantic: Semantic;
  neutral: Neutral;
  dark: Dark;
  text: Text;
  type: string;
}

// Agora definimos o theme usando a interface
export const theme: ThemeInterface = {
  name: "lunra",
  brand: {
    primary: "#4C6EF5",
    primaryLight: "#9BA7FF",
    primaryDark: "#2B3BB1",
    primaryAlt: "#7B61FF",
    gradient: "linear-gradient(135deg,#4C6EF5 0%,#E76DD7 50%,#FF9A56 100%)",
    gradientText: "linear-gradient(135deg, #4C6EF5, #7B61FF)",
    gradientLowOpacity: "linear-gradient(135deg, rgba(76, 110, 245, 0.07), rgba(123, 97, 255, 0.1))",
    logo: logo
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
  },
  type: ""
};
