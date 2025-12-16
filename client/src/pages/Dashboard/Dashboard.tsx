import Button from "@mui/material/Button";
import { listSnaptradeAccounts } from "../../api/snaptrade";
import { calculateInvestmentValue } from "../../helpers/retirementCalaculators";
import { useUserSettings } from "../../providers.tsx/UserSettingsProvider";
import styles from "./Dashboard.module.css";
import { useQuery } from "@tanstack/react-query";

const Dashboard = () => {
  const { isPending, error, data } = useQuery({
    queryKey: ["snapTrade"],
    queryFn: () => listSnaptradeAccounts(),
  });

  const { settings } = useUserSettings();
  const { currentAge, retirementAge, returnRate, inflationRate } = settings;

  if (isPending) return "Loading...";

  if (error) return "An error has occurred: " + error.message;

  const totalBalance = data?.reduce(
    (total: number, account: { balance: { total: { amount: number } } }) => {
      const amount = total + account.balance?.total?.amount || 0;
      return parseFloat(amount.toFixed(2));
    },
    0
  );

  const currencyDenomination =
    data?.length > 0 ? data[0].balance?.total?.currency : "";

  const retirementValueObject = calculateInvestmentValue(
    totalBalance,
    currentAge,
    retirementAge,
    returnRate,
    inflationRate
  );

  return (
    <main>
      <div className={styles.total_container}>
        <span className={styles.total_title}>Total Retirement Savings</span>
        <span className={styles.total_value}>
          {totalBalance} {currencyDenomination}
        </span>
        <span className={styles.total_subtitle}>Combined family accounts</span>
      </div>
      <div className={styles.total_container}>
        <span className={styles.total_title}>
          Projected Value at {settings.retirementAge} (
          {retirementValueObject.yearsOfInvestment} years of investment)
        </span>
        <span className={styles.total_value}>
          {retirementValueObject.futureValue} {currencyDenomination}
        </span>
        {settings.showValueInTodaysDollars && (
          <span className={styles.total_subtitle}>
            In today's dollars: {retirementValueObject.valueInTodaysDollars}{" "}
            {currencyDenomination}
          </span>
        )}
      </div>
      {/* <div className={styles.chart_container}>
        <span className={styles.total_title}>Growth Chart</span>
      </div> */}
      <Button variant="contained" className={styles.button}>
        Set Retirement Goal
      </Button>
    </main>
  );
};

export default Dashboard;
