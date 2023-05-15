create policy "Enable delete for users based on user_id"
on "public"."todos"
as permissive
for delete
to public
using ((auth.uid() = user_id));


create policy "Enable insert for authenticated users only"
on "public"."todos"
as permissive
for insert
to authenticated
with check (true);



