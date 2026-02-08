
create table if not exists submissions (
  id uuid default gen_random_uuid() primary key,
  site_id uuid references sites not null,
  url text not null,
  status int,
  submitted_at timestamp with time zone default timezone('utc'::text, now()) not null,

  unique(site_id, url)
);

alter table submissions enable row level security;

create policy "Users can view submissions for their sites"
on submissions for select
using (
  exists (
    select 1 from sites
    where sites.id = submissions.site_id
    and sites.user_id = auth.uid()
  )
);
