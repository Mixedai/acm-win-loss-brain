-- Migration 8: row level security. Internal tool: admins see all clients,
-- analysts and viewers see only clients they were granted access to.
-- Viewers are read-only. Anonymous users get nothing.

create or replace function public.current_user_role()
returns public.user_role
language sql
stable
security definer
set search_path = ''
as $$
  select p.role from public.profiles p where p.id = auth.uid();
$$;

create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select coalesce(public.current_user_role() = 'admin', false);
$$;

create or replace function public.has_client_access(p_client_id uuid)
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select public.is_admin()
    or exists (
      select 1
      from public.client_access ca
      where ca.user_id = auth.uid()
        and ca.client_id = p_client_id
    );
$$;

create or replace function public.can_edit_client(p_client_id uuid)
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select public.has_client_access(p_client_id)
    and coalesce(public.current_user_role() in ('admin', 'analyst'), false);
$$;

revoke execute on function public.current_user_role() from public, anon;
revoke execute on function public.is_admin() from public, anon;
revoke execute on function public.has_client_access(uuid) from public, anon;
revoke execute on function public.can_edit_client(uuid) from public, anon;

-- Only admins may change a user's role. Sessions without a user id
-- (service role, SQL editor, migrations) are not end users and are allowed.
create or replace function public.prevent_role_escalation()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  if new.role is distinct from old.role
     and auth.uid() is not null
     and not public.is_admin() then
    raise exception 'Only admins can change a user role' using errcode = '42501';
  end if;
  return new;
end;
$$;

create trigger profiles_prevent_role_escalation
  before update on public.profiles
  for each row execute function public.prevent_role_escalation();

-- profiles
alter table public.profiles enable row level security;

create policy "profiles: read own or admin" on public.profiles
  for select to authenticated
  using (id = auth.uid() or public.is_admin());

create policy "profiles: update own or admin" on public.profiles
  for update to authenticated
  using (id = auth.uid() or public.is_admin())
  with check (id = auth.uid() or public.is_admin());

create policy "profiles: admin delete" on public.profiles
  for delete to authenticated
  using (public.is_admin());

-- clients
alter table public.clients enable row level security;

create policy "clients: read with access" on public.clients
  for select to authenticated
  using (public.has_client_access(id));

create policy "clients: admin insert" on public.clients
  for insert to authenticated
  with check (public.is_admin());

create policy "clients: admin update" on public.clients
  for update to authenticated
  using (public.is_admin())
  with check (public.is_admin());

create policy "clients: admin delete" on public.clients
  for delete to authenticated
  using (public.is_admin());

-- client_access
alter table public.client_access enable row level security;

create policy "client_access: read own or admin" on public.client_access
  for select to authenticated
  using (user_id = auth.uid() or public.is_admin());

create policy "client_access: admin insert" on public.client_access
  for insert to authenticated
  with check (public.is_admin());

create policy "client_access: admin update" on public.client_access
  for update to authenticated
  using (public.is_admin())
  with check (public.is_admin());

create policy "client_access: admin delete" on public.client_access
  for delete to authenticated
  using (public.is_admin());

-- Shared taxonomy: everyone signed in can read, admins maintain it.
alter table public.loss_reason_categories enable row level security;
alter table public.loss_reasons enable row level security;

create policy "loss_reason_categories: read" on public.loss_reason_categories
  for select to authenticated using (true);
create policy "loss_reason_categories: admin insert" on public.loss_reason_categories
  for insert to authenticated with check (public.is_admin());
create policy "loss_reason_categories: admin update" on public.loss_reason_categories
  for update to authenticated using (public.is_admin()) with check (public.is_admin());
create policy "loss_reason_categories: admin delete" on public.loss_reason_categories
  for delete to authenticated using (public.is_admin());

create policy "loss_reasons: read" on public.loss_reasons
  for select to authenticated using (true);
create policy "loss_reasons: admin insert" on public.loss_reasons
  for insert to authenticated with check (public.is_admin());
create policy "loss_reasons: admin update" on public.loss_reasons
  for update to authenticated using (public.is_admin()) with check (public.is_admin());
create policy "loss_reasons: admin delete" on public.loss_reasons
  for delete to authenticated using (public.is_admin());

-- Every client-scoped table (any public base table with a client_id column):
-- read with client access, write only for admins/analysts with client access.
do $$
declare
  t record;
begin
  for t in
    select c.table_name
    from information_schema.columns c
    join information_schema.tables tb
      on tb.table_schema = c.table_schema and tb.table_name = c.table_name
    where c.table_schema = 'public'
      and c.column_name = 'client_id'
      and tb.table_type = 'BASE TABLE'
      and c.table_name <> 'client_access'
    order by c.table_name
  loop
    execute format('alter table public.%I enable row level security', t.table_name);

    execute format(
      'create policy %I on public.%I for select to authenticated using (public.has_client_access(client_id))',
      t.table_name || ': read with client access', t.table_name
    );
    execute format(
      'create policy %I on public.%I for insert to authenticated with check (public.can_edit_client(client_id))',
      t.table_name || ': insert with edit rights', t.table_name
    );
    execute format(
      'create policy %I on public.%I for update to authenticated using (public.can_edit_client(client_id)) with check (public.can_edit_client(client_id))',
      t.table_name || ': update with edit rights', t.table_name
    );
    execute format(
      'create policy %I on public.%I for delete to authenticated using (public.can_edit_client(client_id))',
      t.table_name || ': delete with edit rights', t.table_name
    );
  end loop;
end;
$$;
