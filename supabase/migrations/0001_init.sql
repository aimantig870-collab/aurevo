-- Aurevo — initial schema. Apply with `supabase db push` or the SQL editor.
-- Roles: admin (everything), editor (content + inquiries, no deletes of inquiries/users), viewer (read-only admin).


-- ---------------------------------------------------------------- enums
create type public.app_role as enum ('admin', 'editor', 'viewer');
create type public.inquiry_status as enum ('new', 'in_review', 'contacted', 'closed', 'spam');

-- ---------------------------------------------------------------- helpers
create or replace function public.set_updated_at() returns trigger
language plpgsql as $$ begin new.updated_at = now(); return new; end $$;

-- ---------------------------------------------------------------- profiles
create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text,
  full_name text,
  role public.app_role not null default 'viewer',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create trigger profiles_updated before update on public.profiles for each row execute function public.set_updated_at();

-- Role helpers (security definer so policies on profiles do not recurse).
create or replace function public.current_role_name() returns public.app_role
language sql stable security definer set search_path = public as
$$ select role from public.profiles where id = auth.uid() $$;

create or replace function public.is_staff() returns boolean
language sql stable security definer set search_path = public as
$$ select coalesce(public.current_role_name() in ('admin','editor','viewer'), false) $$;

create or replace function public.can_edit() returns boolean
language sql stable security definer set search_path = public as
$$ select coalesce(public.current_role_name() in ('admin','editor'), false) $$;

create or replace function public.is_admin() returns boolean
language sql stable security definer set search_path = public as
$$ select coalesce(public.current_role_name() = 'admin', false) $$;

-- New auth users get a *viewer* profile. Promote with: update profiles set role='admin' where email='you@…';
create or replace function public.handle_new_user() returns trigger
language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (id, email, full_name)
  values (new.id, new.email, coalesce(new.raw_user_meta_data->>'full_name', ''))
  on conflict (id) do nothing;
  return new;
end $$;
create trigger on_auth_user_created after insert on auth.users for each row execute function public.handle_new_user();

-- Prevent privilege escalation: logged-in users may change roles only if admin.
-- (auth.uid() is null in the SQL editor / migrations, which is how the first admin is promoted.)
create or replace function public.guard_profile_role() returns trigger
language plpgsql security definer set search_path = public as $$
begin
  if new.role is distinct from old.role and auth.uid() is not null and not public.is_admin() then
    raise exception 'only admins can change roles';
  end if;
  return new;
end $$;
create trigger profiles_guard_role before update on public.profiles for each row execute function public.guard_profile_role();

