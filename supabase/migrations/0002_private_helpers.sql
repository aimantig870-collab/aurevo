-- Move role-check helpers out of the API-exposed `public` schema (Supabase security advisor 0028/0029).
-- RLS policies still call them (anon/authenticated keep EXECUTE) but they are no longer reachable via /rest/v1/rpc.
create schema if not exists private;
grant usage on schema private to anon, authenticated;

alter function public.current_role_name() set schema private;
alter function public.is_staff() set schema private;
alter function public.can_edit() set schema private;
alter function public.is_admin() set schema private;

create or replace function private.is_staff() returns boolean
language sql stable security definer set search_path = public as
$$ select coalesce(private.current_role_name() in ('admin','editor','viewer'), false) $$;
create or replace function private.can_edit() returns boolean
language sql stable security definer set search_path = public as
$$ select coalesce(private.current_role_name() in ('admin','editor'), false) $$;
create or replace function private.is_admin() returns boolean
language sql stable security definer set search_path = public as
$$ select coalesce(private.current_role_name() = 'admin', false) $$;

create or replace function public.guard_profile_role() returns trigger
language plpgsql security definer set search_path = public as $$
begin
  if new.role is distinct from old.role and auth.uid() is not null and not private.is_admin() then
    raise exception 'only admins can change roles';
  end if;
  return new;
end $$;

revoke execute on function private.current_role_name(), private.is_staff(), private.can_edit(), private.is_admin() from public;
grant execute on function private.current_role_name(), private.is_staff(), private.can_edit(), private.is_admin() to anon, authenticated;
revoke execute on function public.handle_new_user(), public.guard_profile_role() from public, anon, authenticated;
