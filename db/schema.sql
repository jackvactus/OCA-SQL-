create extension if not exists pgcrypto;

create table if not exists users (
  id uuid primary key default gen_random_uuid(),
  email text not null unique,
  password_hash text not null,
  display_name text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists user_progress (
  user_id uuid primary key references users(id) on delete cascade,
  completed_lessons jsonb not null default '[]'::jsonb,
  quiz_results jsonb not null default '{}'::jsonb,
  exam_results jsonb not null default '[]'::jsonb,
  flashcard_progress jsonb not null default '{}'::jsonb,
  study_time integer not null default 0,
  streak integer not null default 0,
  last_study_date text not null default '',
  xp integer not null default 0,
  bookmarks jsonb not null default '[]'::jsonb,
  updated_at timestamptz not null default now()
);

create table if not exists activity_log (
  id bigserial primary key,
  user_id uuid references users(id) on delete cascade,
  action text not null,
  metadata jsonb not null default '{}'::jsonb,
  ip_address text,
  user_agent text,
  created_at timestamptz not null default now()
);
create index if not exists activity_log_user_created_idx on activity_log(user_id, created_at desc);
create index if not exists activity_log_action_idx on activity_log(action);

alter table users add column if not exists role text not null default 'user' check (role in ('user','admin'));
alter table users add column if not exists is_active boolean not null default true;
create index if not exists users_role_idx on users(role);

-- Sessions d'examen blanc, arbitrées par le serveur.
--
-- Sans cette table, le score d'un examen était calculé dans le navigateur puis
-- transmis tel quel : n'importe qui pouvait déclarer un sans-faute (constat
-- PED-04 de docs/AUDIT-SYSTEME.md). Le serveur mémorise désormais les questions
-- tirées et l'ordre de leurs options, corrige lui-même, et ne livre les
-- corrigés qu'après la remise de la copie.
create table if not exists exam_sessions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references users(id) on delete cascade,
  track text not null,
  locale text not null,
  -- Identifiants des questions tirées, dans l'ordre de présentation.
  question_ids jsonb not null,
  -- Permutation des options appliquée à chaque question, même ordre.
  option_orders jsonb not null,
  started_at timestamptz not null default now(),
  expires_at timestamptz not null,
  submitted_at timestamptz,
  score integer,
  total integer not null,
  time_seconds integer
);
create index if not exists exam_sessions_user_idx on exam_sessions(user_id, started_at desc);
create index if not exists exam_sessions_open_idx on exam_sessions(user_id) where submitted_at is null;
