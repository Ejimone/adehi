-- Expose the `gabriel` schema through PostgREST alongside the existing ones.
-- Additive: `public` and `graphql_public` are preserved so the other portfolio
-- in this project keeps working.
--
-- NOTE: this is a role-level override. Changing "Exposed schemas" in the
-- Supabase dashboard later can reset it, so the same value should also be set
-- at Settings -> API -> Exposed schemas to make it durable.
alter role authenticator set pgrst.db_schemas = 'public, graphql_public, gabriel';

notify pgrst, 'reload config';
