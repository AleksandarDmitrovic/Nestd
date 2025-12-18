import { createFileRoute } from "@tanstack/react-router";
import Accounts from "../pages/Accounts/Accounts";

export const Route = createFileRoute("/accounts")({
  component: RouteComponent,
});

function RouteComponent() {
  return <Accounts />;
}
