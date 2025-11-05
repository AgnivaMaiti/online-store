-- First, drop existing table if it exists
DROP TABLE IF EXISTS public.ratings CASCADE;

-- Create the table with all necessary columns
CREATE TABLE public.ratings (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    product_id BIGINT NOT NULL,
    user_id UUID NOT NULL,
    rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
    comment TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    is_approved BOOLEAN DEFAULT true,
    
    -- Add foreign key constraints
    CONSTRAINT fk_product
      FOREIGN KEY(product_id) 
      REFERENCES products(id)
      ON DELETE CASCADE,
      
    CONSTRAINT fk_user
      FOREIGN KEY(user_id) 
      REFERENCES auth.users(id)
      ON DELETE CASCADE
);

-- Create indexes
CREATE INDEX idx_ratings_product_id ON public.ratings(product_id);
CREATE INDEX idx_ratings_user_id ON public.ratings(user_id);

-- Enable RLS
ALTER TABLE public.ratings ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Enable read access for all users" 
ON public.ratings
FOR SELECT 
TO authenticated, anon
USING (is_approved = true);

CREATE POLICY "Enable insert for authenticated users"
ON public.ratings
FOR INSERT
TO authenticated
WITH CHECK (true);

CREATE POLICY "Enable update for own reviews"
ON public.ratings
FOR UPDATE
TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- Create policy to allow service_role to delete any review
CREATE POLICY "Enable delete for service role"
ON public.ratings
FOR DELETE
TO service_role
USING (true);

-- Allow authenticated users to delete their own reviews
CREATE POLICY "Enable delete for own reviews"
ON public.ratings
FOR DELETE
TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Enable all for admin"
ON public.ratings
TO service_role
USING (true)
WITH CHECK (true);

-- Create helper function
CREATE OR REPLACE FUNCTION public.get_user_name(user_id UUID)
RETURNS TEXT AS $$
  SELECT raw_user_meta_data->>'name' 
  FROM auth.users 
  WHERE id = user_id;
$$ LANGUAGE SQL STABLE;