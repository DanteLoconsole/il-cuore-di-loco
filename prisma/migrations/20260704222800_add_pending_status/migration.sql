-- Add the new enum value in its own migration/transaction. Postgres requires a
-- new enum value to be committed before it can be referenced (e.g. as a column
-- default), so this must be separate from the migration that uses it.
ALTER TYPE "BookingStatus" ADD VALUE 'PENDING';
