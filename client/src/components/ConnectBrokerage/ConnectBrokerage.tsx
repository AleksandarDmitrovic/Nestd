import Button from "@mui/material/Button";
import { useState } from "react";
import { SnapTradeReact } from "snapTrade-react";

type ConnectBrokerageProps = {
  invalidateCache: () => void;
};

const ConnectBrokerage: React.FC<ConnectBrokerageProps> = ({
  invalidateCache,
}) => {
  const [open, setOpen] = useState(false);
  const [redirectLink, setRedirectLink] = useState(null);

  const connectionProcess = async () => {
    // call "https://api.snapTrade.com/api/v1/snapTrade/login" to  generate a redirect link
    const response = await fetch("http://localhost:8080/api/snapTrade/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId: import.meta.env.VITE_SNAPTRADE_USER_ID }),
    });

    console.log("response :", response);

    const data = await response.json();
    console.log("data :", data);
    const link = data.redirectURI;

    // update the state with the generated link
    await setRedirectLink(link);

    // update the "open" state to show the modal
    setOpen(true);
  };
  return (
    <>
      {/* your Connect button */}
      <Button
        variant="contained"
        onClick={connectionProcess}
        sx={{ width: "inherit" }}
      >
        ✚ Connect Brokerage Account
      </Button>

      {redirectLink && (
        <SnapTradeReact
          loginLink={redirectLink}
          isOpen={open}
          close={() => {
            setOpen(false);
            invalidateCache();
          }}
        />
      )}
    </>
  );
};

export default ConnectBrokerage;
