-- ============================================================
-- Add optional description column to projects
-- ============================================================
ALTER TABLE projects
  ADD COLUMN description TEXT CHECK (char_length(description) <= 500);
