-- E2 — Account Settings needs an editable avatar field that doesn't exist
-- on `users` yet (name/phone/city already did). Stored as a URL rather
-- than a real upload — there's no Storage bucket wired up for user
-- uploads yet, so this matches the "avatar" field to a pasted image URL
-- for now, same spirit as venues.cover_image.
alter table users add column if not exists avatar_url text;
