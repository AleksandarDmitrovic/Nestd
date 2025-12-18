import { createFileRoute } from "@tanstack/react-router";
import { addUser } from "../api/users";
import { registerSnaptradeUser } from "../api/snaptrade";

export const Route = createFileRoute("/setup")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <>
      <p>Add user to mongoDB user info values must be added in client env</p>
      <button onClick={addUser}>Add User</button>
      <p>Register user with Snaptrade</p>
      <button
        onClick={() =>
          registerSnaptradeUser(import.meta.env.VITE_PARTNER_SNAPTRADE_USER_ID)
        }
      >
        Register User with Snaptrade
      </button>
    </>
  );
}
