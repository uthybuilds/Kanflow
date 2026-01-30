-- Add new columns to tasks table
alter table public.tasks 
add column if not exists assignee text,
add column if not exists labels text[],
add column if not exists due_date timestamp with time zone;

-- Create integrations table if it doesn't exist
create table if not exists public.integrations (
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
-- We drop it first to avoid "policy already exists" errors if re-running
drop policy if exists "Users can only access their own integrations" on public.integrations;

create policy "Users can only access their own integrations"
  on public.integrations
  for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);
