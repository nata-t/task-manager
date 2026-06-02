-- ============================================================
-- 01. ENUMS
-- ============================================================
CREATE TYPE task_status AS ENUM ('todo', 'in_progress', 'done');
CREATE TYPE workspace_role AS ENUM ('owner', 'member');


-- ============================================================
-- 02. TABLES
-- ============================================================
CREATE TABLE workspaces (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name        TEXT NOT NULL CHECK (char_length(name) BETWEEN 1 AND 100),
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE workspace_members (
  workspace_id  UUID NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
  user_id       UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role          workspace_role NOT NULL DEFAULT 'member',
  joined_at     TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  PRIMARY KEY (workspace_id, user_id)
);

CREATE TABLE projects (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id  UUID NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
  name          TEXT NOT NULL CHECK (char_length(name) BETWEEN 1 AND 100),
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE tasks (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id   UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  title        TEXT NOT NULL CHECK (char_length(title) BETWEEN 1 AND 200),
  description  TEXT,
  status       task_status NOT NULL DEFAULT 'todo',
  assignee_id  UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  due_date     DATE,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE profiles (
  id          UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name   TEXT,
  avatar_url  TEXT,
  updated_at  TIMESTAMPTZ
);


-- ============================================================
-- 03. INDEXES
-- ============================================================
CREATE INDEX idx_workspace_members_user_id    ON workspace_members(user_id);
CREATE INDEX idx_workspace_members_workspace  ON workspace_members(workspace_id);
CREATE INDEX idx_projects_workspace_id        ON projects(workspace_id);
CREATE INDEX idx_tasks_project_id             ON tasks(project_id);
CREATE INDEX idx_tasks_assignee_id            ON tasks(assignee_id);
CREATE INDEX idx_tasks_status                 ON tasks(status);
CREATE INDEX idx_tasks_due_date               ON tasks(due_date);


-- ============================================================
-- 04. ROW LEVEL SECURITY — ENABLE
-- ============================================================
ALTER TABLE workspaces         ENABLE ROW LEVEL SECURITY;
ALTER TABLE workspace_members  ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects           ENABLE ROW LEVEL SECURITY;
ALTER TABLE tasks              ENABLE ROW LEVEL SECURITY;
ALTER TABLE profiles           ENABLE ROW LEVEL SECURITY;


-- ============================================================
-- 05. FUNCTIONS
-- ============================================================

-- Returns true if the calling user is a member of the given workspace
CREATE OR REPLACE FUNCTION is_workspace_member(ws_id UUID)
RETURNS BOOLEAN
LANGUAGE sql
SECURITY DEFINER
STABLE
AS $$
  SELECT EXISTS (
    SELECT 1 FROM workspace_members
    WHERE workspace_id = ws_id
    AND   user_id = auth.uid()
  );
$$;

-- Returns true if the calling user is an owner of the given workspace
CREATE OR REPLACE FUNCTION is_workspace_owner(ws_id UUID)
RETURNS BOOLEAN
LANGUAGE sql
SECURITY DEFINER
STABLE
AS $$
  SELECT EXISTS (
    SELECT 1 FROM workspace_members
    WHERE workspace_id = ws_id
    AND   user_id = auth.uid()
    AND   role = 'owner'
  );
$$;

-- Returns the workspace_id for a given project
CREATE OR REPLACE FUNCTION get_project_workspace(proj_id UUID)
RETURNS UUID
LANGUAGE sql
SECURITY DEFINER
STABLE
AS $$
  SELECT workspace_id FROM projects WHERE id = proj_id;
$$;

-- Inserts the creator of a workspace as its owner
CREATE OR REPLACE FUNCTION handle_new_workspace()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  INSERT INTO workspace_members (workspace_id, user_id, role)
  VALUES (NEW.id, auth.uid(), 'owner');
  RETURN NEW;
END;
$$;

-- Creates a profile row when a new user signs up
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, avatar_url)
  VALUES (
    NEW.id,
    NEW.raw_user_meta_data->>'full_name',
    NEW.raw_user_meta_data->>'avatar_url'
  );
  RETURN NEW;
END;
$$;


-- ============================================================
-- 06. POLICIES
-- ============================================================

-- ------------------------------------------------------------
-- workspaces
-- ------------------------------------------------------------
CREATE POLICY "members can view their workspaces"
ON workspaces FOR SELECT
USING ( is_workspace_member(id) );

CREATE POLICY "authenticated users can create workspaces"
ON workspaces FOR INSERT
WITH CHECK ( auth.uid() IS NOT NULL );

CREATE POLICY "owners can update workspace"
ON workspaces FOR UPDATE
USING  ( is_workspace_owner(id) )
WITH CHECK ( is_workspace_owner(id) );

CREATE POLICY "owners can delete workspace"
ON workspaces FOR DELETE
USING ( is_workspace_owner(id) );

-- ------------------------------------------------------------
-- workspace_members
-- ------------------------------------------------------------
CREATE POLICY "members can view workspace members"
ON workspace_members FOR SELECT
USING ( is_workspace_member(workspace_id) );

CREATE POLICY "owners can add members"
ON workspace_members FOR INSERT
WITH CHECK (
  is_workspace_owner(workspace_id)
  OR user_id = auth.uid()
);

CREATE POLICY "owners can update member roles"
ON workspace_members FOR UPDATE
USING  ( is_workspace_owner(workspace_id) )
WITH CHECK ( is_workspace_owner(workspace_id) );

CREATE POLICY "owners can remove members or members can leave"
ON workspace_members FOR DELETE
USING (
  is_workspace_owner(workspace_id)
  OR user_id = auth.uid()
);

-- ------------------------------------------------------------
-- projects
-- ------------------------------------------------------------
CREATE POLICY "members can view projects"
ON projects FOR SELECT
USING ( is_workspace_member(workspace_id) );

CREATE POLICY "owners can create projects"
ON projects FOR INSERT
WITH CHECK ( is_workspace_owner(workspace_id) );

CREATE POLICY "owners can update projects"
ON projects FOR UPDATE
USING  ( is_workspace_owner(workspace_id) )
WITH CHECK ( is_workspace_owner(workspace_id) );

CREATE POLICY "owners can delete projects"
ON projects FOR DELETE
USING ( is_workspace_owner(workspace_id) );

-- ------------------------------------------------------------
-- tasks
-- ------------------------------------------------------------
CREATE POLICY "members can view tasks"
ON tasks FOR SELECT
USING (
  is_workspace_member( get_project_workspace(project_id) )
);

CREATE POLICY "members can create tasks"
ON tasks FOR INSERT
WITH CHECK (
  is_workspace_member( get_project_workspace(project_id) )
);

CREATE POLICY "members can update tasks"
ON tasks FOR UPDATE
USING (
  is_workspace_member( get_project_workspace(project_id) )
)
WITH CHECK (
  is_workspace_member( get_project_workspace(project_id) )
  AND (
    assignee_id IS NULL
    OR is_workspace_member( get_project_workspace(project_id) )
  )
);

CREATE POLICY "owners can delete tasks"
ON tasks FOR DELETE
USING (
  is_workspace_owner( get_project_workspace(project_id) )
);

-- ------------------------------------------------------------
-- profiles
-- ------------------------------------------------------------
CREATE POLICY "profiles are viewable by authenticated users"
ON profiles FOR SELECT
USING ( auth.uid() IS NOT NULL );

CREATE POLICY "users can update their own profile"
ON profiles FOR UPDATE
USING  ( auth.uid() = id )
WITH CHECK ( auth.uid() = id );


-- ============================================================
-- 07. TRIGGERS
-- ============================================================
CREATE TRIGGER on_workspace_created
AFTER INSERT ON workspaces
FOR EACH ROW EXECUTE FUNCTION handle_new_workspace();

CREATE TRIGGER on_auth_user_created
AFTER INSERT ON auth.users
FOR EACH ROW EXECUTE FUNCTION handle_new_user();