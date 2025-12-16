import { listSnaptradeAccounts } from "../../api/snaptrade";
import { useUserSettings } from "../../providers.tsx/UserSettingsProvider";
import styles from "./Dashboard.module.css";
import { useQuery } from "@tanstack/react-query";

const Dashboard = () => {
  const { settings, updateSettings, resetSettings } = useUserSettings();
  console.log("settings :", settings);

  const { isPending, error, data } = useQuery({
    queryKey: ["snapTrade"],
    queryFn: () => listSnaptradeAccounts(),
  });
  console.log("data :", data);

  if (isPending) return "Loading...";

  if (error) return "An error has occurred: " + error.message;

  return (
    <main>
      <div className={styles.total_container}>
        <span className={styles.total_title}>Total Retirement Savings</span>
        <span className={styles.total_value}>
          {data.reduce(
            (
              total: number,
              account: { balance: { total: { amount: number } } }
            ) => {
              const amount = total + account.balance?.total?.amount || 0;
              return parseFloat(amount.toFixed(2));
            },
            0
          )}{" "}
          {data.length > 0 ? data[0].balance?.total?.currency : ""}
        </span>
        <span className={styles.total_subtitle}>Combined family accounts</span>
      </div>
      <div className={styles.total_container}>
        <span className={styles.total_title}>
          Projected Value at {settings.retirementAge}
        </span>
        <span className={styles.total_value}>$1,200,000</span>
        <span className={styles.total_subtitle}>In today's dollars: $892K</span>
      </div>
      {/* <div className={styles.chart_container}>
        <span className={styles.total_title}>Growth Chart</span>
      </div> */}
      <button className={styles.button}>Set Retirement Goal</button>
    </main>
  );
};

export default Dashboard;
