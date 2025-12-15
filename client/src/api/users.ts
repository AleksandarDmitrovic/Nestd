export const addUser = async () => {
  try {
    const response = await fetch("http://localhost:8080/api/users", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: "aleksandar.dmitrovic@gmail.com",
        firstName: "Aleksandar",
        lastName: "Dmitrovic",
      }),
    });

    console.log("User added:", response);
  } catch (error) {
    console.error("Error adding user:", error);
  }
};
