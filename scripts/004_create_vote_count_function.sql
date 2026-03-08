-- Function to update vote count
create or replace function public.update_vote_count()
returns trigger
language plpgsql
security definer
as $$
begin
  if (TG_OP = 'INSERT') then
    update public.candidates
    set vote_count = vote_count + 1
    where id = new.candidate_id;
    return new;
  elsif (TG_OP = 'DELETE') then
    update public.candidates
    set vote_count = vote_count - 1
    where id = old.candidate_id;
    return old;
  end if;
  return null;
end;
$$;

-- Trigger to auto-update vote count
drop trigger if exists on_vote_change on public.votes;

create trigger on_vote_change
  after insert or delete on public.votes
  for each row
  execute function public.update_vote_count();
