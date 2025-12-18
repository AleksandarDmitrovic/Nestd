import { createFileRoute } from "@tanstack/react-router";
import RetirementGoalCalculator from "../pages/RetirementCalculator/RetirementGoalCalculator";

export const Route = createFileRoute("/goals")({
  component: RouteComponent,
});

function RouteComponent() {
  return <RetirementGoalCalculator />;
}
