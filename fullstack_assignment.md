**FULLSTACK ENGINEER**

**Take-Home Assignment**

React + TypeScript + Supabase + Vercel

24-hour window // **Submit to: abel@aspio.io**

+-----------------+-----------------+-----------------+-----------------+
| **24h** | **1 repo** | **Live URL** | **No slack** |
| | | | |
| Hard time | Public GitHub. | Vercel. Must be | Broken auth or |
| limit. Log | Invite | live when you | missing RLS = |
| exact start | abel-aspio as | submit --- we | automatic |
| time in your | collaborator. | open it first. | reject. No |
| README. | | | exceptions. |
+-----------------+-----------------+-----------------+-----------------+

+-----------------------------------------------------------------------+
| **AI TOOLS POLICY** |
+-----------------------------------------------------------------------+
| AI tools are allowed and expected. Every serious developer uses them. |
| What we\'re evaluating is |
| |
| your judgment --- what you build vs. what you generate, whether the |
| architecture is sound, whether |
| |
| you understand every line you ship, and whether the result looks like |
| a product or a tutorial clone. |
+-----------------------------------------------------------------------+

**1. What You\'re Building**

A multi-workspace task management application. Users belong to
workspaces. Workspaces contain projects. Projects contain tasks. Tasks
can be assigned to workspace members.

**This is not a simple CRUD app.** The scope is deliberately constrained
so we can evaluate depth of execution, not breadth of features. A
perfect task manager beats a half-built dashboard every time.

**Required screens**

- Auth --- sign up, sign in, sign out via Supabase Auth

- Workspace dashboard --- overview of projects with task counts by
  status

- Project view --- full task list with inline status updates,
  assignee, due date, and filters

- Task detail panel --- all fields editable inline without a page
  reload

**Data model (minimum)**

+-----------------------------------------------------------------------+
| workspaces (id, name, created_at) |
| |
| workspace_members (workspace_id, user_id, role) ← drives all RLS |
| |
| projects (id, workspace_id, name, created_at) |
| |
| tasks (id, project_id, title, description, status, assignee_id, |
| due_date, created_at) |
| |
| status enum: todo \| in_progress \| done |
| |
| role enum: owner \| member |
+-----------------------------------------------------------------------+

You may extend this schema but you may not simplify it. Skipping
workspace_members and faking single-user RLS is an automatic reject.

**2. Requirements**

---

**R1** **\[DATABASE\]** Supabase schema with RLS policies covering  
 ALL FOUR operations --- SELECT, INSERT, UPDATE, DELETE --- on
every table. Policies must enforce workspace isolation based  
 on workspace_members. We test this directly against the API  
 using a second user account, not through your UI.

**R2** **\[TYPESCRIPT\]** Supabase types generated from your schema  
 using the CLI (npx supabase gen types). No handwritten  
 interfaces for database rows. Your typed client must be used  
 throughout --- no casting to any.

**R3** **\[DATABASE\]** Realtime task updates via Supabase channels.
When any user changes a task\'s status, all other connected  
 users in that workspace must see it update immediately  
 without a reload. Subscriptions must be cleaned up on  
 unmount.

**R4** **\[UI/UX\]** Task list filtering by status AND assignee  
 simultaneously. Filter state must live in URL query params  
 --- sharing the URL must restore the exact filter state. No  
 filter state in component state only.

**R5** **\[UI/UX\]** All task fields editable inline. No separate  
 edit page or modal required, but the UX must be intentional  
 --- not a collection of raw input\[type=text\] fields.  
 Editing must show clear save/cancel affordance.

**R6** **\[UI/UX\]** Full loading, empty, and error states on every  
 data-fetching view. Loading must not be a blank white screen.
Empty states must include a call to action. Errors must show  
 a message --- not a broken layout.

**R7** **\[HARD\]** Optimistic UI on task status changes. Update  
 local state immediately, rollback with user-visible feedback  
 on API failure. If you skip this, document why in your README
--- skipping without explanation is penalised.

**R8** **\[HARD\]** Supabase Edge Function: an endpoint that accepts
a project_id and returns a JSON list of overdue tasks  
 (due_date \< now, status != done) with assignee name.  
 Triggered from a button in the UI with the response  
 displayed. RLS must still apply --- users cannot query  
 projects outside their workspace.

---

**3. Technical Standards**

**TypeScript**

- No any types anywhere in the codebase. Zero. We grep for it.

- Supabase generated types used for all database interaction

- React component props typed explicitly --- no implicit any via JSX
  inference shortcuts

- Custom hooks must have explicit return type annotations

**Supabase**

- Use the Supabase SSR client pattern correctly for Next.js (not the
  deprecated createClient from \@supabase/supabase-js directly in
  components)

- RLS is not optional and not a last step. Write it with the schema.

- Do not expose the service role key anywhere in client-side code

- Edge Functions must be in the /supabase/functions directory,
  committed, and referenced in your schema.sql or a separate deploy
  script

**React / Next.js**

- Use the App Router. No Pages Router.

- Server Components where appropriate --- do not default everything to
  \'use client\'

- No prop drilling beyond 2 levels --- use context or a state library

