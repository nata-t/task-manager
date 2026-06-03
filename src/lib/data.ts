import type { Tables } from "@/types/database.types";

// ─── Extended types with UI helpers ───────────────────────────────────────────

export type WorkspaceWithMeta = Tables<"workspaces"> & {
  /** Two-letter initials shown in the rail avatar */
  initials: string;
  /** HSL colour used for the avatar background */
  color: string;
  /** Emoji icon for the workspace */
  emoji: string;
};

export type ProjectWithMeta = Tables<"projects"> & {
  /** Emoji icon for the project */
  icon: string;
  /** Short hex description colour */
  color: string;
  description: string;
};

export type TaskWithMeta = Tables<"tasks"> & {
  /** Assignee display name */
  assignee_name: string | null;
};

// ─── WORKSPACES ───────────────────────────────────────────────────────────────

export const WORKSPACES: WorkspaceWithMeta[] = [
  {
    id: "ws-1",
    name: "Kilet Design System",
    created_at: "2026-01-10T08:00:00Z",
    initials: "KD",
    color: "oklch(0.55 0.22 264)",
    emoji: "🎨",
  },
  {
    id: "ws-2",
    name: "Backend API Platform",
    created_at: "2026-01-15T09:30:00Z",
    initials: "BA",
    color: "oklch(0.55 0.22 160)",
    emoji: "⚙️",
  },
  {
    id: "ws-3",
    name: "Mobile Companion App",
    created_at: "2026-02-01T10:00:00Z",
    initials: "MC",
    color: "oklch(0.58 0.22 30)",
    emoji: "📱",
  },
];

// ─── PROJECTS ─────────────────────────────────────────────────────────────────

export const PROJECTS: ProjectWithMeta[] = [
  // Workspace 1 projects
  {
    id: "proj-1",
    workspace_id: "ws-1",
    name: "Component Library",
    created_at: "2026-01-12T08:00:00Z",
    icon: "🧩",
    color: "#818cf8",
    description: "Shared reusable UI components and tokens",
  },
  {
    id: "proj-2",
    workspace_id: "ws-1",
    name: "Documentation Site",
    created_at: "2026-01-14T08:00:00Z",
    icon: "📖",
    color: "#34d399",
    description: "Design system docs and Storybook",
  },
  {
    id: "proj-3",
    workspace_id: "ws-1",
    name: "Brand Refresh",
    created_at: "2026-01-20T08:00:00Z",
    icon: "✨",
    color: "#f472b6",
    description: "New logo, palette, and typography system",
  },
  // Workspace 2 projects
  {
    id: "proj-4",
    workspace_id: "ws-2",
    name: "Auth Service",
    created_at: "2026-01-16T09:30:00Z",
    icon: "🔐",
    color: "#38bdf8",
    description: "OAuth2, JWT, and session management",
  },
  {
    id: "proj-5",
    workspace_id: "ws-2",
    name: "Data Pipeline",
    created_at: "2026-01-18T09:30:00Z",
    icon: "🔀",
    color: "#fb923c",
    description: "ETL jobs and real-time data streaming",
  },
  {
    id: "proj-6",
    workspace_id: "ws-2",
    name: "API Gateway",
    created_at: "2026-02-04T09:30:00Z",
    icon: "🌐",
    color: "#a78bfa",
    description: "Rate limiting, routing, and analytics",
  },
  {
    id: "proj-7",
    workspace_id: "ws-2",
    name: "Monitoring & Alerts",
    created_at: "2026-02-10T09:30:00Z",
    icon: "📊",
    color: "#4ade80",
    description: "Observability dashboards and alerting",
  },
  // Workspace 3 projects
  {
    id: "proj-8",
    workspace_id: "ws-3",
    name: "iOS Client",
    created_at: "2026-02-02T10:00:00Z",
    icon: "🍎",
    color: "#f87171",
    description: "Swift / SwiftUI native iOS app",
  },
  {
    id: "proj-9",
    workspace_id: "ws-3",
    name: "Android Client",
    created_at: "2026-02-05T10:00:00Z",
    icon: "🤖",
    color: "#86efac",
    description: "Kotlin / Compose native Android app",
  },
  {
    id: "proj-10",
    workspace_id: "ws-3",
    name: "Push Notifications",
    created_at: "2026-02-12T10:00:00Z",
    icon: "🔔",
    color: "#fbbf24",
    description: "FCM / APNs notification infrastructure",
  },
];

