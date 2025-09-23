-- Run this in Supabase SQL editor

-- Ensure UUID generator exists
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

CREATE TABLE public.payments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid,
  amount numeric NOT NULL,
  currency text NOT NULL DEFAULT 'INR',
  transaction_id text NOT NULL,
  name text,
  phone text,
  email text,
  status text NOT NULL DEFAULT 'pending',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE OR REPLACE FUNCTION public.updated_at_trigger()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER payments_updated_at BEFORE UPDATE ON public.payments
FOR EACH ROW EXECUTE FUNCTION public.updated_at_trigger();