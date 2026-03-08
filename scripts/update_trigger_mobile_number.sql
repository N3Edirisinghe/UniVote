-- Update trigger to include mobile_number when creating profile
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email, full_name, student_id, role, mobile_number)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'full_name', ''),
    coalesce(new.raw_user_meta_data->>'student_id', ''),
    coalesce(new.raw_user_meta_data->>'role', 'student'),
    coalesce(new.raw_user_meta_data->>'mobile_number', '')
  )
  on conflict (id) do nothing;
  return new;
end;
$$ language plpgsql security definer;