// ─── TASKS ────────────────────────────────────────────────────────────────────

export const TASKS: TaskWithMeta[] = [
  // proj-1 – Component Library
  { id: "task-1",  project_id: "proj-1", title: "Set up Storybook 8",       status: "done",        description: "Install and configure Storybook with Vite builder",    assignee_id: "user-1", assignee_name: "Natnael T.",  due_date: "2026-02-01", created_at: "2026-01-12T08:00:00Z" },
  { id: "task-2",  project_id: "proj-1", title: "Button component variants",  status: "done",        description: "Primary, secondary, ghost, destructive, icon",         assignee_id: "user-2", assignee_name: "Sara M.",     due_date: "2026-02-05", created_at: "2026-01-13T08:00:00Z" },
  { id: "task-3",  project_id: "proj-1", title: "Form field atoms",          status: "in_progress", description: "Input, Textarea, Checkbox, Radio, Switch",              assignee_id: "user-1", assignee_name: "Natnael T.",  due_date: "2026-02-15", created_at: "2026-01-20T08:00:00Z" },
  { id: "task-4",  project_id: "proj-1", title: "Modal / Dialog system",     status: "in_progress", description: "Accessible dialog with animation and focus trap",       assignee_id: null,     assignee_name: null,          due_date: "2026-02-20", created_at: "2026-01-22T08:00:00Z" },
  { id: "task-5",  project_id: "proj-1", title: "Dark-mode token audit",     status: "todo",        description: "Ensure all colour tokens work in light & dark",         assignee_id: "user-3", assignee_name: "Liam K.",     due_date: "2026-03-01", created_at: "2026-01-25T08:00:00Z" },
  { id: "task-6",  project_id: "proj-1", title: "Data-table component",      status: "todo",        description: "Sortable, paginated table with column config",          assignee_id: "user-2", assignee_name: "Sara M.",     due_date: "2026-03-10", created_at: "2026-01-28T08:00:00Z" },

  // proj-2 – Documentation Site
  { id: "task-7",  project_id: "proj-2", title: "Scaffold Nextra site",      status: "done",        description: "Set up Nextra with custom theme",                       assignee_id: "user-2", assignee_name: "Sara M.",     due_date: "2026-02-08", created_at: "2026-01-14T08:00:00Z" },
  { id: "task-8",  project_id: "proj-2", title: "Write getting-started guide", status: "in_progress", description: "Install, peer deps, first component",                assignee_id: "user-1", assignee_name: "Natnael T.",  due_date: "2026-02-18", created_at: "2026-01-18T08:00:00Z" },
  { id: "task-9",  project_id: "proj-2", title: "Auto-generate API docs",    status: "todo",        description: "Use TypeDoc to pull JSDoc from source",                 assignee_id: null,     assignee_name: null,          due_date: "2026-03-05", created_at: "2026-01-22T08:00:00Z" },

  // proj-3 – Brand Refresh
  { id: "task-10", project_id: "proj-3", title: "Logo exploration (×12)",    status: "done",        description: "12 direction sketches from the art director",           assignee_id: "user-3", assignee_name: "Liam K.",     due_date: "2026-02-10", created_at: "2026-01-20T08:00:00Z" },
  { id: "task-11", project_id: "proj-3", title: "Colour palette selection",  status: "done",        description: "Finalise primary, accent, neutral ramps",               assignee_id: "user-3", assignee_name: "Liam K.",     due_date: "2026-02-12", created_at: "2026-01-21T08:00:00Z" },
  { id: "task-12", project_id: "proj-3", title: "Typography system",         status: "in_progress", description: "Select typefaces and define scale / spacing",           assignee_id: "user-2", assignee_name: "Sara M.",     due_date: "2026-02-25", created_at: "2026-01-25T08:00:00Z" },
  { id: "task-13", project_id: "proj-3", title: "Brand guidelines PDF",      status: "todo",        description: "Comprehensive usage guide for internal teams",          assignee_id: null,     assignee_name: null,          due_date: "2026-03-15", created_at: "2026-01-28T08:00:00Z" },

  // proj-4 – Auth Service
  { id: "task-14", project_id: "proj-4", title: "OAuth2 provider matrix",    status: "done",        description: "Google, GitHub, Apple — verified end-to-end",          assignee_id: "user-4", assignee_name: "Amina B.",    due_date: "2026-02-08", created_at: "2026-01-16T09:30:00Z" },
  { id: "task-15", project_id: "proj-4", title: "JWT refresh rotation",      status: "done",        description: "Silent refresh with sliding-window session",            assignee_id: "user-4", assignee_name: "Amina B.",    due_date: "2026-02-12", created_at: "2026-01-18T09:30:00Z" },
  { id: "task-16", project_id: "proj-4", title: "MFA (TOTP) integration",   status: "in_progress", description: "TOTP via Google Authenticator / Authy",                 assignee_id: "user-1", assignee_name: "Natnael T.",  due_date: "2026-02-28", created_at: "2026-01-22T09:30:00Z" },
  { id: "task-17", project_id: "proj-4", title: "Passkey / WebAuthn support", status: "todo",      description: "FIDO2 biometric login on supported devices",            assignee_id: null,     assignee_name: null,          due_date: "2026-03-20", created_at: "2026-01-25T09:30:00Z" },

  // proj-5 – Data Pipeline
  { id: "task-18", project_id: "proj-5", title: "Kafka topic design",        status: "done",        description: "Topic naming, partition count, retention policy",       assignee_id: "user-5", assignee_name: "Dawit A.",    due_date: "2026-02-10", created_at: "2026-01-18T09:30:00Z" },
  { id: "task-19", project_id: "proj-5", title: "Nightly ETL job",           status: "in_progress", description: "Extract from OLTP, transform, load into warehouse",    assignee_id: "user-5", assignee_name: "Dawit A.",    due_date: "2026-02-22", created_at: "2026-01-24T09:30:00Z" },
  { id: "task-20", project_id: "proj-5", title: "Dead-letter queue handling", status: "todo",       description: "Retry strategy and DLQ for failed messages",           assignee_id: null,     assignee_name: null,          due_date: "2026-03-08", created_at: "2026-01-28T09:30:00Z" },

  // proj-6 – API Gateway
  { id: "task-21", project_id: "proj-6", title: "Rate limiter middleware",   status: "done",        description: "Token bucket per user/IP with Redis backing",           assignee_id: "user-4", assignee_name: "Amina B.",    due_date: "2026-02-15", created_at: "2026-02-04T09:30:00Z" },
  { id: "task-22", project_id: "proj-6", title: "Route-level analytics",    status: "in_progress", description: "Latency, error-rate, throughput per endpoint",          assignee_id: "user-1", assignee_name: "Natnael T.",  due_date: "2026-03-01", created_at: "2026-02-06T09:30:00Z" },
  { id: "task-23", project_id: "proj-6", title: "GraphQL federation layer",  status: "todo",        description: "Combine subgraph schemas for the mobile clients",       assignee_id: null,     assignee_name: null,          due_date: "2026-03-18", created_at: "2026-02-08T09:30:00Z" },

  // proj-7 – Monitoring
  { id: "task-24", project_id: "proj-7", title: "Grafana dashboards",        status: "done",        description: "Infra + app layer dashboards with drill-down",         assignee_id: "user-5", assignee_name: "Dawit A.",    due_date: "2026-02-20", created_at: "2026-02-10T09:30:00Z" },
  { id: "task-25", project_id: "proj-7", title: "PagerDuty alert rules",     status: "in_progress", description: "SLO-based alerting with severity tiers",               assignee_id: "user-4", assignee_name: "Amina B.",    due_date: "2026-03-05", created_at: "2026-02-14T09:30:00Z" },
  { id: "task-26", project_id: "proj-7", title: "Anomaly detection model",   status: "todo",        description: "ML-based spike detection for request volume",          assignee_id: null,     assignee_name: null,          due_date: "2026-03-25", created_at: "2026-02-16T09:30:00Z" },

  // proj-8 – iOS Client
  { id: "task-27", project_id: "proj-8", title: "SwiftUI navigation setup",  status: "done",        description: "Tab bar + nested NavigationStack architecture",         assignee_id: "user-3", assignee_name: "Liam K.",     due_date: "2026-02-15", created_at: "2026-02-02T10:00:00Z" },
  { id: "task-28", project_id: "proj-8", title: "Offline cache with CoreData", status: "in_progress", description: "Write-through cache with sync strategy",            assignee_id: "user-3", assignee_name: "Liam K.",     due_date: "2026-03-02", created_at: "2026-02-08T10:00:00Z" },
  { id: "task-29", project_id: "proj-8", title: "App Store metadata",        status: "todo",        description: "Screenshots, description, keywords for ASO",           assignee_id: null,     assignee_name: null,          due_date: "2026-03-20", created_at: "2026-02-10T10:00:00Z" },

  // proj-9 – Android Client
  { id: "task-30", project_id: "proj-9", title: "Compose Navigation setup",  status: "done",        description: "Single-activity Compose with NavHost",                 assignee_id: "user-2", assignee_name: "Sara M.",     due_date: "2026-02-18", created_at: "2026-02-05T10:00:00Z" },
  { id: "task-31", project_id: "proj-9", title: "Room database schema",      status: "in_progress", description: "Local DB for offline task list and sync queue",         assignee_id: "user-2", assignee_name: "Sara M.",     due_date: "2026-03-05", created_at: "2026-02-10T10:00:00Z" },
  { id: "task-32", project_id: "proj-9", title: "Play Store release track",  status: "todo",        description: "Internal → Alpha → Production rollout",                assignee_id: null,     assignee_name: null,          due_date: "2026-03-22", created_at: "2026-02-12T10:00:00Z" },

  // proj-10 – Push Notifications
  { id: "task-33", project_id: "proj-10", title: "FCM topic subscription",   status: "done",        description: "Workspace-level push topic architecture",              assignee_id: "user-5", assignee_name: "Dawit A.",    due_date: "2026-02-25", created_at: "2026-02-12T10:00:00Z" },
  { id: "task-34", project_id: "proj-10", title: "APNs certificate setup",   status: "in_progress", description: "P8 key upload and environment config",                 assignee_id: "user-1", assignee_name: "Natnael T.",  due_date: "2026-03-08", created_at: "2026-02-15T10:00:00Z" },
  { id: "task-35", project_id: "proj-10", title: "Rich push (image + CTA)",  status: "todo",        description: "Notification service extension for media payloads",    assignee_id: null,     assignee_name: null,          due_date: "2026-03-30", created_at: "2026-02-18T10:00:00Z" },
];

// ─── HELPERS ──────────────────────────────────────────────────────────────────

export function getWorkspace(id: string): WorkspaceWithMeta | undefined {
  return WORKSPACES.find((w) => w.id === id);
}

export function getProjectsByWorkspace(workspaceId: string): ProjectWithMeta[] {
  return PROJECTS.filter((p) => p.workspace_id === workspaceId);
}

export function getProject(id: string): ProjectWithMeta | undefined {
  return PROJECTS.find((p) => p.id === id);
}

export function getTasksByProject(projectId: string): TaskWithMeta[] {
  return TASKS.filter((t) => t.project_id === projectId);
}

export function countTasksByStatus(projectId: string) {
  const tasks = getTasksByProject(projectId);
  return {
    todo:        tasks.filter((t) => t.status === "todo").length,
    in_progress: tasks.filter((t) => t.status === "in_progress").length,
    done:        tasks.filter((t) => t.status === "done").length,
    total:       tasks.length,
  };
}
