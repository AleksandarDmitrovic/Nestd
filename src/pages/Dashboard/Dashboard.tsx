import styles from "./Dashboard.module.css";
import MenuIcon from "@mui/icons-material/Menu";

const Dashboard = () => {
  return (
    <>
      <header className={styles.header}>
        <h1 className={styles.title}>Nestd</h1>
        <MenuIcon fontSize="large" />
      </header>
      <main>
        <div className={styles.total_container}>
          <span className={styles.total_title}>Total Retirement Savings</span>
          <span className={styles.total_value}>$487,320</span>
          <span className={styles.total_subtitle}>
            Combined family accounts
          </span>
        </div>
      </main>
    </>
  );
};

export default Dashboard;
