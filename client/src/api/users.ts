export const addUser = async () => {
  try {
    const response = await fetch("http://localhost:8080/api/addUser", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: import.meta.env.VITE_ADD_USER_EMAIL,
        firstName: import.meta.env.VITE_ADD_USER_FIRST_NAME,
        lastName: import.meta.env.VITE_ADD_USER_LAST_NAME,
      }),
    });

    console.log("User added:", response);
  } catch (error) {
    console.error("Error adding user:", error);
  }
};
