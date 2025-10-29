-- Drop any views or functions that depend on the rating column
-- (Add any dependencies here if they exist)

-- Remove the rating column from the products table
ALTER TABLE products DROP COLUMN IF EXISTS rating;
