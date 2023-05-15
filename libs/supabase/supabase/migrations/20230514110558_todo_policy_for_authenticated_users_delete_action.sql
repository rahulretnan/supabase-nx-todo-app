drop policy "Enable delete for users based on user_id" on "public"."todos";

create policy "Enable delete for users based on user_id"
on "public"."todos"
as permissive
for delete
to authenticated
using ((auth.uid() = user_id));



