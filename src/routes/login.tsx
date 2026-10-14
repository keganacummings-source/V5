import { createFileRoute } from "@tanstack/react-router";
import { ApiGate } from "@/components/turbz-app";

export const Route = createFileRoute("/login")({ component: Login });

function Login() {
  return <ApiGate />;
}
