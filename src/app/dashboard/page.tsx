import { redirect } from "next/navigation";
import { WORKSPACES } from "@/lib/data";

export default function DashboardPage() {
  const firstWorkspace = WORKSPACES[0];
  redirect(`/dashboard/${firstWorkspace.id}`);
}
