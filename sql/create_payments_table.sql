-- Create payments table if it doesn't exist
CREATE TABLE IF NOT EXISTS public.payments (
  id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  user_id uuid,
  amount numeric(10,2) NOT NULL DEFAULT 0.00,
  items jsonb,
  status text,
  transaction_id text,
  payer_name text,
  payer_phone text,
  payer_email text,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- Ensure columns exist if the table already existed (safe to re-run)
ALTER TABLE IF EXISTS public.payments
  ADD COLUMN IF NOT EXISTS items jsonb,
  ADD COLUMN IF NOT EXISTS status text,
  ADD COLUMN IF NOT EXISTS transaction_id text,
  ADD COLUMN IF NOT EXISTS payer_name text,
  ADD COLUMN IF NOT EXISTS payer_phone text,
  ADD COLUMN IF NOT EXISTS payer_email text,
  ADD COLUMN IF NOT EXISTS created_at timestamptz DEFAULT now();

-- Optional: index transaction_id for faster lookups
CREATE INDEX IF NOT EXISTS idx_payments_transaction_id ON public.payments (transaction_id);
