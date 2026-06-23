-- Onboarding redesign: sign-up now lands on a profile-completion step
-- (phone, date of birth, avatar) instead of blocking on email
-- confirmation, and email verification is deferred until a user actually
-- tries to book (see app/actions/bookings.ts). date_of_birth is what lets
-- us enforce venues.min_age at booking time below.
alter table users add column if not exists date_of_birth date;

-- Some venues (nightlife/exclusive) have an age minimum. Nullable — null
-- means no restriction. Checked against users.date_of_birth in
-- createBooking (app/actions/bookings.ts), not enforced by RLS, same
-- pattern as every other booking-eligibility rule in that function.
alter table venues add column if not exists min_age int;
