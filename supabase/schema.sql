-- Create a table for tasks
create table public.tasks (
  id uuid default gen_random_uuid() primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  title text not null,
  description text,
  status text not null default 'todo', -- 'todo', 'in-progress', 'review', 'done'
  priority text not null default 'medium', -- 'low', 'medium', 'high'
  position integer not null default 0,
  user_id uuid references auth.users(id) default auth.uid(),
  assignee text,
  labels text[],
  due_date timestamp with time zone
);

-- Enable Row Level Security (RLS)
alter table public.tasks enable row level security;

-- Policy: Users can only see their own tasks
create policy "Users can only access their own tasks"
  on public.tasks
  for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- Create a table for integrations
create table public.integrations (
  id uuid default gen_random_uuid() primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  user_id uuid references auth.users(id) default auth.uid() not null,
  provider text not null,
  data jsonb default '{}'::jsonb,
  unique(user_id, provider)
);

-- Enable RLS for integrations
alter table public.integrations enable row level security;

-- Policy: Users can only access their own integrations
create policy "Users can only access their own integrations"
  on public.integrations
  for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);
