-- Add owner_id to track the creator of the workspace
ALTER TABLE workspaces 
ADD COLUMN owner_id UUID DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE CASCADE;

-- Update the SELECT policy to allow the creator to view the row immediately after creation
DROP POLICY IF EXISTS "members can view their workspaces" ON workspaces;

CREATE POLICY "members can view their workspaces"
ON workspaces FOR SELECT
USING ( auth.uid() = owner_id OR is_workspace_member(id) );
