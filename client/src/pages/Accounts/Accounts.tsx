import Button from "@mui/material/Button";
import { listSnaptradeAccounts } from "../../api/snaptrade";
import styles from "./Accounts.module.css";
import { useQuery } from "@tanstack/react-query";

const Accounts = () => {
  const { isPending, error, data } = useQuery({
    queryKey: ["snapTrade"],
    queryFn: () => listSnaptradeAccounts(),
  });

  if (isPending) return "Loading...";

  if (error) return "An error has occurred: " + error.message;

  console.log("data :", data);
  const totalBalance = data?.reduce(
    (total: number, account: { balance: { total: { amount: number } } }) => {
      const amount = total + account.balance?.total?.amount || 0;
      return parseFloat(amount.toFixed(2));
    },
    0
  );

  const currencyDenomination =
    data?.length > 0 ? data[0].balance?.total?.currency : "";

  return (
    <main>
      <div className={styles.total_container}>
        <span className={styles.total_title}>Total Retirement Savings</span>
        <span className={styles.total_value}>
          {totalBalance} {currencyDenomination}
        </span>
        <span className={styles.total_subtitle}>Combined family accounts</span>
      </div>

      <Button variant="contained" className={styles.button}>
        Set Retirement Goal
      </Button>
    </main>
  );
};

export default Accounts;
