import styles from "./Dashboard.module.css";
import MenuIcon from "@mui/icons-material/Menu";

const Dashboard = () => {
  return (
    <>
      <header className={styles.header}>
        <h1 className={styles.title}>Nestd</h1>
        <MenuIcon fontSize="large" />
      </header>
    </>
  );
};

export default Dashboard;
