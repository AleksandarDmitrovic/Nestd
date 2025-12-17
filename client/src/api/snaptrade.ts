export const registerSnaptradeUser = async (userId: string) => {
  try {
    const response = await fetch(
      "http://localhost:8080/api/snapTrade/registerUser",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: userId || "test-user-id",
        }),
      }
    );

    const data = await response.json();
    console.log("Snaptrade user registered:", data);
  } catch (error) {
    console.error("Error registering Snaptrade user:", error);
  }
};

export const listSnaptradeAccounts = async (userId: string) => {
  try {
    const response = await fetch(
      `http://localhost:8080/api/snapTrade/accounts/${userId}`,
      {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      }
    );

    const data = await response.json();
    console.log("Snaptrade accounts fetched:", data);
    return data;
  } catch (error) {
    console.error("Error fetching Snaptrade accounts:", error);
  }
};
