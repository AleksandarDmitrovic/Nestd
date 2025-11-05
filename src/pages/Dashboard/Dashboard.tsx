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
        <div className={styles.total_container}>
          <span className={styles.total_title}>Projected Value at 65</span>
          <span className={styles.total_value}>$1,200,000</span>
          <span className={styles.total_subtitle}>
            In today's dollars: $892K
          </span>
        </div>
        <div className={styles.chart_container}>
          <span className={styles.total_title}>Growth Chart</span>
        </div>
        <button className={styles.button}>Set Retirement Goal</button>
      </main>
    </>
  );
};

export default Dashboard;
