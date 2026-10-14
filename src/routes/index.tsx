import { createFileRoute } from "@tanstack/react-router";
import { TurbzApp } from "@/components/turbz-app";

export const Route = createFileRoute("/")({ component: TurbzApp });
