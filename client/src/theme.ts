import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    primary: {
      main: "#11b981",
      light: "#4ecca3",
      dark: "#0d8f66",
      contrastText: "#ffffff",
    },
    secondary: {
      main: "#6366f1",
      light: "#9ca3ff",
      dark: "#4a4dc0",
      contrastText: "#ffffff",
    },
    background: {
      default: "#242424", // Main app background
      paper: "#ffffff", // Card/Paper component background
    },
    text: {
      primary: "#ffffff", // Primary text color
      secondary: "#b0b0b0", // Secondary text color
    },
  },
  typography: {
    fontFamily: [
      "-apple-system",
      "BlinkMacSystemFont",
      '"Segoe UI"',
      "Roboto",
      '"Helvetica Neue"',
      "Arial",
      "sans-serif",
    ].join(","),
  },
  shape: {
    borderRadius: 8,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: "none",
          fontWeight: 700,
          fontSize: "1.5rem",
        },
      },
    },
  },
});

export default theme;