-- ---------------------------------------------------------------- catalogue
create table public.categories (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique check (slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$'),
  name text not null check (char_length(name) between 2 and 80),
  blurb text not null default '' check (char_length(blurb) <= 300),
  sort_order int not null default 0,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create trigger categories_updated before update on public.categories for each row execute function public.set_updated_at();

create table public.products (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique check (slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$'),
  category_id uuid not null references public.categories(id) on delete restrict,
  name text not null check (char_length(name) between 2 and 120),
  tier text not null default 'classic' check (tier in ('signature','classic')),
  serve text not null default 'hot' check (serve in ('hot','iced','either','dessert','bakery')),
  tagline text not null default '' check (char_length(tagline) <= 200),
  description text not null default '' check (char_length(description) <= 1200),
  ingredients jsonb not null default '[]'::jsonb,
  method jsonb not null default '[]'::jsonb,
  temperature text not null default '',
  cup_size text not null default '',
  presentation text not null default '',
  garnish text not null default '',
  target_customer text not null default '',
  story text not null default '',
  caffeine text not null default 'yes' check (caffeine in ('yes','optional','none')),
  cost_usd numeric(7,2) not null default 0 check (cost_usd >= 0),
  price_usd numeric(7,2) not null default 0 check (price_usd >= 0),
  recipe_status text not null default 'proposed' check (recipe_status in ('proposed','in_testing','approved')),
  is_active boolean not null default true,
  is_featured boolean not null default false,
  sort_order int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index products_category_idx on public.products(category_id);
create index products_active_idx on public.products(is_active, sort_order);
create index products_search_idx on public.products using gin (to_tsvector('simple', name || ' ' || description));
create trigger products_updated before update on public.products for each row execute function public.set_updated_at();

create table public.product_images (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references public.products(id) on delete cascade,
  url text not null,
  alt text not null default '',
  is_primary boolean not null default false,
  sort_order int not null default 0,
  created_at timestamptz not null default now()
);
create index product_images_product_idx on public.product_images(product_id);
create unique index product_images_one_primary on public.product_images(product_id) where is_primary;

create table public.gallery (
  id uuid primary key default gen_random_uuid(),
  title text not null check (char_length(title) between 1 and 120),
  caption text not null default '' check (char_length(caption) <= 300),
  image_url text not null,
  tag text not null default 'brand' check (tag in ('drinks','brand','cafe','events')),
  sort_order int not null default 0,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index gallery_active_idx on public.gallery(is_active, sort_order);
create trigger gallery_updated before update on public.gallery for each row execute function public.set_updated_at();

create table public.brand_settings (
  key text primary key check (key ~ '^[a-z0-9_]+$'),
  value text not null default '',
  updated_at timestamptz not null default now(),
  updated_by uuid references auth.users(id) on delete set null
);
create trigger brand_settings_updated before update on public.brand_settings for each row execute function public.set_updated_at();

-- ---------------------------------------------------------------- inquiries (inserted by anonymous visitors, read by staff)
create table public.partnership_requests (
  id uuid primary key default gen_random_uuid(),
  name text not null check (char_length(name) between 2 and 120),
  email text not null check (email ~* '^[^@\s]+@[^@\s]+\.[^@\s]+$' and char_length(email) <= 200),
  phone text check (phone is null or char_length(phone) <= 40),
  company text check (company is null or char_length(company) <= 160),
  partnership_type text not null check (partnership_type in ('coffee_shop','licensing','collaboration','supplier','media','other')),
  message text not null check (char_length(message) between 10 and 4000),
  status public.inquiry_status not null default 'new',
  internal_notes text not null default '',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index partnership_status_idx on public.partnership_requests(status, created_at desc);
create trigger partnership_updated before update on public.partnership_requests for each row execute function public.set_updated_at();

create table public.franchise_inquiries (
  id uuid primary key default gen_random_uuid(),
  name text not null check (char_length(name) between 2 and 120),
  email text not null check (email ~* '^[^@\s]+@[^@\s]+\.[^@\s]+$' and char_length(email) <= 200),
  phone text check (phone is null or char_length(phone) <= 40),
  country text not null check (char_length(country) between 2 and 80),
  city text check (city is null or char_length(city) <= 80),
  investment_range text not null check (investment_range in ('under_50k','50k_150k','150k_400k','over_400k','not_sure')),
  experience text not null default 'none' check (experience in ('none','hospitality','multi_unit','other')),
  has_site boolean not null default false,
  message text not null default '' check (char_length(message) <= 4000),
  status public.inquiry_status not null default 'new',
  internal_notes text not null default '',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index franchise_status_idx on public.franchise_inquiries(status, created_at desc);
create trigger franchise_updated before update on public.franchise_inquiries for each row execute function public.set_updated_at();

create table public.contact_messages (
  id uuid primary key default gen_random_uuid(),
  name text not null check (char_length(name) between 2 and 120),
  email text not null check (email ~* '^[^@\s]+@[^@\s]+\.[^@\s]+$' and char_length(email) <= 200),
  subject text not null check (char_length(subject) between 2 and 160),
  message text not null check (char_length(message) between 10 and 4000),
  status public.inquiry_status not null default 'new',
  internal_notes text not null default '',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index contact_status_idx on public.contact_messages(status, created_at desc);
create trigger contact_updated before update on public.contact_messages for each row execute function public.set_updated_at();

-- ---------------------------------------------------------------- audit log
create table public.admin_activity_logs (
  id bigint generated always as identity primary key,
  actor_id uuid references auth.users(id) on delete set null,
  actor_email text,
  action text not null,
  entity text not null,
  entity_id text,
  details jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);
create index activity_created_idx on public.admin_activity_logs(created_at desc);

-- ---------------------------------------------------------------- Row Level Security
alter table public.profiles enable row level security;
alter table public.categories enable row level security;
alter table public.products enable row level security;
alter table public.product_images enable row level security;
alter table public.gallery enable row level security;
alter table public.brand_settings enable row level security;
alter table public.partnership_requests enable row level security;
alter table public.franchise_inquiries enable row level security;
alter table public.contact_messages enable row level security;
alter table public.admin_activity_logs enable row level security;

-- profiles: a user sees their own; staff see all; only admins update (role guard trigger also enforces).
create policy profiles_self_read on public.profiles for select to authenticated using (id = auth.uid() or public.is_staff());
create policy profiles_admin_update on public.profiles for update to authenticated using (public.is_admin()) with check (public.is_admin());

-- public catalogue: anyone reads active rows; editors/admins write.
create policy categories_read on public.categories for select to anon, authenticated using (is_active or public.is_staff());
create policy categories_write on public.categories for all to authenticated using (public.can_edit()) with check (public.can_edit());

create policy products_read on public.products for select to anon, authenticated using (is_active or public.is_staff());
create policy products_write on public.products for all to authenticated using (public.can_edit()) with check (public.can_edit());

create policy product_images_read on public.product_images for select to anon, authenticated using (true);
create policy product_images_write on public.product_images for all to authenticated using (public.can_edit()) with check (public.can_edit());

create policy gallery_read on public.gallery for select to anon, authenticated using (is_active or public.is_staff());
create policy gallery_write on public.gallery for all to authenticated using (public.can_edit()) with check (public.can_edit());

create policy settings_read on public.brand_settings for select to anon, authenticated using (true);
create policy settings_write on public.brand_settings for all to authenticated using (public.can_edit()) with check (public.can_edit());

-- inquiries: anyone may INSERT (status forced to 'new'); staff read; editors update; admins delete.
create policy partnership_insert on public.partnership_requests for insert to anon, authenticated with check (status = 'new' and internal_notes = '');
create policy partnership_read on public.partnership_requests for select to authenticated using (public.is_staff());
create policy partnership_update on public.partnership_requests for update to authenticated using (public.can_edit()) with check (public.can_edit());
create policy partnership_delete on public.partnership_requests for delete to authenticated using (public.is_admin());

create policy franchise_insert on public.franchise_inquiries for insert to anon, authenticated with check (status = 'new' and internal_notes = '');
create policy franchise_read on public.franchise_inquiries for select to authenticated using (public.is_staff());
create policy franchise_update on public.franchise_inquiries for update to authenticated using (public.can_edit()) with check (public.can_edit());
create policy franchise_delete on public.franchise_inquiries for delete to authenticated using (public.is_admin());

create policy contact_insert on public.contact_messages for insert to anon, authenticated with check (status = 'new' and internal_notes = '');
create policy contact_read on public.contact_messages for select to authenticated using (public.is_staff());
create policy contact_update on public.contact_messages for update to authenticated using (public.can_edit()) with check (public.can_edit());
create policy contact_delete on public.contact_messages for delete to authenticated using (public.is_admin());

-- audit log: staff with edit rights may append entries as themselves; admins read.
create policy activity_insert on public.admin_activity_logs for insert to authenticated with check (public.can_edit() and actor_id = auth.uid());
create policy activity_read on public.admin_activity_logs for select to authenticated using (public.is_admin());

-- ---------------------------------------------------------------- grants (RLS still applies)
grant usage on schema public to anon, authenticated;
grant select on public.categories, public.products, public.product_images, public.gallery, public.brand_settings to anon, authenticated;
grant insert on public.partnership_requests, public.franchise_inquiries, public.contact_messages to anon, authenticated;
grant select, update, delete on public.partnership_requests, public.franchise_inquiries, public.contact_messages to authenticated;
grant insert, update, delete on public.categories, public.products, public.product_images, public.gallery, public.brand_settings to authenticated;
grant select, update on public.profiles to authenticated;
grant select, insert on public.admin_activity_logs to authenticated;
grant usage, select on all sequences in schema public to authenticated;

-- ---------------------------------------------------------------- storage
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('media', 'media', true, 5242880, array['image/jpeg','image/png','image/webp','image/avif'])
on conflict (id) do nothing;

create policy media_public_read on storage.objects for select to anon, authenticated using (bucket_id = 'media');
create policy media_staff_insert on storage.objects for insert to authenticated with check (bucket_id = 'media' and public.can_edit());
create policy media_staff_update on storage.objects for update to authenticated using (bucket_id = 'media' and public.can_edit());
create policy media_staff_delete on storage.objects for delete to authenticated using (bucket_id = 'media' and public.can_edit());
