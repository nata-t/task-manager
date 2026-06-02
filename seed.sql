-- Run this AFTER creating two user accounts via the app UI
-- Replace USER_1_ID and USER_2_ID with real auth.users UUIDs from
-- Supabase dashboard → Authentication → Users

DO $$
DECLARE
  user1 UUID := 'REPLACE_WITH_USER_1_UUID';
  user2 UUID := 'REPLACE_WITH_USER_2_UUID';
  ws1   UUID;
  ws2   UUID;
  proj1 UUID;
  proj2 UUID;
  proj3 UUID;
  proj4 UUID;
BEGIN

-- Workspaces
INSERT INTO workspaces (id, name) VALUES
  (uuid_generate_v4(), 'Acme Corp') RETURNING id INTO ws1;
INSERT INTO workspaces (id, name) VALUES
  (uuid_generate_v4(), 'Side Project') RETURNING id INTO ws2;

-- Members
INSERT INTO workspace_members (workspace_id, user_id, role) VALUES
  (ws1, user1, 'owner'),
  (ws1, user2, 'member'),
  (ws2, user2, 'owner');

-- Projects
INSERT INTO projects (id, workspace_id, name) VALUES
  (uuid_generate_v4(), ws1, 'Website Redesign') RETURNING id INTO proj1;
INSERT INTO projects (id, workspace_id, name) VALUES
  (uuid_generate_v4(), ws1, 'Backend API')      RETURNING id INTO proj2;
INSERT INTO projects (id, workspace_id, name) VALUES
  (uuid_generate_v4(), ws2, 'MVP Launch')        RETURNING id INTO proj3;
INSERT INTO projects (id, workspace_id, name) VALUES
  (uuid_generate_v4(), ws2, 'Marketing Site')   RETURNING id INTO proj4;

-- Tasks (15 across all statuses)
INSERT INTO tasks (project_id, title, description, status, assignee_id, due_date) VALUES
  (proj1, 'Design new homepage',     'Full redesign of hero section',    'done',        user1, NOW() - INTERVAL '3 days'),
  (proj1, 'Build nav component',     'Responsive navigation',            'in_progress', user2, NOW() + INTERVAL '1 day'),
  (proj1, 'Write copy for About',    NULL,                               'todo',        user1, NOW() + INTERVAL '5 days'),
  (proj1, 'SEO audit',               'Use Lighthouse',                   'todo',        NULL,  NOW() + INTERVAL '7 days'),
  (proj2, 'Set up auth endpoints',   'JWT + refresh token flow',         'done',        user1, NOW() - INTERVAL '5 days'),
  (proj2, 'Write task CRUD API',     NULL,                               'in_progress', user2, NOW() + INTERVAL '2 days'),
  (proj2, 'Add rate limiting',       'Use upstash redis',                'todo',        user1, NOW() - INTERVAL '1 day'),  -- overdue
  (proj2, 'Write API docs',          'Swagger/OpenAPI spec',             'todo',        NULL,  NOW() - INTERVAL '2 days'), -- overdue
  (proj3, 'Define MVP scope',        'Cut features for v1',              'done',        user2, NOW() - INTERVAL '10 days'),
  (proj3, 'Landing page copy',       NULL,                               'in_progress', user2, NOW() + INTERVAL '3 days'),
  (proj3, 'Set up analytics',        'Google Analytics 4',               'todo',        user2, NOW() + INTERVAL '4 days'),
  (proj3, 'Beta user outreach',      '10 beta testers',                  'todo',        NULL,  NOW() - INTERVAL '1 day'), -- overdue
  (proj4, 'Design mockups',          'Figma hi-fi',                      'done',        user2, NOW() - INTERVAL '7 days'),
  (proj4, 'Implement in Next.js',    NULL,                               'in_progress', user2, NOW() + INTERVAL '6 days'),
  (proj4, 'Configure domain + DNS',  NULL,                               'todo',        user2, NOW() + INTERVAL '8 days');

END $$;