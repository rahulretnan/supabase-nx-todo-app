create policy "Enable read access for all users"
on "public"."todos"
as permissive
for select
to anon
using (true);



