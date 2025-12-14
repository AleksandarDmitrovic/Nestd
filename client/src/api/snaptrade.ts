export const registerSnaptradeUser = async () => {
  try {
    const response = await fetch(
      "http://localhost:8080/api/snapTrade/registerUser",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: import.meta.env.VITE_SNAPTRADE_USER_ID || "test-user-id",
        }),
      }
    );

    const data = await response.json();
    console.log("Snaptrade user registered:", data);
  } catch (error) {
    console.error("Error registering Snaptrade user:", error);
  }
};
