-- Function to check if a table exists
CREATE OR REPLACE FUNCTION table_exists(table_name text)
RETURNS boolean AS $$
DECLARE
    result boolean;
BEGIN
    EXECUTE format('SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE  table_schema = %L
        AND    table_name   = %L
    )', 'public', table_name) INTO result;
    
    RETURN result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
