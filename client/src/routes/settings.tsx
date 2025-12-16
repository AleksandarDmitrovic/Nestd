import { createFileRoute } from "@tanstack/react-router";
import Settings from "../pages/Settings.tsx/Settings";

export const Route = createFileRoute("/settings")({
  component: RouteComponent,
});

function RouteComponent() {
  return <Settings />;
}
