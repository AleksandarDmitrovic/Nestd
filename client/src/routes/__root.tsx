import { createRootRoute, Link, Outlet } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import MenuIcon from "@mui/icons-material/Menu";
import styles from "./root.module.css";

// Create a client
const queryClient = new QueryClient();

const RootLayout = () => (
  <>
    <div className="p-2 flex gap-2">
      <header className={styles.header}>
        <h1 className={styles.title}>Nestd</h1>
        <Link to="/" className="[&.active]:font-bold">
          Home
        </Link>{" "}
        <Link to="/about" className="[&.active]:font-bold">
          About
        </Link>
        <MenuIcon fontSize="large" />
      </header>
    </div>
    <hr style={{ width: "100vw" }} />
    <QueryClientProvider client={queryClient}>
      <Outlet />
    </QueryClientProvider>
    <TanStackRouterDevtools />
  </>
);

export const Route = createRootRoute({ component: RootLayout });
