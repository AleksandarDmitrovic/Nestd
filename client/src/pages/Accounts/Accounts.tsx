/* eslint-disable @typescript-eslint/no-explicit-any */
import { listSnaptradeAccounts } from "../../api/snaptrade";
import styles from "./Accounts.module.css";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
import ConnectBrokerage from "../../components/ConnectBrokerage/ConnectBrokerage";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import { useState } from "react";
import Button from "@mui/material/Button";

const AccountsMatrix = {
  self: 0,
  partner: 1,
};

const Accounts = () => {
  const [value, setValue] = useState(0);
  const [snaptradeUserID, setSnaptradeUserID] = useState(
    import.meta.env.VITE_SNAPTRADE_USER_ID || ""
  );

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    if (newValue === 0) {
      setSnaptradeUserID(import.meta.env.VITE_SNAPTRADE_USER_ID);
    } else if (newValue === 1) {
      setSnaptradeUserID(import.meta.env.VITE_PARTNER_SNAPTRADE_USER_ID);
    }
    setValue(newValue);
  };
  const queryClient = useQueryClient();

  const { isPending, error, data } = useQuery({
    queryKey: ["snapTrade", snaptradeUserID],
    queryFn: () => listSnaptradeAccounts(snaptradeUserID),
  });

  if (isPending) return "Loading...";

  if (error || data.error)
    return "An error has occurred: " + data?.error || error?.message;

  const invalidateCacheAccountData = () => {
    // console.log("Invalidating snapTrade account data cache");
    queryClient.invalidateQueries({ queryKey: ["snapTrade"] });
  };

  return (
    <main>
      <Grid style={{ inlineSize: "60vw", color: "white" }}>
        <Tabs
          value={value}
          onChange={handleChange}
          aria-label="basic tabs example"
          variant="fullWidth"
          textColor="inherit"
        >
          <Tab label="Your Accounts" />
          <Tab label="Partner" />
        </Tabs>
        {data?.map((account: any) => (
          <div key={account.id} className={styles.total_container}>
            <Grid display="flex" flexDirection="column" gap={1}>
              <Typography
                display="flex"
                alignSelf="center"
                variant="h4"
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

        {value === AccountsMatrix.self ? (
          <ConnectBrokerage invalidateCache={invalidateCacheAccountData} />
        ) : (
          <Button variant="contained" fullWidth>
            Connect Partner Accounts
          </Button>
        )}
      </Grid>
    </main>
  );
};

export default Accounts;
