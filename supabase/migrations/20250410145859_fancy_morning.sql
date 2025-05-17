/*
  # Verify Google Auth Schema

  This migration verifies that all required tables and triggers exist for Google authentication.
*/

DO $$
BEGIN
  -- Verify user_profiles table exists
  IF NOT EXISTS (
    SELECT FROM pg_tables
    WHERE schemaname = 'public' 
    AND tablename = 'user_profiles'
  ) THEN
    RAISE EXCEPTION 'user_profiles table does not exist';
  END IF;

  -- Verify triggers exist
  IF NOT EXISTS (
    SELECT FROM pg_trigger
    WHERE tgname = 'on_auth_user_created'
  ) THEN
    RAISE EXCEPTION 'on_auth_user_created trigger does not exist';
  END IF;

  IF NOT EXISTS (
    SELECT FROM pg_trigger
    WHERE tgname = 'on_profile_update'
  ) THEN
    RAISE EXCEPTION 'on_profile_update trigger does not exist';
  END IF;
END $$;