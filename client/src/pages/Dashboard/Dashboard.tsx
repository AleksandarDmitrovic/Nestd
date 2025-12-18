import { useTheme } from "@mui/material/styles";
import { listSnaptradeAccounts } from "../../api/snaptrade";

import { useUserSettings } from "../../providers.tsx/UserSettingsProvider";
import styles from "./Dashboard.module.css";
import { useQuery } from "@tanstack/react-query";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Line } from "react-chartjs-2";
import {
  calculateInvestmentValue,
  calculateInvestmentValueDetailed,
} from "../../helpers/retirementCalculators";
import useMediaQuery from "@mui/material/useMediaQuery";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const Dashboard = () => {
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));

  const userId = import.meta.env.VITE_SNAPTRADE_USER_ID;
  const { isPending, error, data } = useQuery({
    queryKey: ["snapTrade", userId],
    queryFn: () => listSnaptradeAccounts(userId),
  });

  const partnerUserId = import.meta.env.VITE_PARTNER_SNAPTRADE_USER_ID;
  const {
    isPending: partnerIsPending,
    error: partnerError,
    data: partnerData,
  } = useQuery({
    queryKey: ["snapTrade", partnerUserId],
    queryFn: () => listSnaptradeAccounts(partnerUserId),
  });

  const { settings } = useUserSettings();
  const { currentAge, retirementAge, returnRate, inflationRate } = settings;

  if (isPending || partnerIsPending) return "Loading...";

  if (error || partnerError)
    return "An error has occurred: " + error?.message || partnerError?.message;

  const combinedData = data.concat(partnerData);

  const totalBalance = combinedData?.reduce(
    (total: number, account: { balance: { total: { amount: number } } }) => {
      const amount = total + account.balance?.total?.amount || 0;
      return parseFloat(amount.toFixed(2));
    },
    0
  );

  const currencyDenomination =
    partnerData?.length > 0 ? partnerData[0].balance?.total?.currency : "CAD";

  const retirementValueObject = calculateInvestmentValue(
    totalBalance,
    currentAge,
    retirementAge,
    returnRate,
    inflationRate
  );
  const retirementChartData = calculateInvestmentValueDetailed(
    totalBalance,
    currentAge,
    retirementAge,
    returnRate,
    inflationRate
  ).yearlyBreakdown;

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "top" as const,
      },
      title: {
        display: true,
        text: "Retirement Projections",
      },
    },
    scales: {
      x: {
        grid: {
          color: theme.palette.background.paper,
          lineWidth: 0.3, // Optional: line thickness
        },
        title: {
          display: true,
          text: "Age",
        },
      },
      y: {
        grid: {
          color: theme.palette.background.paper,
          lineWidth: 0.3, // Optional: line thickness
        },
        title: {
          display: true,
          text: "Projected Value",
        },
      },
    },
  };

  const labels = retirementChartData.map((row) => row.age);

  const chartData = {
    labels,
    datasets: [
      {
        label: "Projected Value",
        data: retirementChartData.map((row) => row.futureValue),
        borderColor: theme.palette.primary.main,
        backgroundColor: theme.palette.primary.main,
      },
      {
        label: "Value in Today's Dollars",
        data: retirementChartData.map((row) => row.valueInTodaysDollars),
        borderColor: theme.palette.secondary.main,
        backgroundColor: theme.palette.secondary.main,
      },
    ],
  };

  if (settings.showValueInTodaysDollars === false) {
    chartData.datasets.pop();
  }

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
      {!isSmallScreen && <Line options={options} data={chartData} />}
    </main>
  );
};

export default Dashboard;
