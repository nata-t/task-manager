// This layout simply renders children — the parent /dashboard/layout.tsx
// already provides the full DashboardLayout shell.
export default function WorkspaceLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