- No useEffect for data fetching --- use server components or a data
  fetching library (SWR, React Query, or Supabase\'s built-in hooks)

**Code quality**

- ESLint configured and passing with zero errors on submission

- Meaningful commit messages --- we read them. \"fix stuff\" is a red
  flag.

- No commented-out code blocks left in the submission

- Environment variables in .env.example with placeholder values ---
  never hardcoded

**4. Design & UX Expectations**

You have 24 hours and access to every UI library ever made. The bar is
higher than shadcn defaults with zero customisation. We are not
expecting Dribbble shots. We are expecting something that looks
intentional.

**Minimum bar**

- Consistent spacing system --- not random padding values across
  components

- Typography hierarchy --- headings, body text, and labels must be
  visually distinct

- Color usage with purpose --- not every shade of gray available in
  CSS

- Responsive at 375px (mobile) and 1280px (desktop) minimum

- No layout shifts on load --- skeleton loaders or static placeholder
  shapes, not content jumping around

**What gets you extra points**

- A design decision we haven\'t seen before in a task manager

- Micro-interactions that feel native --- not CSS transitions slapped
  on everything

- Workspace/project switcher that\'s actually fast and pleasant to use

+-----------------------------------------------------------------------+
| **NOTE ON UI LIBRARIES** |
+-----------------------------------------------------------------------+
| Using Tailwind + shadcn is fine. Copy-pasting every shadcn component |
| with zero modifications is not. |
| |
| We can tell. Your UI must reflect deliberate choices, not a template |
| install. |
+-----------------------------------------------------------------------+

**5. Scoring Rubric**

---

**Area** **Points** **What we actually test**

---

**Supabase + RLS** **25 pts** Schema correctness, all 4 ops covered per
table, no cross-workspace leaks, generated
types used, SSR client pattern

**TypeScript** **20 pts** Zero any, proper generics, typed hooks and
components, no workarounds

**UI quality** **20 pts** Visual intentionality, spacing consistency,
responsiveness, not a template dump

**UX quality** **15 pts** Inline editing, URL-synced filters,
loading/empty/error states, feedback on
actions

**Code **10 pts** Component decomposition, no spaghetti, correct
architecture** Server vs Client component usage

**Bonus: **5 pts** Instant local update + rollback with user
Optimistic UI** feedback on failure

**Bonus: Edge **5 pts** Working endpoint, RLS enforced, result
Function** displayed in UI

---

Total: 100 points. The two bonus items take you to 100 if you hit all
core requirements. Partial credit is given for partial implementations
--- document what works and what doesn\'t.

**6. Automatic Disqualifiers**

+-----------------------------------------------------------------------+
| **DISQUALIFIERS --- READ THIS FIRST** |
+-----------------------------------------------------------------------+
| Any of the following will result in immediate rejection without |
| review: |
| |
| • RLS missing entirely, or policies that don\'t cover all four |
| operations |
| |
| • Cross-workspace data leak confirmed via direct API test |
| |
| • Supabase service role key or any secret committed to the repository |
| |
| • any types used anywhere --- including in generated code you copied |
| in |
| |
| • Auth flow broken on the live Vercel URL (sign up, sign in, sign out |
| must all work) |
| |
| • Single Git commit --- shows you didn\'t build this progressively |
| over 24 hours |
| |
| • Vercel URL is down, throws a 500, or shows a blank screen at |
| submission time |
| |
| • Submission after the 24-hour window without prior notice |
+-----------------------------------------------------------------------+

**7. Suggested 24h Timeline**

This is guidance, not a rule. If you have a better plan, execute it. But
if you are still writing schema at hour 12, something is wrong.

---

**0 -- Scaffold Next.js app, configure Supabase project, write full
2h** schema + all RLS policies, generate types. Do not move on
until RLS is in place.

**2 -- Auth flow end to end. Workspace + project data layer. Core
6h** task CRUD working with real data.

**6 -- All four screens built. Realtime subscriptions. Filtering
14h** with URL state. Inline editing.

**14 -- UI polish. Loading/empty/error states on every view.
20h** Responsive layout. Design intentionality.

**20 -- Deploy to Vercel. Test every flow on the live URL. Fix env
22h** vars, hydration errors, CORS issues. Do not leave this until
the final 30 minutes.

**22 -- Bonus features if ahead. Write README. Final review of
24h** disqualifier checklist. Submit.

---

**8. How to Submit**

Send an email to **abel@aspio.io** with the subject line:

---

Assignment --- \[Your Full Name\]

---

Your email must include all four of the following. Missing any one of
them means the submission is incomplete:

- GitHub repository URL (public) with abel-aspio added as a
  collaborator

- Vercel deployment URL --- live, functional, and accessible at the
  time of submission

- Your exact start time (date + time + timezone)

- Anything you want us to know before we open the code --- known
  issues, tradeoffs, what you\'d do with more time

**Repository must include**

- schema.sql at root --- all migrations runnable in a single
  execution, including seed data

- Seed data: minimum 2 workspaces, 4 projects, 15 tasks across
  different statuses and assignees so we can evaluate the full UI
  without setup

- .env.example with all required environment variable names and
  placeholder values

- supabase/functions/ directory with any Edge Functions committed

- README.md --- see below

**README requirements**

- Exact start and end time

- What is complete and working

- What is incomplete, skipped, or broken --- and why

- Any architectural decisions you\'d defend or change with more time

- How to run locally in 5 commands or fewer

+-----------------------------------------------------------------------+
| **ON THE README** |
+-----------------------------------------------------------------------+
| We read the README carefully. A developer who articulates their |
| tradeoffs clearly is more |
| |
| useful than one who ships 80% and pretends it is 100%. Honesty about |
| what is missing is |
| |
| weighted positively. Silence about known issues is weighted |
| negatively. |
+-----------------------------------------------------------------------+

**Good luck. Ship something real.**

abel@aspio.io
