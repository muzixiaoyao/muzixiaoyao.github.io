-- 在 Supabase SQL Editor 中执行这份脚本。
-- 执行后建议在 Authentication 设置中关闭公开注册，只保留你的管理员账号。

create table if not exists public.weibo_posts (
  id uuid primary key default gen_random_uuid(),
  author_id uuid not null references auth.users(id) on delete cascade,
  content text not null check (char_length(content) between 1 and 280),
  mood text,
  location text,
  tags text[] not null default '{}',
  created_at timestamptz not null default now()
);

create index if not exists weibo_posts_created_at_idx
  on public.weibo_posts (created_at desc);

alter table public.weibo_posts enable row level security;

grant select on public.weibo_posts to anon;
grant select, insert, update, delete on public.weibo_posts to authenticated;

drop policy if exists "Anyone can read weibo posts" on public.weibo_posts;
create policy "Anyone can read weibo posts"
  on public.weibo_posts for select
  to anon, authenticated
  using (true);

drop policy if exists "Authors can create their own weibo posts" on public.weibo_posts;
create policy "Authors can create their own weibo posts"
  on public.weibo_posts for insert
  to authenticated
  with check (auth.uid() = author_id);

drop policy if exists "Authors can update their own weibo posts" on public.weibo_posts;
create policy "Authors can update their own weibo posts"
  on public.weibo_posts for update
  to authenticated
  using (auth.uid() = author_id)
  with check (auth.uid() = author_id);

drop policy if exists "Authors can delete their own weibo posts" on public.weibo_posts;
create policy "Authors can delete their own weibo posts"
  on public.weibo_posts for delete
  to authenticated
  using (auth.uid() = author_id);
