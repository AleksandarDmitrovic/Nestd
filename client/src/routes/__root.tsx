import { createRootRoute, Link, Outlet } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import MenuIcon from "@mui/icons-material/Menu";
import styles from "./root.module.css";
import { UserSettingsProvider } from "../providers.tsx/UserSettingsProvider";
import ThemeProvider from "../providers.tsx/ThemeProvider";

// Create a client
const queryClient = new QueryClient();

const RootLayout = () => (
  <>
    <ThemeProvider>
      <div className="p-2 flex gap-2">
        <header className={styles.header}>
          <h1 className={styles.title}>Nestd</h1>
          <Link to="/" className="[&.active]:font-bold">
            Home
          </Link>{" "}
          <Link to="/accounts" className="[&.active]:font-bold">
            Accounts
          </Link>
          <Link to="/settings" className="[&.active]:font-bold">
            Settings
          </Link>
          <MenuIcon
            className={styles.menuIcon}
            fontSize="large"
            color="primary"
          />
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

export const Route = createRootRoute({ component: RootLayout });
