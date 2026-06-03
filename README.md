# Task Manager - Technical Assessment

## Assignment Timeline
- **Start Time:** Jun 2, 11 PM 
- **End Time:** Jun 3, 11:30 PM 

## How to Run Locally

1. **Clone the repository & install dependencies**
   ```bash
   git clone [your-repo-url]
   cd task-manager
   pnpm install
   ```

2. **Set up environment variables**
   Create a `.env.local` based on `.env.example`:
   ```bash
   cp .env.example .env.local
   ```
   Add your `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY`.

3. **Start the development server**
   ```bash
   pnpm dev
   ```

*(Note: The database schema including seed data can be provisioned by running `schema.sql` at the root against your Supabase instance, or using Supabase CLI if configured.)*

## What is Complete and Working

- **Authentication:** Full sign-up, sign-in, and sign-out flow using Supabase Auth.
- **Database & RLS:** 
  - Complete schema for `workspaces`, `workspace_members`, `projects`, and `tasks`.
  - Row Level Security (RLS) is strictly enforced on all 4 operations (SELECT, INSERT, UPDATE, DELETE) based on `workspace_members`, preventing cross-workspace leaks.
- **TypeScript:** Fully typed codebase with zero `any` usage. Leverages Supabase generated types for all database operations.
- **Workspace Dashboard:** Allows switching between workspaces and visualizes projects with live data integration.
- **Projects & Tasks UI:**
  - Professional layout featuring a navigation rail for workspaces and sidebar for projects.
  - Project task views containing inline status updates and metadata display.
- **Realtime Subscriptions:** Task updates are synced in real-time utilizing Supabase channels without needing manual reload.
- **Filter State in URL:** Filtering tasks synchronizes with URL query parameters for shareability, restoring exact filter states.
- **Optimistic UI:** Used for workspace creation and renaming, providing instant feedback while the mutation is in progress.
- **UI/UX intentionality:** Playfair Display typography, responsive design, loading skeletons, error states, and customized shadcn UI components instead of generic templates.
- **Edge Function (Overdue Tasks):** `[Specify here if the Edge function for overdue tasks is fully integrated, e.g., Working endpoint returning JSON of overdue tasks accessible within the UI.]`

## What is Incomplete, Skipped, or Broken

> **[IMPORTANT]** *Update this section honestly based on exactly what you didn't finish. Below are examples or prompts to help you fill this out.*

- **Edge Function Implementation:** *(Example: If not completed)* I skipped the Supabase Edge function for overdue tasks as I prioritized perfecting the UI interactions (optimistic updates and URL sync) within the 24-hour limit.
- **Optimistic UI Feedback on task changes:** *(Example: If you skipped updating task statuses optimistically)* While I implemented optimistic updates for workspace creation, I fell back to standard mutations for task status updates due to complexity with maintaining exact local query cache state in React Query across multiple filters. I wanted to ensure robustness over speed here.
- **Test Coverage:** Due to time constraints, automated test coverage is minimal.

*(Please modify the above based on the actual state of your submission. Honesty is directly weighted in the scoring rubic.)*

## Architectural Decisions & Trade-offs

1. **React Query over built-in server actions for specific mutations:**
   I chose to use React Query for client-side data fetching and mutations (e.g., workspaces, tasks updates) to leverage its powerful caching and optimistic update features, which enabled a snappier feeling UX without requiring full page refetches on every action.

2. **Next.js App Router (Client vs. Server Components):**
   I favored making the outer layouts Server Components to pass minimal required data down. The deeply interactive pieces like the `WorkspaceRail` and task boards are Client Components. This allowed keeping bundle sizes reasonable while meeting strict interactivity requirements (like inline editing).

3. **Styling Approach:**
   I customized Shadcn UI heavily (e.g., adapting the `Tooltip`, `Popover`, and integrating custom fonts) instead of raw Tailwind blocks. This allowed for building a solid, accessible foundation quickly while ensuring the visual design feels intentional, rather than simply dropping in a generic template.

4. **URL Query Params for Filters:**
   Filtering tasks updates the URL instead of just local state. This has the significant benefit of making task views copy-pasteable and bookmarkable, significantly improving UX.
