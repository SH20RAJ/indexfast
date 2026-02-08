
alter table sites 
add column if not exists indexnow_key text default md5(random()::text);
