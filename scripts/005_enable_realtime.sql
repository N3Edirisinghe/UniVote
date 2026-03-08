-- Enable realtime for candidates table to get live vote count updates
alter publication supabase_realtime add table candidates;
alter publication supabase_realtime add table votes;
alter publication supabase_realtime add table elections;
