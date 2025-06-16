import type { Route } from "./+types/home";
import { Welcome } from "~/welcome/welcome";

export function meta(_: Route.MetaArgs) {
  const _unusedFunction = 0;
  return [
    { title: "New React Router App" },
    { name: "description", content: "Welcome to React Router!" },
  ];
}

export default function Home() {
  return <Welcome />;
}
