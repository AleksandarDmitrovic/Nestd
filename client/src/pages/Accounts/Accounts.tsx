import { listSnaptradeAccounts } from "../../api/snaptrade";
import styles from "./Accounts.module.css";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
import ConnectBrokerage from "../../components/ConnectBrokerage/ConnectBrokerage";

const Accounts = () => {
  const queryClient = useQueryClient();

  const { isPending, error, data } = useQuery({
    queryKey: ["snapTrade"],
    queryFn: () => listSnaptradeAccounts(),
  });

  if (isPending) return "Loading...";

  if (error) return "An error has occurred: " + error.message;

  console.log("data :", data);

  const invalidateCacheAccountData = () => {
    console.log("Invalidating snapTrade account data cache");
    queryClient.invalidateQueries({ queryKey: ["snapTrade"] });
  };

  return (
    <main>
      {data?.map((account: any) => (
        <div key={account.id} className={styles.total_container}>
          <Grid display="flex" flexDirection="column" gap={1}>
            <Typography
              display="flex"
              alignSelf="center"
              variant="h3"
              color="textSecondary"
            >
              {account?.institution_name}
            </Typography>
            <span className={styles.total_subtitle}>
              Sync Status:
              {account.sync_status.holdings.initial_sync_completed
                ? " ✅"
                : " ❌"}
            </span>
          </Grid>
          <span className={styles.total_value}>
            {account.balance?.total?.amount.toFixed(2)}{" "}
            {account.balance?.total?.currency}
          </span>
        </div>
      ))}
      <br />

      <ConnectBrokerage invalidateCache={invalidateCacheAccountData} />
    </main>
  );
};

export default Accounts;
