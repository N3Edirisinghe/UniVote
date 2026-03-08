-- Profiles policies
create policy "Users can view all profiles"
  on public.profiles for select
  using (true);

create policy "Users can update own profile"
  on public.profiles for update
  using (auth.uid() = id);

-- Elections policies
create policy "Anyone can view elections"
  on public.elections for select
  using (true);

create policy "Admins can insert elections"
  on public.elections for insert
  with check (
    exists (
      select 1 from public.profiles
      where id = auth.uid() and role = 'admin'
    )
  );

create policy "Admins can update elections"
  on public.elections for update
  using (
    exists (
      select 1 from public.profiles
      where id = auth.uid() and role = 'admin'
    )
  );

create policy "Admins can delete elections"
  on public.elections for delete
  using (
    exists (
      select 1 from public.profiles
      where id = auth.uid() and role = 'admin'
    )
  );

-- Candidates policies
create policy "Anyone can view candidates"
  on public.candidates for select
  using (true);

create policy "Admins can insert candidates"
  on public.candidates for insert
  with check (
    exists (
      select 1 from public.profiles
      where id = auth.uid() and role = 'admin'
    )
  );

create policy "Admins can update candidates"
  on public.candidates for update
  using (
    exists (
      select 1 from public.profiles
      where id = auth.uid() and role = 'admin'
    )
  );

create policy "Admins can delete candidates"
  on public.candidates for delete
  using (
    exists (
      select 1 from public.profiles
      where id = auth.uid() and role = 'admin'
    )
  );

-- Votes policies
create policy "Users can view their own votes"
  on public.votes for select
  using (auth.uid() = voter_id);

create policy "Admins can view all votes"
  on public.votes for select
  using (
    exists (
      select 1 from public.profiles
      where id = auth.uid() and role = 'admin'
    )
  );

create policy "Students can insert votes"
  on public.votes for insert
  with check (auth.uid() = voter_id);
