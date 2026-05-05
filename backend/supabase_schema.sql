-- ArenaOnly backend schema (Supabase/Postgres compatible)
create extension if not exists "pgcrypto";

create table if not exists profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  username text unique not null,
  banner_url text,
  avatar_url text,
  bio text,
  favorite_games text[],
  social_links jsonb default '{}'::jsonb,
  theme jsonb default '{"accent":"#7c3aed"}'::jsonb,
  privacy jsonb default '{"profile":"public"}'::jsonb,
  created_at timestamptz default now()
);

create table if not exists channels (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references profiles(id) on delete cascade,
  title text not null,
  about text,
  created_at timestamptz default now()
);

create table if not exists videos (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references profiles(id) on delete cascade,
  channel_id uuid references channels(id) on delete set null,
  title text not null,
  description text,
  tags text[],
  category text,
  visibility text check (visibility in ('public','private','friends_only')) default 'public',
  storage_path text not null,
  thumbnail_path text,
  scheduled_at timestamptz,
  published_at timestamptz,
  status text check (status in ('draft','published')) default 'draft'
);

create table if not exists friendships (
  id uuid primary key default gen_random_uuid(),
  requester uuid references profiles(id) on delete cascade,
  addressee uuid references profiles(id) on delete cascade,
  status text check (status in ('pending','accepted','rejected','blocked')) default 'pending',
  created_at timestamptz default now(),
  unique(requester, addressee)
);

create table if not exists messages (
  id uuid primary key default gen_random_uuid(),
  sender_id uuid references profiles(id) on delete cascade,
  recipient_id uuid references profiles(id) on delete cascade,
  body text,
  file_path text,
  delivered_at timestamptz,
  seen_at timestamptz,
  created_at timestamptz default now()
);

create table if not exists comments (
  id uuid primary key default gen_random_uuid(),
  video_id uuid references videos(id) on delete cascade,
  author_id uuid references profiles(id) on delete cascade,
  body text not null,
  created_at timestamptz default now()
);

create table if not exists likes (
  id uuid primary key default gen_random_uuid(),
  video_id uuid references videos(id) on delete cascade,
  user_id uuid references profiles(id) on delete cascade,
  value smallint check (value in (1,-1)),
  created_at timestamptz default now(),
  unique(video_id, user_id)
);
