import { createRootRoute, Link, Outlet } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import styles from "./root.module.css";
import { UserSettingsProvider } from "../providers.tsx/UserSettingsProvider";
import ThemeProvider from "../providers.tsx/ThemeProvider";
import MobileNav from "../components/MobileNav/MobileNav";
import theme from "../theme";
import useMediaQuery from "@mui/material/useMediaQuery";

// Create a client
const queryClient = new QueryClient();

const RootLayout = () => {
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));
  console.log("isSmallScreen :", isSmallScreen);

  return (
    <>
      <ThemeProvider>
        <div className="p-2 flex gap-2">
          <header className={styles.header}>
            <nav
              style={{
                justifyContent: isSmallScreen
                  ? "space-between"
                  : "space-around",
              }}
            >
              <Link to="/">
                <h1 className={styles.title}>Nestd</h1>
              </Link>
              {isSmallScreen ? (
                <MobileNav />
              ) : (
                <>
                  <Link to="/" className="[&.active]:font-bold">
                    Home
                  </Link>
                  <Link to="/accounts" className="[&.active]:font-bold">
                    Accounts
                  </Link>
                  <Link to="/goals" className="[&.active]:font-bold">
                    Goals
                  </Link>
                  <Link to="/settings" className="[&.active]:font-bold">
                    Settings
                  </Link>
                </>
              )}
            </nav>
          </header>
        </div>
        <hr style={{ width: "100vw" }} />
        <UserSettingsProvider>
          <QueryClientProvider client={queryClient}>
            <Outlet />
          </QueryClientProvider>
        </UserSettingsProvider>
        <TanStackRouterDevtools />
      </ThemeProvider>
    </>
  );
};

export const Route = createRootRoute({ component: RootLayout });
